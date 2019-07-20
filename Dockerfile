FROM node:alpine AS build
WORKDIR /app
COPY . .
RUN npm install && \
    npm run build

FROM nginx:alpine
COPY --from=build /app/dist/* /usr/share/nginx/html/
RUN rm -v /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
