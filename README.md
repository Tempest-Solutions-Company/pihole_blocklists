# Pi-hole Blocklists

Automatically generated blocklists for Pi-hole from multiple threat intelligence sources.

**Last Updated:** 2025-08-16 11:28:43 UTC

## Available Lists

| List | Description | Domains | Download |
|------|-------------|---------|----------|
| Phishing | Phishing domains and URLs | 456,821 | [Download](phishing.txt) |
| Malware | Malware hosting & distribution sites | 2,390 | [Download](malware.txt) |
| C2 Servers | Command & control servers | 13,334 | [Download](c2_servers.txt) |
| Banking Trojan | Banking trojan & financial malware | 7 | [Download](banking_trojan.txt) |
| All Malicious | All threats combined | 472,479 | [Download](all_malicious.txt) |
## False Positive Prevention

Multiple layers of false positive prevention:

- **Legitimate Domain Lists**: Tranco Top 1M + Cisco Umbrella Top 1M (~2M domains)
- **Manual Whitelist**: Critical infrastructure and services
- **Community Feedback**: Report false positives via GitHub Issues
- **Smart Filtering**: Intelligent handling of user-generated content platforms

## Usage

Add these URLs to your Pi-hole blocklists:

```
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/phishing.txt
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/malware.txt
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/c2_servers.txt
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/banking_trojan.txt
https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/all_malicious.txt
```

## Support

- **False Positives**: [Report here](https://github.com/Tempest-Solutions-Company/pihole_blocklists/issues)
- **Updates**: Lists are updated every 24 hours
