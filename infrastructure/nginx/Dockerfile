FROM nginx

COPY /nginx/content /usr/share/nginx
COPY /nginx/conf /etc/nginx

# VOLUME /usr/share/nginx/html
# VOLUME /etc/nginx

RUN rm /etc/nginx/conf.d/default.conf
RUN ls /etc/nginx/conf.d
