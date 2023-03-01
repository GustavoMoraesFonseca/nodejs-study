FROM node:19.6.0-alpine as builder
WORKDIR /app
COPY package.json /app
RUN npm install --silent
COPY . .
EXPOSE 8080
CMD ["node", "src/loader.js"]
