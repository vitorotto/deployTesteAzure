require("dotenv-safe").config();
const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();
const PORT = process.env.PORT;
let user = [{
  id: 1,
  email: "email@email.com",
  password: "12345678"
}]

function genToken(id) {
  return jwt.sign({ id: id }, JWT_SECRET, { expiresIn: "40m" })
}

function decodeToken(token) {
  return jwt.verify( token, JWT_SECRET, ( err,user) => {
    if(err) {
      return false
    } else {
      return user
    }
  })
}

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']

  if(!token) return res.status(401).json('Sem token')

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ auth: false, message: 'Falha na autenticação do token', err: err });
    req.userId = decoded.id;
    next()
  })
}

// Permite que o Express entenda JSON no corpo da requisição
app.use(express.json());

// Permite servir arquivos HTML e JS do diretório 'public'
app.use(express.static('public'));

// Simulando um banco de dados em memória
let dados = [
  { id: 1, message: 'Primeira mensagem' },
  { id: 2, message: 'Segunda mensagem' }
];

app.post('/api/login', (req, res) => {
  const { id, email, password } = req.body

  const data = user.find(us => {
    if (us.email === email && us.password === password) {
      return us
    }
  });

  if(data) {
    const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 300 })
    return res.json({ auth: true, token: token });
  }

  res.status(500).json({ message: "Login inválido" });
})

app.post('/api/logout', (req, res) => {
  res.json({ auth: false, token: null })
})

// GET com ou sem IDcjccycy
app.get('/api/data', authMiddleware, (req, res) => {
  return res.status(200).json(dados)
})

app.get('/api/data/:id', (req, res) => {
    const { id } = req.params; // Acessando param da URL (ex: /api/data/1)
    if (id) {
      const item = dados.find(d => d.id == id);
      if (!item) {
        return res.status(404).json({ error: 'ID não encontrado' });
      }
      return res.status(200).json(item);
    }
    // Se não passar id, retorna todos
    res.status(200).json(dados);
  });

  
// POST - Cria novo registro
app.post('/api/data', (req, res) => {
  const { message } = req.body; // Acessando corpo da requisição
  if (!message) {
    return res.status(400).json({ error: 'Campo "message" é obrigatório' });
  }
  const novo = {
    id: dados.length ? Math.max(...dados.map(d => d.id)) + 1 : 1,
    message
  };
  dados.push(novo);
  res.status(201).json(novo);
});

// PUT - Atualiza completamente um registro existente
app.put('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const index = dados.findIndex(d => d.id == id);
  if (index === -1) {
    return res.status(404).json({ error: 'ID não encontrado' });
  }
  if (!message) {
    return res.status(400).json({ error: 'Campo "message" é obrigatório' });
  }
  dados[index].message = message;
  res.status(200).json(dados[index]);
});

// PATCH - Atualiza parcialmente um registro
app.patch('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const item = dados.find(d => d.id == id);
  if (!item) {
    return res.status(404).json({ error: 'ID não encontrado' });
  }
  if (!message) {
    return res.status(400).json({ error: 'Campo "message" é obrigatório' });
  }
  item.message += ' ' + message;
  res.status(200).json(item);
});

// DELETE - Remove um item pelo ID
app.delete('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const index = dados.findIndex(d => d.id == id);
  if (index === -1) {
    return res.status(404).json({ error: 'ID não encontrado' });
  }
  dados.splice(index, 1);
  res.status(204).send(); // No Content
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
