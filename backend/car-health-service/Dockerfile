FROM node:20-alpine

WORKDIR /app

COPY . .

RUN mkdir -p /app/oci/

# RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]