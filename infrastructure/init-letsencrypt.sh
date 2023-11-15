#!/bin/bash

#Based off of https://github.com/wmnnd/nginx-certbot

domains=(discman.live www.discman.live)
rsa_key_size=4096
data_path="./certbot"
email="anders.kfd@gmail.com" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits


echo "### Downloading recommended TLS parameters into certbot container"
docker-compose run --rm --entrypoint "\
  wget -O /etc/letsencrypt/options-ssl-nginx.conf https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf 
" certbot

docker-compose run --rm --entrypoint "\
  wget -O /etc/letsencrypt/ssl-dhparams.pem https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem  
" certbot
echo

echo "### Creating dummy certificate for $domains ... in nginx letsencrypt volume"
path="/etc/letsencrypt/live/$domains"
docker-compose run --rm --entrypoint "mkdir -p '/etc/letsencrypt/live/$domains'" certbot
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo


echo "### Starting nginx ..."
docker-compose up --force-recreate -d nginx
echo

echo "### Deleting dummy certificate for $domains ..."
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
echo

echo "### Requesting Let's Encrypt certificate for $domains ..."
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

echo "Create certbot directory and request letsencrypt cert for domains"
docker-compose run --rm --entrypoint "mkdir -p '/var/www/certbot'" certbot
docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo

echo "### Restarting nginx and certbot containers"
docker-compose down
docker-compose up nginx certbot