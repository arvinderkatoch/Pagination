# Natours EC2 Deployment Guide

Complete step-by-step guide to deploy the Natours application on AWS EC2.

---

## Table of Contents
1. [Phase 1: EC2 Instance Setup](#phase-1-ec2-instance-setup)
2. [Phase 2: System Dependencies](#phase-2-system-dependencies)
3. [Phase 3: Application Setup](#phase-3-application-setup)
4. [Phase 4: Environment Configuration](#phase-4-environment-configuration) ⚠️ **CRITICAL**
5. [Phase 5: Build & Start Application](#phase-5-build--start-application)
6. [Phase 6: Reverse Proxy Setup (Nginx)](#phase-6-reverse-proxy-setup-nginx)
7. [Phase 7: SSL Certificate (HTTPS)](#phase-7-ssl-certificate-https)
8. [Phase 8: Monitoring & Maintenance](#phase-8-monitoring--maintenance)
9. [Useful Commands](#useful-commands)
10. [Troubleshooting](#troubleshooting)

---

## Phase 1: EC2 Instance Setup

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2 → Instances → Launch Instance
2. **AMI**: Choose **Ubuntu 22.04 LTS** (free tier eligible)
3. **Instance Type**: 
   - Free tier: `t2.micro`
   - Recommended: `t3.small` (better CPU performance)
4. **Storage**: 20-30 GB (gp3)
5. **Security Group**: Create new with these inbound rules:
   - Port 22 (SSH): From your IP
   - Port 80 (HTTP): From 0.0.0.0/0
   - Port 443 (HTTPS): From 0.0.0.0/0
   - Port 3000 (Node.js): From 0.0.0.0/0 (for testing)
6. **Key Pair**: Create or select existing

### Step 2: Connect to Instance
```bash
# Make key readable only by you
chmod 400 /Users/arvinderkatoch/Downloads/EC2/Natours.pem 

# Connect via SSH
ssh -i /path/to/your-key.pem ubuntu@YOUR-INSTANCE-IP
ssh -i /Users/arvinderkatoch/Downloads/EC2/Natours.pem ubuntu@Y13.238.194.187
```

---

## Phase 2: System Dependencies

### Step 3: Update & Install Prerequisites
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git wget vim htop
```

### Step 4: Install Node.js & npm
```bash
# Add NodeSource repository (Node 18)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v18.x.x
npm --version   # Should be 9.x.x or higher
```

### Step 5: Install PM2 (Process Manager)
```bash
# Install globally
sudo npm install -g pm2

# Verify
pm2 --version
```

---

## Phase 3: Application Setup

### Step 6: Upload Your Application

#### Option A: Using Git (Recommended)
```bash
# Navigate to home directory
cd /home/ubuntu

# Clone your repository
git clone YOUR-REPO-URL
cd Backups_Natour-main-main

# List to verify files
ls -la
```

#### Option B: Using SCP (From Your Local Machine)
```bash
# Transfer entire project to EC2
scp -i /path/to/your-key.pem -r /path/to/Backups_Natour-main-main ubuntu@YOUR-INSTANCE-IP:/home/ubuntu/

# Then SSH and verify
ssh -i /path/to/your-key.pem ubuntu@YOUR-INSTANCE-IP
cd /home/ubuntu/Backups_Natour-main-main
ls -la
```

### Step 7: Install Application Dependencies
```bash
# Make sure you're in the app directory
cd /home/ubuntu/Backups_Natour-main-main

# Install all npm packages
npm install

# This will install all dependencies from package.json
```

---

## Phase 4: Environment Configuration ⚠️ **CRITICAL SECTION**

### Step 8: Update config.env for Production

#### ❌ **DO NOT** Use Original config.env
Your current `config.env` contains **live credentials**:
- MongoDB connection with password
- Stripe secret keys
- JWT secrets
- Email service credentials
- **These are NOW COMPROMISED since they're in this backup**

#### ✅ **WHAT TO DO**:

```bash
# Edit config.env on EC2
nano config.env
```

**Replace ALL values with NEW ones:**

```env
NODE_ENV=production
PORT=3000

# MongoDB - Use a NEW cluster/connection string
DATABASE="mongodb+srv://NEW-USERNAME:NEW-PASSWORD@cluster0.mongodb.net/natours?retryWrites=true&w=majority"
DATABASE_LOCAL=mongodb://localhost:27017/natours
DATABASE_PASSWORD=NEW-SECURE-PASSWORD

# Stripe - Generate new API keys from dashboard
STRIPE_SECRET_KEY=sk_live_YOUR_NEW_KEY_HERE

# JWT - Generate NEW random secret (minimum 32 characters)
JWT_SECRET=generate-a-new-random-very-long-secure-secret-key-minimum-32-chars
JWT_EXPIRES_In=90d
JWT_COOKIE_EXPIRES_IN=90d

# Email Service - Use your email service credentials
EMAIL_USERNAME=your-email-service-username
EMAIL_PASSWORD=your-email-service-password
EMAIL_HOST=your-email-service-host
Port=9950
```

#### 🔐 **How to Generate New JWT Secret**
```bash
# On EC2
openssl rand -base64 32

# Or on your local machine, then paste into config.env
```

#### 📋 **Environment Variables Checklist**
- [ ] MongoDB: Created NEW cluster
- [ ] MongoDB: Updated username & password
- [ ] Stripe: Generated NEW live keys (not test keys)
- [ ] JWT_SECRET: Generated new random string
- [ ] EMAIL credentials: Set up email service
- [ ] NODE_ENV: Set to `production`

#### **Save & Exit**
```bash
# In nano editor:
# Press Ctrl+X
# Press Y to confirm
# Press Enter to save
```

---

## Phase 5: Build & Start Application

### Step 9: Build Frontend Assets (if needed)
```bash
# Build JavaScript bundles
npm run build:js

# This creates optimized bundles in public/js/bundled/
```

### Step 10: Start with PM2
```bash
# Start the application
pm2 start server.js --name "natours"

# Save PM2 process list
pm2 save

# Configure PM2 to start on reboot
pm2 startup

# Follow the command it outputs to enable at system startup
```

### Step 11: Verify Application is Running
```bash
# Check PM2 status
pm2 status

# View real-time logs
pm2 logs natours

# Test locally on EC2
curl http://localhost:3000

# Should return HTML content if working
```

---

## Phase 6: Reverse Proxy Setup (Nginx)

### Step 12: Install Nginx
```bash
sudo apt install -y nginx
```

### Step 13: Configure Nginx
```bash
# Edit default nginx config
sudo nano /etc/nginx/sites-available/default
```

**Replace entire content with:**
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Save & Exit**: Ctrl+X → Y → Enter

### Step 14: Enable & Start Nginx
```bash
# Test configuration
sudo nginx -t
# Should output: "nginx: configuration file test is successful"

# Start Nginx
sudo systemctl start nginx

# Enable on reboot
sudo systemctl enable nginx

# Restart to apply changes
sudo systemctl restart nginx
```

### Step 15: Test Access
```bash
# From your browser or local terminal:
# Visit: http://YOUR-INSTANCE-IP

# Or from EC2:
curl http://localhost
```

---

## Phase 7: SSL Certificate (HTTPS)

### Step 16: Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Step 17: Get Free SSL Certificate
```bash
# Replace YOUR-DOMAIN.COM with your actual domain
sudo certbot --nginx -d your-domain.com

# Follow interactive prompts:
# - Enter email
# - Accept terms
# - Choose to redirect HTTP to HTTPS (YES)
```

**After success:**
```bash
# Verify SSL
curl https://your-domain.com

# Certificates auto-renew (check with):
sudo systemctl status certbot.timer
```

---

## Phase 8: Monitoring & Maintenance

### Step 18: Check Application Status
```bash
# View all PM2 processes
pm2 status

# Real-time log monitoring
pm2 logs natours

# Show last 100 lines of logs
pm2 logs natours --lines 100

# Monitor resources (CPU, Memory)
pm2 monit
```

### Step 19: Auto-restart on EC2 Reboot
```bash
# Save current PM2 configuration
pm2 save

# Create startup script
pm2 startup

# Execute the command it provides (usually):
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Verify
sudo systemctl status pm2-ubuntu
```

---

## Useful Commands

### Application Management
```bash
# Restart application
pm2 restart natours

# Stop application (keeps it saved)
pm2 stop natours

# Start after stop
pm2 start natours

# Delete from PM2
pm2 delete natours

# View all processes
pm2 list
```

### Monitoring & Logs
```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs natours

# Tail logs (new entries only)
pm2 logs natours --follow

# Clear logs
pm2 flush
```

### Nginx Management
```bash
# Check nginx status
sudo systemctl status nginx

# Restart nginx
sudo systemctl restart nginx

# Reload config (without dropping connections)
sudo systemctl reload nginx

# Test config
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### System Utilities
```bash
# Check disk usage
df -h

# Check memory
free -h

# Check CPU
top
# Press Q to exit

# Check if port is listening
lsof -i :3000      # Node.js
lsof -i :80        # Nginx

# Check running processes
ps aux | grep node
ps aux | grep nginx
```

---

## Troubleshooting

### Issue: "Cannot find module" errors
```bash
# Reinstall dependencies
cd /home/ubuntu/Backups_Natour-main-main
rm -rf node_modules
npm install
```

### Issue: Application won't start with PM2
```bash
# Check logs first
pm2 logs natours

# Common issues:
# 1. Port 3000 already in use
lsof -i :3000
kill -9 <PID>

# 2. config.env not found
# Make sure you're in correct directory
pwd  # Should be /home/ubuntu/Backups_Natour-main-main
ls config.env  # Should exist
```

### Issue: MongoDB connection failing
```bash
# Check if MongoDB connection string is valid
grep DATABASE config.env

# Ensure MongoDB Atlas:
# - IP whitelist includes your EC2 instance IP
# - Credentials are correct
# - Network access is enabled
```

### Issue: Page says "Cannot GET /"
```bash
# Node.js might not be running
pm2 status

# Restart it
pm2 restart natours
pm2 logs natours
```

### Issue: HTTPS not working after Certbot
```bash
# Certificates may not have renewed
sudo certbot renew --dry-run

# Force renew
sudo certbot renew --force-renewal

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: High memory usage
```bash
# Check which process is consuming memory
pm2 monit

# Restart the application
pm2 restart natours

# If persistence needed, add swap (temporary fix):
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## ⚠️ IMPORTANT: config.env File - LOCAL vs EC2

### When Transferring Files:

| File | Action | Reason |
|------|--------|--------|
| `config.env` | **DELETE before transferring** | Contains sensitive credentials |
| All other files | Transfer normally | No sensitive data |
| `.gitignore` | Keep | Should already ignore config.env |

### Safe Transfer Workflow:
```bash
# Step 1: On your local machine, BEFORE scp
rm config.env

# Step 2: Transfer project
scp -i your-key.pem -r ./Backups_Natour-main-main ubuntu@IP:/home/ubuntu/

# Step 3: On EC2, create new config.env with production values
nano config.env
# (Add all production credentials)

# Step 4: Set proper permissions
chmod 600 config.env
```

### Git Workflow (Recommended):
```bash
# In your local repo
echo "config.env" >> .gitignore
git rm --cached config.env
git commit -m "Remove config.env from tracking"

# Push to repo
git push

# On EC2
git clone <repo>
nano config.env
# (Add production values)
```

---

## Quick Checklist Before Going Live

- [ ] EC2 instance running
- [ ] Node.js v18+ installed
- [ ] PM2 installed globally
- [ ] Application files uploaded
- [ ] `npm install` completed without errors
- [ ] **NEW** config.env created with production values
- [ ] MongoDB connection tested
- [ ] Application starts: `pm2 start server.js`
- [ ] Nginx installed and configured
- [ ] Nginx test passes: `sudo nginx -t`
- [ ] Can access app via EC2 IP: `http://YOUR-IP`
- [ ] SSL certificate installed (if using domain)
- [ ] PM2 auto-startup configured
- [ ] Logs checked for errors: `pm2 logs`

---

## Summary

Your Natours app is now:
- ✅ Running on EC2
- ✅ Protected by Nginx reverse proxy
- ✅ Using PM2 for process management
- ✅ Secured with SSL/HTTPS (if domain configured)
- ✅ Auto-restarts on server reboot

For production-grade setup with auto-scaling, load balancing, and containerization, refer to the separate **Production-Level Deployment** guide.
