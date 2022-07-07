FROM node:17

WORKDIR /user/src/app

COPY package.json ./

COPY ./dist ./dist

RUN npm install --only=prod

COPY . .

EXPOSE 5050

CMD ["npm", "run", "start"]