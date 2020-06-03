FROM markoshust/magento-php:7.3-fpm-6

COPY .docker-magento/magento2-2.3.4.tar.gz /tmp/magento2-2.3.4.tar.gz

# unzip into /www/var/html
RUN echo $(ls /var/www/html)
RUN tar xzf /tmp/magento2-2.3.4.tar.gz -o -C /var/www/html
RUN echo $(ls /var/www/html)
# # composer install
RUN composer global require hirak/prestissimo
RUN composer install
# RUN echo $(ls /tmp/)

# # install eslint
# RUN npm install -g eslint@7.1.0

# # run setup
# RUN bin/magento setup:install \
#   --db-host=db \
#   --db-name=magento \
#   --db-user=magento \
#   --db-password=magento \
#   --base-url=https://degicaexample.au.ngrok.io/ \
#   --admin-firstname=John \
#   --admin-lastname=Smith \
#   --admin-email=john.smith@gmail.com \
#   --admin-user=john.smith \
#   --admin-password=password123 \
#   --language=en_US \
#   --currency=JPY \
#   --timezone=Asia/Tokyo \
#   --amqp-host=rabbitmq \
#   --amqp-port=5672 \
#   --amqp-user=guest \
#   --amqp-password=guest \
#   --amqp-virtualhost=/ \
#   --use-rewrites=1

# # all the magento setup steps
# RUN bin/magento deploy:mode:set developer
# RUN bin/magento indexer:reindex
# RUN bin/magento setup:static-content:deploy -f
# RUN bin/magento setup:config:set --no-interaction --cache-backend=redis --cache-backend-redis-server=redis --cache-backend-redis-db=0

# RUN bin/magento setup:config:set --no-interaction  --page-cache=redis --page-cache-redis-server=redis --page-cache-redis-db=1
# RUN bin/magento setup:config:set --no-interaction --session-save=redis --session-save-redis-host=redis --session-save-redis-log-level=4 --session-save-redis-db=2
# RUN bin/magento cache:flush