# Deployment Guide — tree.eastlink.xyz (Shared Hosting)

## Server Structure

```
/home/u404765524/domains/tree.eastlink.xyz/
├── app/
├── bootstrap/
├── config/
├── database/
├── resources/
├── routes/
├── storage/
├── vendor/          ← created by "composer install"
├── artisan
├── composer.json
├── composer.lock
├── .env             ← create from .env.production
└── public_html/     ← this is Laravel's "public" folder
    ├── index.php    ← Laravel entry point
    ├── index.html   ← React SPA (built)
    ├── assets/      ← React JS/CSS (built)
    ├── .htaccess
    ├── storage/     ← symlink to ../storage/app/public
    └── robots.txt
```

---

## Step-by-Step Deployment

### 1. Clone from GitHub (SSH into server)

```bash
cd /home/u404765524/domains/tree.eastlink.xyz
git clone https://github.com/puranbthapa/family_tree.git temp
mv temp/* temp/.* . 2>/dev/null
rm -rf temp
```

### 2. Move public files to public_html

```bash
# Copy Laravel's public folder contents into public_html
cp -r public/* public_html/
cp public/.htaccess public_html/
```

### 3. Update index.php paths

Edit `public_html/index.php` — update these two lines:

```php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
```

Since `public_html` is already at the same level as `vendor/` and `bootstrap/`, these paths are correct as-is.

### 4. Create .env

```bash
cp .env.production .env
nano .env
```

Fill in your actual database credentials:

```env
DB_DATABASE=your_actual_db_name
DB_USERNAME=your_actual_db_user
DB_PASSWORD=your_actual_db_password
```

### 5. Install PHP dependencies

```bash
composer install --no-dev --optimize-autoloader
```

### 6. Generate app key

```bash
php artisan key:generate
```

### 7. Run migrations

```bash
php artisan migrate --force
```

### 8. Storage link

```bash
# Remove the old public/storage symlink if exists
rm -f public_html/storage

# Create symlink from public_html/storage → ../storage/app/public
ln -s ../storage/app/public public_html/storage
```

### 9. Set permissions

```bash
chmod -R 775 storage bootstrap/cache
```

### 10. Cache config for production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Updating the App (After Changes)

### On your local machine:

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Commit & push
cd ..
git add -A
git commit -m "Update"
git push origin main
```

### On the server:

```bash
cd /home/u404765524/domains/tree.eastlink.xyz

# Pull latest code
git pull origin main

# Copy updated public files
cp -r public/* public_html/

# Install any new dependencies
composer install --no-dev --optimize-autoloader

# Run any new migrations
php artisan migrate --force

# Clear & rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Database Setup (Hostinger)

1. Go to Hostinger panel → **Databases** → **MySQL Databases**
2. Create a new database (e.g., `u404765524_familytree`)
3. Create a database user and assign it to the database
4. Use these credentials in your `.env` file

---

## Troubleshooting

- **500 error?** → Check `storage/logs/laravel.log`, ensure permissions on `storage/` and `bootstrap/cache/`
- **Blank page?** → Make sure `public_html/index.html` exists (React build) and `.htaccess` is present
- **API 404?** → Ensure `public_html/index.php` exists and paths to `vendor/autoload.php` are correct
- **CORS errors?** → Check `config/cors.php` includes `https://tree.eastlink.xyz`
