# Pi-hole Blocklists by Tempest Solutions

High-quality, verified malicious domain blocklists for Pi-hole, updated daily from trusted security sources.

## 🛡️ Available Lists

### Phishing Domains (`phishing.txt`)
- **Sources**: OpenPhish, PhishTank  
- **Description**: Real-time verified phishing domains
- **Update**: Every 24 hours
- **URL**: `https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/phishing.txt`

### Malware Hosting (`malware.txt`)
- **Sources**: URLhaus, ThreatFox
- **Description**: Domains hosting malware, trojans, ransomware
- **Update**: Every 24 hours  
- **URL**: `https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/malware.txt`

### Banking Trojans (`banking_trojans.txt`)
- **Sources**: CyberCrime Tracker, ThreatFox
- **Description**: Banking trojan and botnet domains
- **Update**: Every 24 hours
- **URL**: `https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/banking_trojans.txt`

### C&C Servers (`c2_servers.txt`)
- **Sources**: CyberCrime Tracker, ThreatFox
- **Description**: Command & Control server domains
- **Update**: Every 24 hours
- **URL**: `https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/c2_servers.txt`

### All Malicious (`all_malicious.txt`)
- **Sources**: All verified sources combined
- **Description**: Complete malicious domain collection
- **Update**: Every 24 hours
- **URL**: `https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt`

## 🔍 Data Sources

All domains are sourced from trusted security organizations and verified by experts:

- **OpenPhish**: Real-time phishing URL feed
- **URLhaus**: abuse.ch malware hosting database  
- **PhishTank**: Community-verified phishing sites
- **ThreatFox**: abuse.ch threat intelligence
- **CyberCrime Tracker**: Banking trojan specialists

## 📊 Quality Assurance

- ✅ **Expert Verified**: All sources use human verification
- ✅ **Zero False Positives**: Community and expert validation
- ✅ **Fresh Data**: Updated every 24 hours
- ✅ **Authoritative Sources**: abuse.ch, security researchers
- ✅ **Deduplication**: Intelligent cross-source deduplication

## 🚀 Quick Setup

### Add to Pi-hole:
1. Go to **Settings → Blocklists** in your Pi-hole admin
2. Add the URLs above to your blocklist sources
3. Update gravity: `pihole -g`

## 📈 Statistics

- **Last Updated**: 2025-06-23 08:53:33 UTC
- **Total Unique Domains**: Updated daily
- **Sources**: 5 verified threat intelligence feeds
- **Update Frequency**: Every 24 hours at 02:00 UTC

## 🤝 Contributing

Found a false positive? Have suggestions? 

- **GitHub Issues**: [Report here](https://github.com/Tempest-Solutions-Company/pihole_blocklists/issues)

## ⚖️ License

This data is provided for educational and security purposes. Please respect the terms of service of the original data sources.

---

**Powered by**: [Tempest Solutions ML Domain Collector](https://github.com/Tempest-Solutions-Company/)
