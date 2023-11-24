FROM node:18.16.1

WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 8000 
CMD node server.js