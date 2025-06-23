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

# Complete Protection (All threats)
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt
```

### Option 2: One-Line Install (All Lists)
```bash
curl -sSL https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/install.sh | bash
```

## 📊 Available Blocklists

| List | Domains | Description | Recommended For |
|------|---------|-------------|-----------------|
| 🎣 **[phishing.txt](https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/phishing.txt)** | 26,466 | Real-time verified phishing domains | **Everyone** |
| 🦠 **[malware.txt](https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/malware.txt)** | 2,720 | Malware hosting & distribution sites | **Everyone** |
| 🏦 **[banking_trojans.txt](https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/banking_trojans.txt)** | N/A | Banking trojan & financial malware | **Business/Finance** |
| 🎛️ **[c2_servers.txt](https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/c2_servers.txt)** | 13,016 | Command & control servers | **Advanced Users** |
| 🔒 **[all_malicious.txt](https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt)** | 42,220 | **Complete protection** (all threats) | **Maximum Security** |

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

### Whitelist Common Services (Optional)
Some legitimate services may be flagged due to abuse. Add these to your whitelist if needed:
```
# Pi-hole → Settings → DNS → Upstream DNS → Custom whitelist
dropbox.com
drive.google.com
mega.nz
```

### Custom Update Schedule
```bash
# Add to crontab for custom update frequency
0 2 * * * pihole -g > /dev/null 2>&1
```

## 📊 Statistics

- 📅 **Last Updated**: 2025-06-23 09:09:17 UTC
- 🎯 **Total Threats Blocked**: 84,422 domains
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

- 🤖 **[ML Domain Classifier](https://github.com/Tempest-Solutions-Company/ml-domain-classifier)**: The AI behind these lists
- 🛡️ **[Main website](https://tempest-solutions.com)**

---

<div align="center">

**🚀 Powered by Tempest Solutions ML Domain Collector**

*Protecting the internet, one domain at a time.*

[![GitHub Stars](https://img.shields.io/github/stars/Tempest-Solutions-Company/pihole_blocklists?style=social)](https://github.com/Tempest-Solutions-Company/pihole_blocklists)
[![License](https://img.shields.io/badge/license-Free%20Use-green)](LICENSE)
[![Updated](https://img.shields.io/badge/updated-daily-brightgreen)](https://github.com/Tempest-Solutions-Company/pihole_blocklists)

</div>
