FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY server ./server
COPY public ./public
ENV NODE_ENV=production HOST=0.0.0.0 PORT=10000 DATA_DIR=/data COOKIE_SECURE=1
VOLUME /data
EXPOSE 10000
CMD ["node", "--no-warnings", "server/index.js"]
