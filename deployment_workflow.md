# Deployment Workflow for Web Application to VPS

## 1. Prepare the Application
- Ensure all dependencies are installed:
  ```bash
  npm install
  ```
- Build the application for production:
  ```bash
  npm run build
  ```

## 2. Set Up the VPS
- **Connect to the VPS**:
  ```bash
  ssh user@your_vps_ip
  ```
- **Update the package manager**:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```
- **Install Node.js and npm**:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
  sudo apt install -y nodejs
  ```
- **Install Nginx**:
  ```bash
  sudo apt install -y nginx
  ```

## 3. Deploy the Application
- **Transfer application files to the VPS** (using SCP or any other method):
  ```bash
  scp -r . user@your_vps_ip:/path/to/your/app
  ```
- **Navigate to the application directory**:
  ```bash
  cd /path/to/your/app
  ```
- **Install production dependencies**:
  ```bash
  npm install --production
  ```

## 4. Configure the Web Server
- **Create a new Nginx configuration file**:
  ```bash
  sudo nano /etc/nginx/sites-available/your_app
  ```
- **Add the following configuration**:
  ```
  server {
      listen 80;
      server_name your_domain_or_ip;

      location / {
          proxy_pass http://localhost:3000; # Adjust the port if necessary
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }
  }
  ```
- **Enable the configuration**:
  ```bash
  sudo ln -s /etc/nginx/sites-available/your_app /etc/nginx/sites-enabled/
  ```
- **Test the Nginx configuration**:
  ```bash
  sudo nginx -t
  ```
- **Restart Nginx**:
  ```bash
  sudo systemctl restart nginx
  ```

## 5. Set Up Environment Variables
- **Create a `.env` file in the application directory** and add necessary environment variables.

## 6. Start the Application
- **Use a process manager like PM2 to run the application**:
  ```bash
  npm install -g pm2
  pm2 start npm --name "your_app_name" -- run start
  pm2 startup
  pm2 save
  ```

## 7. Testing
- Open your browser and navigate to `http://your_domain_or_ip` to verify that the application is running correctly.

## Notes
- Ensure that your firewall allows traffic on port 80 (HTTP) and 443 (HTTPS if using SSL).
- Consider setting up SSL using Let's Encrypt for secure connections.
