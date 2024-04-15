FROM node:20

RUN apt-get update && apt-get install -y \
    apt-utils \
    libaio1 \
    vim

COPY ./instantclient_21_9 /usr/instantclient_21_9

WORKDIR /app

COPY . .

#RUN npm install

ENV LD_LIBRARY_PATH="/usr/instantclient_21_9:$LD_LIBRARY_PATH"
ENV TNS_ADMIN=/app/wallet

EXPOSE 8080

CMD [ "npm", "start" ]