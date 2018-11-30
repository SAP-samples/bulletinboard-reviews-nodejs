FROM node:8.14-alpine

# Create app directory
WORKDIR /usr/src/bulletinboard-reviews

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 9090

CMD ["npm", "run", "start"]