FROM nginx:latest
COPY . /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
RUN rm Dockerfile
RUN chown -R nginx:nginx *
