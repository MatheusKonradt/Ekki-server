FROM node:10.10.0

WORKDIR /usr/app

RUN npm install -g pm2
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]