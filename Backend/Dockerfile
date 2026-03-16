FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies including nodemon globally
RUN npm install
RUN npm install -g nodemon

COPY . .

CMD ["nodemon", "--exec", "ts-node", "src/server.ts", "--watch", "src", "--ext", "ts"]