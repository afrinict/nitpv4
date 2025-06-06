#!/bin/bash

# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install nginx
sudo apt install -y nginx

# Configure nginx
sudo tee /etc/nginx/sites-available/nitp << EOF
server {
    listen 80;
    server_name _;

    # Client
    location / {
        root /var/www/nitp/client/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/nitp /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Create application directory
sudo mkdir -p /var/www/nitp
sudo chown -R ubuntu:ubuntu /var/www/nitp

# Restart nginx
sudo systemctl restart nginx 