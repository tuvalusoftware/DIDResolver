FROM node:18

LABEL maintainer="HaoHuynh<hao152903@gmail.com>"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

CMD ["node", "server.js"]