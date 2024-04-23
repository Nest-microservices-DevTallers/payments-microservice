FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package-lock.json ./
COPY package.json ./

RUN npm i

COPY . .

EXPOSE 3003