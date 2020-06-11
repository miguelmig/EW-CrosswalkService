FROM node:14-stretch
WORKDIR /app
RUN apt-get update
RUN apt-get install -y mysql-server
COPY package*.json ./
RUN npm install
COPY . .
RUN /etc/init.d/mysql start && \
	mysql < migration.sql
RUN npm install
CMD /etc/init.d/mysql start && \
	npm start

EXPOSE 3004