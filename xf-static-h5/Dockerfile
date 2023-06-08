ARG image_proxy

FROM $image_proxy/nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
USER root

ADD dist/spa ./
ADD nginx.conf /etc/nginx/nginx.conf
