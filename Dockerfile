FROM node:12.13.0-slim

RUN apt-get update \
	&& apt-get install -y make g++ python \
	&& mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY package*.json ./

RUN npm install -g sequelize-cli
RUN npm install -g nodemon

ENV NODE_ENV=development

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8000

CMD ["npm","run","dev"]
