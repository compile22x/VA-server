FROM node:16
EXPOSE 9966
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN mkdir -p /app/server/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /app/server/ssl/domain.key \
    -out /app/server/ssl/domain.crt \
    -subj "/CN=localhost" && \
    cp /app/server/ssl/domain.crt /app/server/ssl/root.crt
CMD ["node", "server.js"]
