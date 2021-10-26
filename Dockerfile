FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
COPY js ./js
COPY ui ./ui

RUN npm ci --only=production

EXPOSE 9090

CMD [ "npm", "start" ]
