FROM node:15-alpine 

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

COPY nest-cli.json ./

RUN npm ci

COPY . ./

CMD ["npm","start"] 