FROM node:10.18-alpine3.10

WORKDIR /app
COPY package*.json ./
COPY js ./js
COPY ui ./ui
COPY migrations ./migrations

RUN npm ci

EXPOSE 9090
ENTRYPOINT [ "npm"]
CMD [ "start" ]