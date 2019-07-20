FROM node:10 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN ng build --prod

FROM nginx:alpine
COPY --from=build /usr/src/app/dist/* /usr/share/nginx/html/
RUN rm -v /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
