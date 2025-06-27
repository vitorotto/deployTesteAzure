FROM node:18-slim

WORKDIR /server

# Copy package files
COPY package*.json ./

# Install dependecies
RUN npm install

# Copy application files
COPY . .

# Expose PORT
EXPOSE 4000

# Start the application
CMD ["npm", "start"]