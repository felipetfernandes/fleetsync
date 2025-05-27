FROM nginx:stable-alpine

# Remove a configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada
COPY nginx.conf /etc/nginx/conf.d/

# Se for usar HTTPS, descomente a linha abaixo
COPY ./ssl /etc/ssl

EXPOSE 80
# Se for usar HTTPS
EXPOSE 443 

CMD ["nginx", "-g", "daemon off;"]

