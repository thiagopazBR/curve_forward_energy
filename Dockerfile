##########################################################################
# First Stage buider                                                     #
# for dev, please run: docker build --target=builder -t backend-dev:v1 . # 
##########################################################################
FROM node:lts-alpine as builder

# Update packages and install git and tzada
RUN apk update && apk add --no-cache git && apk add --no-cache tzdata
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime
RUN echo $TZ > /etc/timezone

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

ENV NODE_ENV=development
RUN npm i --location=global npm@latest \
  && npm install

COPY . .

RUN npm run build

#############################################################
# Second Stage buider                                       #
#############################################################
FROM node:lts-alpine

# Update packages and install tzada
RUN apk update && apk add --no-cache tzdata
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime
RUN echo $TZ > /etc/timezone

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

ENV NODE_ENV=production
RUN npm i --location=global npm@latest
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/build ./build
COPY .env.sample .env

CMD [ "node", "build/index.js" ]