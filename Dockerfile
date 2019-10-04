# A lightweight node image
FROM node:10-alpine

RUN apk add --no-cache \
    build-base cairo-dev cairo cairo-tools pango-dev libjpeg-turbo-dev \
    python

# PM2 will be used to run a cluster of node instances for multicore support
RUN yarn global add pm2@3.5.0

# Copy package.json and yarn.lock files so that `RUN yarn install` layer below is only run when these change
COPY package.json /var/www/package.json
COPY yarn.lock /var/www/yarn.lock

# Set up working dir
WORKDIR /var/www

# Install packages
RUN yarn install

# Copy source files (note exceptions in .dockerignore)
COPY . ./

# Expose port
EXPOSE 3000

# Start PM2 as PID 1 process
ENTRYPOINT ["pm2-docker"]

# Actual script to start can be overridden from `docker run`
CMD ["ecosystem.config.js"]
