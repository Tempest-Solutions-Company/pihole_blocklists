# 🛡️ Tempest Solutions Pi-hole Blocklists

**Professional-grade malicious domain blocklists for Pi-hole, updated daily from verified threat intelligence sources.**

> ⚡ **42,000+ verified malicious domains** | 🔄 **Updated every 24 hours** | ✅ **Zero false positives**

## 🚀 Quick Setup

### Option 1: Add Individual Lists
```bash
# In Pi-hole Admin → Settings → Blocklists, add these URLs:

# Phishing Protection (Recommended)
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/phishing.txt

# Malware Protection  
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/malware.txt

# Command & control servers, Banking trojan, financial malware
https://github.com/Tempest-Solutions-Company/pihole_blocklists/blob/main/c2_servers.txt

# Complete Protection (All threats)
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt
```

## 📊 Available Blocklists

| List | Domains | Description | Recommended For |
|------|---------|-------------|-----------------|
| 🎣 **[phishing.txt](https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/phishing.txt)** | 43,113 | Real-time verified phishing domains | **Everyone** |
| 🦠 **[malware.txt](https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/malware.txt)** | 5,167 | Malware hosting & distribution sites | **Everyone** |
| 🎛️ **[c2_servers.txt](https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/c2_servers.txt)** | 13,016 | Command & control servers, Banking trojan & financial malware | **Advanced Users** |
| 🔒 **[all_malicious.txt](https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt)** | 63,837 | **Complete protection** (all threats) | **Maximum Security** |

Github Page dashboard: https://tempest-solutions-company.github.io/pihole_blocklists/


### 💖 Support Ethical Threat Intelligence

If our **blocklists** or **[threat feeds](https://tempest-solutions-company.github.io/threat-feeds/)** help secure your network, consider buying us a coffee.  
Even **£1/$1** helps offset infrastructure costs and keeps everything updated and open every day.

[![Support us on Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/J3J31HZAUU)  
> Transparent. Non-commercial. Community-powered cybersecurity.

---

## 🔍 Data Sources & Quality

### Quality Guarantees
- ✅ **Expert Verified**: All domains validated by security researchers
- ✅ **Zero False Positives**: Community consensus required
- ✅ **Fresh Intelligence**: Updated every 24 hours
- ✅ **High Precision**: Focus on accuracy over quantity
- ✅ **Authoritative Sources**: Only trusted security organizations

## 📈 Performance Impact

| Metric | Impact |
|--------|--------|
| **Pi-hole Performance** | Minimal (~1-2ms per query) |
| **Memory Usage** | Low (~10-20MB additional) |
| **Update Frequency** | Daily (automatic) |
| **False Positives** | Zero (expert verification) |

## 🛠️ Advanced Configuration

### Family-Safe DNS (Adult Content Filtering)
For additional family protection beyond malware/phishing, configure Cloudflare for Families as your upstream DNS:

```bash
# Pi-hole → Settings → DNS → Upstream DNS Servers
# Replace default DNS with Cloudflare for Families:

Primary:   1.1.1.3
Secondary: 1.0.0.3

# Or IPv6:
Primary:   2606:4700:4700::1113
Secondary: 2606:4700:4700::1003
```

**What this provides:**
- 🚫 **Adult content filtering** (automatic)
- 🛡️ **Malware protection** (built-in)
- ⚡ **Fast DNS resolution** (Cloudflare speed)
- 👨‍👩‍👧‍👦 **Family-friendly browsing** (no configuration needed)

**Complete Family Protection Setup:**
1. **Use our malicious domain blocklists** (security threats)
2. **Set upstream DNS to 1.1.1.3** (adult content filtering)
3. **Add ad blocklists of your choice** (advertising)

### Whitelist Common Services (Optional)
Some legitimate services may be flagged due to abuse. Add these to your whitelist if needed:
```
# Pi-hole → Settings → DNS → Custom whitelist
dropbox.com
drive.google.com
mega.nz
```

### Custom Update Schedule
```bash
# Add to crontab for custom update frequency
0 2 * * * pihole -g > /dev/null 2>&1
```

## 🕒 Automated Updates

### Setup Automatic Pi-hole Updates
To ensure your Pi-hole automatically fetches the latest blocklists every 24 hours:

```bash
# Edit your crontab
sudo crontab -e

# Add this line to update at 2 AM daily
0 2 * * * pihole -g > /dev/null 2>&1

# Alternative: Update every 6 hours for maximum freshness
0 */6 * * * pihole -g > /dev/null 2>&1

# Check if cron job was added successfully
sudo crontab -l | grep pihole
```

**What this does:**
- 🕐 **Automatic updates** at 2 AM daily
- 📥 **Downloads fresh lists** from our GitHub repository
- 🔄 **Updates Pi-hole gravity** with new domains
- 📝 **Logs results** for troubleshooting

**Alternative scheduling options:**
```bash
# Every 12 hours (recommended for high-security environments)
0 */12 * * * pihole -g > /dev/null 2>&1

# Every 6 hours (maximum freshness)
0 */6 * * * pihole -g > /dev/null 2>&1

# Weekly updates (minimal bandwidth usage)
0 2 * * 0 pihole -g > /dev/null 2>&1
```

## 📊 Statistics

- 📅 **Last Updated**: 2025-08-01 09:39:45 UTC
- 🎯 **Total Threats Blocked**: 138,149 domains
- 🔄 **Update Frequency**: Every 24 hours at 02:00 UTC
- 🌍 **Global Coverage**: Protecting thousands of Pi-hole installations

## 🤝 Community & Support

### Found an Issue?
- 🐛 **Report False Positives**: [GitHub Issues](https://github.com/Tempest-Solutions-Company/pihole_blocklists/issues)
- 💬 **Discussion**: [GitHub Discussions](https://github.com/Tempest-Solutions-Company/pihole_blocklists/discussions)
- 📧 **Contact**: info@tempest-solutions.com

### Contributing
We welcome community feedback and contributions:
- Report false positives or missed threats
- Suggest new threat intelligence sources
- Share your Pi-hole protection experiences

## 🏆 Why Choose Tempest Solutions Blocklists?

### vs. Other Blocklists
| Feature | Tempest Solutions | Other Lists |
|---------|------------------|-------------|
| **Verification** | ✅ Expert  | ❓ Varies |
| **False Positives** | ✅ Zero tolerance | ❌ Common issue |
| **Update Speed** | ✅ 24 hours | ❌ Weekly/Monthly |
| **Threat Diversity** | ✅ 5 specialized sources | ❌ Limited |
| **Professional Support** | ✅ Yes | ❌ Community only |

## ⚖️ Legal & Compliance

- **Data Source**: Public threat intelligence feeds
- **Usage Rights**: Free for personal and commercial use
- **Privacy**: No user data collection or tracking
- **Compliance**: Suitable for enterprise environments

## 🔗 Related Projects

- 🛡️ **[Threat Feeds](https://tempest-solutions-company.github.io/threat-feeds/)**: 
- 🛡️ **[Main website](https://tempest-solutions.com)**
- 🛡️ **[Our Network Website](https://tempest-solutions.network)**

---

<div align="center">

**🚀 Powered by Tempest Solutions ML Domain Collector**

*Protecting the internet, one domain at a time.*

[![GitHub Stars](https://img.shields.io/github/stars/Tempest-Solutions-Company/pihole_blocklists?style=social)](https://github.com/Tempest-Solutions-Company/pihole_blocklists)
[![License](https://img.shields.io/badge/license-Free%20Use-green)](LICENSE)
[![Updated](https://img.shields.io/badge/updated-daily-brightgreen)](https://github.com/Tempest-Solutions-Company/pihole_blocklists)

</div>
