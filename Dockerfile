FROM node:12

# Set initial working directory
WORKDIR /usr/src/app

# Copy Backend / Frontend's transpiled JavaScript and assets into image
# Backend
COPY package*.json ./
COPY dist ./dist
# Frontend
COPY client/package*.json ./client/
COPY client/build ./client/build/

# Set 'node' user as owner of directories that PM2 will require access to
# Install PM2 process manager
RUN chown -R node:node /usr/src/app /usr/local/lib/node_modules
RUN npm install pm2 -g
USER node

# Install backend and frontend's dependencies
RUN npm ci --only=production
WORKDIR /usr/src/app/client
RUN npm ci --only=production
# Set working directory to image root again
WORKDIR /usr/src/app/

# Expose API port to the outside
EXPOSE 80
EXPOSE 443

ENV NODE_ENV=production

CMD ["pm2-runtime", "dist/server.js"]