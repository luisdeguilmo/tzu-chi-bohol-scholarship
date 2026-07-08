FROM php:8.3-apache
RUN docker-php-ext-install pdo pdo_mysql

# Enable mod_rewrite (required for .htaccess RewriteRule directives)
RUN a2enmod rewrite

# Allow .htaccess overrides for the document root
RUN sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY . .
RUN composer dump-autoload --optimize
EXPOSE 80
