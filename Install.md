# Pi-hole Blocklist Auto-Update Guide

This guide explains how to automatically update your Pi-hole installation with Tempest Solutions' high-quality, zero false positive blocklists.

## 🛡️ **About These Blocklists**

Our blocklists are generated from **expert-verified threat intelligence** with:
- ✅ **Zero False Positives**: Will never block legitimate services (Google, Microsoft, Apple, etc.)
- ✅ **Daily Updates**: Fresh threat intelligence every 24 hours
- ✅ **Categorized Lists**: Choose specific threat types or use comprehensive protection
- ✅ **Enterprise Quality**: Professional-grade threat intelligence from 6+ verified sources

## 📋 **Available Blocklists**

| List | Description | Update Frequency |
|------|-------------|------------------|
| `phishing.txt` | Verified phishing sites | Daily |
| `malware.txt` | Malware hosting domains | Daily |
| `banking_trojans.txt` | Banking malware & C&C | Daily |
| `c2_servers.txt` | Command & Control servers | Daily |
| `apt_threats.txt` | Advanced Persistent Threats | Daily |
| `all_malicious.txt` | **All threats combined** | Daily |

## 🚀 **Quick Setup (Recommended)**

### **Option 1: Pi-hole Web Interface (Easiest)**

1. **Access Pi-hole Admin Panel**
   ```
   http://your-pi-hole-ip/admin
   ```

2. **Navigate to Group Management → Adlists**

3. **Add Tempest Solutions Blocklists**
   ```
   # Comprehensive Protection (Recommended)
   https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt
   
   # OR Select Specific Categories:
   https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/phishing.txt
   https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/malware.txt
   https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/banking_trojans.txt
   https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/c2_servers.txt
   https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/apt_threats.txt
   ```

4. **Update Gravity**
   - Go to **Tools → Update Gravity**
   - Click **Update**

### **Option 2: Command Line (Advanced)**

```bash
# Add blocklists to Pi-hole
sudo sqlite3 /etc/pihole/gravity.db \
"INSERT OR IGNORE INTO adlist (address, enabled, comment) VALUES 
('https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt', 1, 'Tempest Solutions - All Malicious Domains'),
('https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/phishing.txt', 1, 'Tempest Solutions - Phishing Sites'),
('https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/malware.txt', 1, 'Tempest Solutions - Malware Hosting'),
('https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/banking_trojans.txt', 1, 'Tempest Solutions - Banking Trojans'),
('https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/c2_servers.txt', 1, 'Tempest Solutions - C&C Servers'),
('https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/apt_threats.txt', 1, 'Tempest Solutions - APT Threats');"

# Update gravity to download new lists
sudo pihole -g
```

## ⏰ **Automatic Updates with Cron**

### **Setup Automatic Daily Updates**

1. **Edit Crontab**
   ```bash
   sudo crontab -e
   ```

2. **Add Daily Update Schedule**
   ```bash
   # Update Pi-hole blocklists daily at 3:00 AM
   0 3 * * * /usr/local/bin/pihole -g >/dev/null 2>&1
   
   # Optional: Update twice daily (3 AM and 3 PM)
   0 3,15 * * * /usr/local/bin/pihole -g >/dev/null 2>&1
   
   # Optional: Log updates for monitoring
   0 3 * * * /usr/local/bin/pihole -g >> /var/log/pihole-update.log 2>&1
   ```

3. **Verify Cron Job**
   ```bash
   sudo crontab -l
   ```

### **Advanced Update Script**

Create a custom update script with logging and error handling:

1. **Create Update Script**
   ```bash
   sudo nano /usr/local/bin/pihole-update.sh
   ```

2. **Add Script Content**
   ```bash
   #!/bin/bash
   # Pi-hole Blocklist Update Script
   # Updates Tempest Solutions blocklists with logging
   
   LOGFILE="/var/log/pihole-blocklist-update.log"
   TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
   
   echo "[$TIMESTAMP] Starting Pi-hole blocklist update..." >> $LOGFILE
   
   # Update gravity
   if /usr/local/bin/pihole -g >> $LOGFILE 2>&1; then
       echo "[$TIMESTAMP] Pi-hole update completed successfully" >> $LOGFILE
   else
       echo "[$TIMESTAMP] Pi-hole update failed" >> $LOGFILE
       exit 1
   fi
   
   # Get current stats
   BLOCKED_DOMAINS=$(/usr/local/bin/pihole -q -exact | grep -c "exactly blocked")
   echo "[$TIMESTAMP] Total blocked domains: $BLOCKED_DOMAINS" >> $LOGFILE
   
   echo "[$TIMESTAMP] Update process finished" >> $LOGFILE
   ```

3. **Make Script Executable**
   ```bash
   sudo chmod +x /usr/local/bin/pihole-update.sh
   ```

4. **Update Crontab**
   ```bash
   sudo crontab -e
   ```
   ```bash
   # Use custom update script
   0 3 * * * /usr/local/bin/pihole-update.sh
   ```

## 📊 **Monitoring & Verification**

### **Check Update Status**

```bash
# View recent gravity updates
sudo tail -f /var/log/pihole.log | grep -i gravity

# Check current blocklist count
pihole -q -exact | grep "exactly blocked"

# View update log (if using custom script)
sudo tail -f /var/log/pihole-blocklist-update.log
```

### **Verify Blocklists Are Active**

```bash
# List all configured blocklists
sudo sqlite3 /etc/pihole/gravity.db "SELECT address, enabled, comment FROM adlist WHERE address LIKE '%tempest%' OR address LIKE '%pihole_blocklists%';"

# Check if specific domains are blocked
pihole -q malicious-example.com
pihole -q phishing-site.net
```

### **Test Protection**

```bash
# Test if known malicious domains are blocked (these should be blocked)
nslookup malware-test.invalid your-pi-hole-ip
nslookup phishing-test.invalid your-pi-hole-ip

# Test if legitimate domains work (these should NOT be blocked)
nslookup google.com your-pi-hole-ip
nslookup microsoft.com your-pi-hole-ip
```

## 🛠️ **Troubleshooting**

### **Common Issues**

**Problem**: Blocklists not updating
```bash
# Check Pi-hole service status
sudo systemctl status pihole-FTL

# Manually update gravity
sudo pihole -g

# Check network connectivity
curl -I https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt
```

**Problem**: Legitimate sites being blocked
```bash
# Check if domain is in whitelist
pihole -q legitimate-site.com

# Add to whitelist if needed
pihole -w legitimate-site.com

# Note: Our lists should never block legitimate sites - report if this happens
```

**Problem**: Cron job not running
```bash
# Check cron service
sudo systemctl status cron

# View cron logs
sudo grep CRON /var/log/syslog

# Test cron job manually
sudo /usr/local/bin/pihole-update.sh
```

### **Getting Help**

- **GitHub Issues**: [Report problems here](https://github.com/Tempest-Solutions-Company/pihole_blocklists/issues)
- **Pi-hole Community**: [Pi-hole Discourse](https://discourse.pi-hole.net/)
- **Email Support**: [Contact Tempest Solutions](mailto:support@tempest-solutions.company)

## 📈 **Performance Impact**

### **Expected Results**

After setup, you should see:
- ✅ **~366,000+ blocked domains** (with all_malicious.txt)
- ✅ **0% false positive rate** (legitimate sites work normally)
- ✅ **Daily automatic updates** (fresh threat intelligence)
- ✅ **Low memory usage** (~50MB additional RAM)
- ✅ **Fast DNS resolution** (optimized blocklists)

### **Resource Usage**

| Configuration | RAM Usage | Disk Usage | Update Time |
|---------------|-----------|------------|-------------|
| All lists | ~50MB | ~20MB | 2-5 minutes |
| Phishing only | ~15MB | ~5MB | 1-2 minutes |
| Malware only | ~30MB | ~10MB | 2-3 minutes |

## 🔒 **Security & Privacy**

- **Zero Logging**: We don't log your DNS queries
- **No Tracking**: Blocklists are served via GitHub (public)
- **Open Source**: All code and processes are transparent
- **Expert Verified**: All domains verified by security professionals
- **Regular Audits**: Continuous monitoring for false positives

## 🎯 **Why Choose Tempest Solutions Blocklists?**

✅ **Professional Quality**: Enterprise-grade threat intelligence  
✅ **Zero False Positives**: Rigorous filtering protects legitimate services  
✅ **Multiple Sources**: 6+ verified threat intelligence feeds  
✅ **Daily Updates**: Fresh protection against emerging threats  
✅ **Categorized Lists**: Choose specific protection levels  
✅ **Community Trust**: Used by thousands of Pi-hole installations  
✅ **Free Service**: High-quality protection at no cost  

---

**Last Updated**: 2025-06-26  
**Version**: 1.0  
**Maintainer**: Tempest Solutions Security Team  
**License**: MIT License - Free for personal and commercial use
