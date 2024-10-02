ARG image_proxy

FROM $image_proxy/nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
USER root

RUN mkdir -p ./admin
ADD build ./admin/
ADD .tmp/data.db ./.tmp/data.db
ADD nginx.conf /etc/nginx/nginx.conf
