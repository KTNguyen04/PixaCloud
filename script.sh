#!/bin/bash

# Update and install curl
sudo yum update -y
sudo yum install -y curl

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


# install node, pm2
nvm install node
npm install -g pm2

# install git, aws-cli, jq
sudo yum install -y git aws-cli jq


# Install Nginx
sudo yum install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
# Config Nginx for port forwarding 
NGINX_CONF="/etc/nginx/nginx.conf"
sudo tee $NGINX_CONF > /dev/null <<EOF
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
	types_hash_max_size 2048;
    types_hash_bucket_size 128;
    
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    sendfile on;
    keepalive_timeout 65;

    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://127.0.0.1:3000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        }
    }
}
EOF


# Clone repository PixaCloud from GitHub
git clone https://github.com/KTNguyen04/PixaCloud.git /home/ec2-user/PixaCloud
cd /home/ec2-user/PixaCloud/backend

# Get RDS credentials from Secrets Manager and put into .env
aws secretsmanager get-secret-value --secret-id 'rds!db-6ac25efe-1a97-404d-bf16-b8e87846024b' --region us-east-1 | \
jq -r '.SecretString | fromjson | "DB_USER=\(.username)\nDB_PASSWORD=\(.password)"' >> /home/ec2-user/PixaCloud/backend/.env

DB_INFO=$(aws rds describe-db-instances --region us-east-1 --query "DBInstances[?DBInstanceIdentifier=='pixacloud-db'].[Endpoint.Address, Endpoint.Port, DBName, Engine]" --output json)

DB_HOST=$(echo $DB_INFO | jq -r '.[0][0]')
DB_PORT=$(echo $DB_INFO | jq -r '.[0][1]')
DB_NAME=$(echo $DB_INFO | jq -r '.[0][2]')
DB_ENGINE=$(echo $DB_INFO | jq -r '.[0][3]')

# Add to .env
cat <<EOF >> /home/ec2-user/PixaCloud/backend/.env
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DIALECT=$DB_ENGINE
S3_REGION=us-east-1
S3_BUCKET_NAME=pixacloud252
EOF

# Get others credentials
aws secretsmanager get-secret-value --secret-id pc-secretkey --region us-east-1 | \
jq -r '.SecretString | fromjson | to_entries | map("\(.key)=\(.value)") | join("\n")' >> /home/ec2-user/PixaCloud/backend/.env

# Download Certificate Bundle to enable ssh connection to rds
wget https://truststore.pki.rds.amazonaws.com/us-east-1/us-east-1-bundle.pem -O rds-ca.pem


# Install dependencies
npm install

# Check and free port 3000 if in use
PORT=3000
PID=$(sudo lsof -t -i:$PORT)
if [ -n "$PID" ]; then
  echo "Port $PORT is in use by PID $PID. Killing it..."
  sudo kill -9 $PID
fi

# Stop and delete any existing PM2 process
pm2 stop "pixa-cloud" || true
pm2 delete "pixa-cloud" || true

# Run app with pm2
pm2 start ./bin/www --name "pixa-cloud"

# Restart Nginx
sudo systemctl restart nginx

# Save the list of running processes to restart on reboot
pm2 save

# Ensure the correct ownership of the project directory
sudo chown -R ec2-user:ec2-user /home/ec2-user/PixaCloud