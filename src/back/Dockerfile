FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3500

CMD [ "node", "index.js", "listen" ]
