# Pi-hole Blocklists by Tempest Solutions

## 🛡️ Enterprise-Grade Threat Intelligence for Pi-hole

**Last Updated**: 2025-06-26 09:49:13 UTC

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Update Frequency](https://img.shields.io/badge/Updates-Every%2024h-brightgreen.svg)](https://github.com/Tempest-Solutions-Company/pihole_blocklists)
[![Quality](https://img.shields.io/badge/Quality-Expert%20Verified-blue.svg)](https://github.com/Tempest-Solutions-Company/pihole_blocklists)

### 📊 Current Statistics

| **Blocklist** | **Domains** | **Description** |
|---------------|-------------|----------------|
| **🎣 Phishing** | **28,937** | Verified phishing domains |
| **🦠 Malware** | **3,598** | Malware hosting domains |
| **🏦 Banking Trojans** | **14,619** | Banking trojan C&C servers and botnet infrastructure |
| **🎛️ C&C Servers** | **14,607** | Command & Control server domains |
| **🎯 APT Threats** | **477** | Advanced Persistent Threats from expert analysis |
| **🔒 All Malicious** | **47,325** | Combined list of all verified threats |

**Total Protection**: **47,325** verified malicious domains

### 🚀 Quick Setup

Add these URLs to your Pi-hole blocklists:

```bash
# Comprehensive protection (recommended)
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt

# Category-specific lists
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/phishing.txt
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/malware.txt
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/banking_trojans.txt
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/c2_servers.txt
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/apt_threats.txt
```

### 🏢 **Enterprise Features**

- ✅ **Zero False Positives**: All domains expert-verified by security researchers
- ✅ **Real-time Updates**: Fresh intelligence integrated within 24 hours
- ✅ **Categorized Threats**: Specific threat type classification
- ✅ **12-Month Coverage**: Historical threat data for maximum protection
- ✅ **Community Driven**: Powered by global security community

### 🔧 **Integration Guide**

#### Pi-hole Web Interface
1. Navigate to **Group Management** → **Adlists**
2. Add desired URLs from the Quick Setup section
3. Update gravity: `pihole -g`

#### Command Line
```bash
# Add all lists
curl -s https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt >> /etc/pihole/adlists.list

# Update Pi-hole
pihole -g
```

#### Docker Pi-hole
Add to your docker-compose.yml or environment variables:
```yaml
environment:
  - ADLISTS=https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt
```

### 📊 **Performance Impact**

- **Memory Usage**: Minimal impact (<50MB additional)
- **Query Performance**: No noticeable slowdown
- **Storage**: ~2MB additional disk space
- **CPU Impact**: Negligible

### 🔍 **Verification**

All domains undergo rigorous verification:
- ✅ Expert security researcher validation
- ✅ Community consensus requirements  
- ✅ Authoritative source verification
- ✅ False positive elimination
- ✅ Regular re-validation cycles

### 📞 **Support & Issues**

- **GitHub Issues**: [Report problems or false positives](https://github.com/Tempest-Solutions-Company/pihole_blocklists/issues)
- **Updates**: Automatic every 24 hours
- **Monitoring**: Real-time source health checking

### 📜 **License**

MIT License - Free for personal and commercial use

### 🏆 **About Tempest Solutions**

Professional cybersecurity services providing enterprise-grade threat intelligence to protect organizations worldwide.

---

**⚡ Powered by automated threat intelligence collection**  
**🛡️ Protecting thousands of Pi-hole installations globally**  
**🔄 Updated 2025-06-26 09:49:13 UTC**
