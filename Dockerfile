FROM node:17

WORKDIR /user/src/app

COPY package.json ./

RUN npm install --only=prod
