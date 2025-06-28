# Erro: Socket hang up no Ubuntu

### Possível solução 01:
01.01 - Editar o código para do .listen para ver o host "0.0.0.0"
Desta forma:
```javascript
app.listen(PORT, '0.0.0.0',  () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```
01.02 - Rodar com o comando:
```bash
docker run -d -p 3000:3000 --name teste teste-docker
```

### Possivel solução 02:
Reinstalar o docker no computador seguindo os passos CORRETAMENTE do passo a passo no site do docker
>[!alert] Atenção!!!
>Instalar seguindo o passo-a-passo disponível neste endereço: https://docs.docker.com/desktop/setup/install/linux/ubuntu/
>Seguir todos os passos completamente, inclusive e principalmente, o passo número 1 para configurar o repositório do docker no seu PC.

Depois de reinstalar certifique-se de realizar a Possível solução 01 e teste para ver se funcionou...