FROM node:16.15.0-alpine as builder

WORKDIR /home/app

COPY package.json /home/app/
COPY yarn.lock /home/app/

RUN yarn install

COPY . /home/app/

RUN yarn build

FROM node:16.15.0-alpine

WORKDIR /home/app

COPY --from=builder /home/app/package.json /home/app/
COPY --from=builder /home/app/yarn.lock /home/app/

RUN yarn global add pm2
RUN yarn add cross-env 
COPY --from=builder /home/app/dist /home/app/dist

EXPOSE 4000

CMD ["yarn", "start:prod-docker"]