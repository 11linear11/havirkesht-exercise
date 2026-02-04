# 🚀 راهنمای استقرار (Deployment)

## پیش‌نیازها

- سرور با دسترسی به اینترنت
- دامنه یا IP ثابت
- Nginx یا Apache (اختیاری)
- Node.js برای کامپایل CSS (فقط در زمان توسعه)

---

## روش‌های استقرار

### 1. استقرار ساده (Static Hosting)

#### آماده‌سازی فایل‌ها

```bash
# کامپایل CSS نهایی
npm run build:css

# فایل‌های مورد نیاز برای آپلود:
# - index.html
# - css/output.css
# - css/custom.css
# - js/*.js
# - fonts/*.woff2
# - pages/admin/*.html
```

#### آپلود به سرور

```bash
# با SCP
scp -r . user@server:/var/www/havirkesht/

# یا با rsync
rsync -avz --exclude='node_modules' --exclude='.git' . user@server:/var/www/havirkesht/
```

---

### 2. استقرار با Nginx

#### نصب Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### تنظیمات Nginx

فایل `/etc/nginx/sites-available/havirkesht`:

```nginx
server {
    listen 80;
    server_name havirkesht.ir www.havirkesht.ir;
    
    root /var/www/havirkesht;
    index index.html;
    
    # فشرده‌سازی Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
    
    # کش فایل‌های استاتیک
    location ~* \.(css|js|woff2|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # مسیریابی SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # امنیت هدرها
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### فعال‌سازی

```bash
# ایجاد لینک
sudo ln -s /etc/nginx/sites-available/havirkesht /etc/nginx/sites-enabled/

# تست تنظیمات
sudo nginx -t

# ریستارت Nginx
sudo systemctl restart nginx
```

---

### 3. استقرار با HTTPS (Let's Encrypt)

#### نصب Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

#### دریافت گواهی SSL

```bash
sudo certbot --nginx -d havirkesht.ir -d www.havirkesht.ir
```

#### تنظیمات خودکار تمدید

```bash
# تست تمدید
sudo certbot renew --dry-run

# cron job خودکار (معمولاً Certbot این را اضافه می‌کند)
0 12 * * * /usr/bin/certbot renew --quiet
```

---

### 4. استقرار با Docker

#### Dockerfile

```dockerfile
FROM nginx:alpine

# کپی فایل‌های پروژه
COPY . /usr/share/nginx/html/

# کپی تنظیمات Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf (برای Docker)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(css|js|woff2)$ {
        expires 30d;
    }
}
```

#### ساخت و اجرا

```bash
# ساخت ایمیج
docker build -t havirkesht:latest .

# اجرا
docker run -d -p 80:80 --name havirkesht havirkesht:latest

# با docker-compose
docker-compose up -d
```

#### docker-compose.yml

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

---

### 5. استقرار روی GitHub Pages

```bash
# 1. ایجاد branch جدید
git checkout -b gh-pages

# 2. کامپایل CSS
npm run build:css

# 3. کامیت و پوش
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 4. فعال‌سازی در Settings > Pages
```

---

### 6. استقرار روی Vercel

```bash
# نصب Vercel CLI
npm i -g vercel

# استقرار
vercel

# یا برای production
vercel --prod
```

#### vercel.json

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
      ]
    }
  ]
}
```

---

## تنظیمات محیطی

### تغییر آدرس API

فایل `js/config.js`:

```javascript
const CONFIG = {
    // برای محیط توسعه
    // API_BASE_URL: 'https://localhost:8000',
    
    // برای محیط تولید
    API_BASE_URL: 'https://edu-api.havirkesht.ir',
    
    // سایر تنظیمات...
};
```

---

## چک‌لیست استقرار

- [ ] کامپایل CSS نهایی (`npm run build:css`)
- [ ] بررسی آدرس API در `config.js`
- [ ] تست همه صفحات
- [ ] فعال‌سازی HTTPS
- [ ] تنظیم کش مناسب
- [ ] فعال‌سازی Gzip
- [ ] بررسی هدرهای امنیتی
- [ ] تست روی مرورگرهای مختلف
- [ ] بررسی عملکرد روی موبایل

---

## مانیتورینگ

### بررسی لاگ‌ها

```bash
# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Docker
docker logs -f havirkesht
```

### بررسی وضعیت

```bash
# Nginx
sudo systemctl status nginx

# Docker
docker ps
docker stats havirkesht
```

---

## پشتیبان‌گیری

```bash
# پشتیبان‌گیری از فایل‌ها
tar -czvf havirkesht-backup-$(date +%Y%m%d).tar.gz /var/www/havirkesht/

# بازیابی
tar -xzvf havirkesht-backup-20260204.tar.gz -C /
```

---

📅 آخرین به‌روزرسانی: فوریه ۲۰۲۶
