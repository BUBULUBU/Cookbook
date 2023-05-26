FROM node:latest

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3500

CMD [ "npm", "run", "start" ]