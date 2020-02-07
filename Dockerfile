FROM node:12.14.1-alpine3.11

WORKDIR /app
COPY package*.json ./
COPY js ./js
COPY ui ./ui

RUN npm ci

EXPOSE 9090
ENTRYPOINT [ "npm"]
CMD [ "start" ]