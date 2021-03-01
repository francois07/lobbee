FROM node:latest

WORKDIR /usr/bot

COPY package.json /usr/src/bot
RUN npm install

COPY . .
RUN npx tsc

CMD ["node", "dist/index.js"]