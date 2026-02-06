# Етап 1: Збірка React додатка
FROM node:22-alpine AS build
WORKDIR /app

# Копіюємо package.json
COPY package.json ./

# Включаємо режим "legacy-peer-deps", щоб npm не сварився на старі версії бібліотек
# Також додаємо очистку кешу
RUN npm install --legacy-peer-deps && npm cache clean --force

# Копіюємо решту файлів
COPY . .

# Збільшуємо пам'ять для збірки (іноді React цього потребує)
ENV NODE_OPTIONS --max-old-space-size=4096
RUN npm run build

# Етап 2: Роздача через Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]