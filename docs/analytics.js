class ThreatAnalytics {
    constructor() {
        this.blocklistData = {};
        this.metadata = {};
        this.lastUpdate = null;
        
        // GitHub repository base URL
        this.githubBaseUrl = 'https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/';
        // Alternative CORS proxy
        this.corsProxy = 'https://corsproxy.io/?';
        
        this.blocklistCategories = {
            'phishing': {
                name: 'Phishing Domains',
                icon: 'fas fa-fishing-rod',
                description: 'Fraudulent domains designed to steal credentials and personal information',
                color: '#ff6b35'
            },
            'malware': {
                name: 'Malware Hosting',
                icon: 'fas fa-virus',
                description: 'Domains hosting malicious software and exploit kits',
                color: '#ff0000'
            },
            'banking_trojans': {
                name: 'Banking Trojans',
                icon: 'fas fa-university',
                description: 'Financial malware and banking trojan C&C servers',
                color: '#dc3545'
            },
            'c2_servers': {
                name: 'C2 Servers',
                icon: 'fas fa-server',
                description: 'Command & Control infrastructure for malware operations',
                color: '#6610f2'
            },
            'apt_threats': {
                name: 'APT Threats',
                icon: 'fas fa-user-secret',
                description: 'Advanced Persistent Threat domains from nation-state actors',
                color: '#fd7e14'
            },
            'all_malicious': {
                name: 'All Malicious',
                icon: 'fas fa-ban',
                description: 'Comprehensive combined list of all threat categories',
                color: '#198754'
            }
        };
        
        this.init();
    }

    async init() {
        await this.loadBlocklistData();
        this.updateStats();
        this.renderBlocklistGrid();
        this.updateAnalysis();
        this.updateAdvancedAnalytics();
        this.updateThreatIntelligence();
        this.startAutoUpdate();
    }

    async loadBlocklistData() {
        try {
            console.log('Loading blocklist metadata from GitHub...');
            
            const metadata = await this.fetchMetadata();
            this.metadata = metadata;
            this.lastUpdate = new Date(metadata.generated_at);
            
            // Update last update time
            document.getElementById('last-update-time').textContent = 
                this.lastUpdate.toLocaleString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
            console.log('Successfully loaded blocklist metadata');
            
        } catch (error) {
            console.error('Error loading blocklist data:', error);
            document.getElementById('last-update-time').textContent = 'Error loading data from GitHub';
        }
    }

    async fetchMetadata() {
        const url = this.githubBaseUrl + 'metadata.json';
        
        try {
            // First attempt: Direct fetch
            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
            
        } catch (corsError) {
            console.warn('Direct fetch failed, using proxy...');
            
            // Second attempt: Use CORS proxy
            const proxyUrl = this.corsProxy + encodeURIComponent(url);
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        }
    }

    updateStats() {
        if (!this.metadata.lists) return;
        
        // Use the "all_malicious" count as the actual unique total, not total_unique_domains
        const actualTotal = this.metadata.lists.all_malicious ? 
            this.metadata.lists.all_malicious.domain_count : 
            this.metadata.total_unique_domains || 0;
            
        document.getElementById('total-domains').textContent = actualTotal.toLocaleString();
        
        // Find largest category (excluding all_malicious since it's the combined list)
        let largestCategory = '';
        let largestCount = 0;
        
        Object.entries(this.metadata.lists).forEach(([category, data]) => {
            if (data.domain_count > largestCount && category !== 'all_malicious') {
                largestCount = data.domain_count;
                largestCategory = this.blocklistCategories[category]?.name || category;
            }
        });
        
        document.getElementById('top-threat-category').textContent = largestCategory;
        
        console.log(`Stats updated: ${actualTotal} total unique domains, largest category: ${largestCategory}`);
    }

    renderBlocklistGrid() {
        const gridContainer = document.getElementById('blocklist-grid');
        
        if (!this.metadata.lists) {
            gridContainer.innerHTML = '<div class="content-card"><p>No blocklist data available</p></div>';
            return;
        }
        
        let content = '<div class="blocklist-cards-container">';
        
        Object.entries(this.metadata.lists).forEach(([category, data]) => {
            const categoryInfo = this.blocklistCategories[category];
            if (!categoryInfo) return;
            
            const githubUrl = `https://raw.githubusercontent.com/Tempest-Solutions-Company/pihole_blocklists/main/${data.filename}`;
            
            content += `
                <div class="content-card blocklist-card">
                    <div class="card-header">
                        <div class="card-icon" style="color: ${categoryInfo.color}">
                            <i class="${categoryInfo.icon}"></i>
                        </div>
                        <div class="card-title">
                            <h3>${categoryInfo.name}</h3>
                            <span class="card-badge" style="background-color: ${categoryInfo.color}">Active</span>
                        </div>
                    </div>
                    <div class="card-content">
                        <p class="card-description">${categoryInfo.description}</p>
                        <div class="card-stats">
                            <div class="stat-item">
                                <span class="stat-value">${data.domain_count.toLocaleString()}</span>
                                <span class="stat-label">Domains</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${data.file_size_kb.toFixed(1)}</span>
                                <span class="stat-label">KB</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-actions">
                        <a href="${githubUrl}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-download"></i>
                            Raw File
                        </a>
                        <button class="btn btn-secondary copy-url-btn" data-url="${githubUrl}">
                            <i class="fas fa-copy"></i>
                            Copy URL
                        </button>
                    </div>
                </div>
            `;
        });
        
        content += '</div>';
        gridContainer.innerHTML = content;
        
        // Add copy URL functionality
        document.querySelectorAll('.copy-url-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.target.closest('.copy-url-btn').dataset.url;
                navigator.clipboard.writeText(url).then(() => {
                    const originalText = e.target.closest('.copy-url-btn').innerHTML;
                    e.target.closest('.copy-url-btn').innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        e.target.closest('.copy-url-btn').innerHTML = originalText;
                    }, 2000);
                });
            });
        });
    }

    updateAnalysis() {
        this.updateThreatDistribution();
        this.updateGrowthTrends();
    }

    updateThreatDistribution() {
        const distributionContainer = document.getElementById('threat-distribution');
        
        if (!this.metadata.lists) {
            distributionContainer.innerHTML = '<p>No distribution data available</p>';
            return;
        }
        
        const categories = Object.entries(this.metadata.lists)
            .filter(([category]) => category !== 'all_malicious')
            .sort(([,a], [,b]) => b.domain_count - a.domain_count);
        
        // Use all_malicious count for percentage calculations (actual unique total)
        const actualTotal = this.metadata.lists.all_malicious ? 
            this.metadata.lists.all_malicious.domain_count : 
            this.metadata.total_unique_domains;
        
        let content = `<div class="distribution-content">`;
        
        categories.forEach(([category, data], index) => {
            const categoryInfo = this.blocklistCategories[category];
            if (!categoryInfo) return;
            
            // Note: Percentages may add up to more than 100% due to domain overlap between categories
            const percentage = ((data.domain_count / actualTotal) * 100).toFixed(1);
            
            content += `
                <div class="distribution-item">
                    <div class="distribution-rank">${index + 1}</div>
                    <div class="distribution-details">
                        <div class="distribution-name" style="color: ${categoryInfo.color}">
                            <i class="${categoryInfo.icon}"></i>
                            ${categoryInfo.name}
                        </div>
                        <div class="distribution-stats">
                            <span class="distribution-count">${data.domain_count.toLocaleString()}</span>
                            <span class="distribution-percentage">(${percentage}%)</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        content += `</div>`;
        content += `<p class="distribution-note"><em>Note: Percentages may exceed 100% due to domain overlap between categories. Total unique domains: ${actualTotal.toLocaleString()}</em></p>`;
        
        distributionContainer.innerHTML = content;
    }

    updateGrowthTrends() {
        const trendsContainer = document.getElementById('growth-trends');
        
        let content = `
            <div class="trends-content">
                <div class="trends-summary">
                    <p>Our threat intelligence grows continuously with ${this.metadata.update_frequency ? this.metadata.update_frequency.toLowerCase() : 'regular'} updates from trusted sources.</p>
                </div>
                <div class="trends-metrics">
                    <div class="trend-metric">
                        <h4>Quality Assurance</h4>
                        <p>${this.metadata.quality || 'Expert verified, zero false positives'}</p>
                    </div>
                    <div class="trend-metric">
                        <h4>Update Frequency</h4>
                        <p>${this.metadata.update_frequency || 'Every 24 hours'}</p>
                    </div>
                    <div class="trend-metric">
                        <h4>Coverage Period</h4>
                        <p>12 months historical data</p>
                    </div>
                </div>
                <div class="trends-note">
                    <p><strong>Data Sources:</strong> OpenPhish, PhishTank, URLhaus, ThreatFox, OTX, and our ML Domain Collector</p>
                </div>
            </div>
        `;
        
        trendsContainer.innerHTML = content;
    }

    updateAdvancedAnalytics() {
        this.updateThreatVelocity();
        this.updateCoverageAnalysis();
        this.updateRiskAssessment();
        this.updateHistoricalTrends();
    }

    updateThreatVelocity() {
        const velocityContainer = document.getElementById('threat-velocity');
        
        if (!this.metadata.lists) {
            velocityContainer.innerHTML = '<div class="content-card"><p>No velocity data available</p></div>';
            return;
        }

        const categories = Object.entries(this.metadata.lists)
            .filter(([category]) => category !== 'all_malicious')
            .map(([category, data]) => ({
                name: this.blocklistCategories[category]?.name || category,
                domainsPerKB: (data.domain_count / data.file_size_kb).toFixed(0),
                category,
                color: this.blocklistCategories[category]?.color || '#666',
                icon: this.blocklistCategories[category]?.icon || 'fas fa-shield-alt'
            }))
            .sort((a, b) => b.domainsPerKB - a.domainsPerKB);

        let content = `
            <div class="content-card">
                <div class="card-header-simple">
                    <p><i class="fas fa-info-circle"></i> Detection efficiency measured by domains per KB of data storage</p>
                </div>
                <div class="velocity-list">
        `;

        categories.forEach((cat, index) => {
            const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32', '#666', '#666'];
            const rankColor = rankColors[index] || '#666';
            
            content += `
                <div class="velocity-item">
                    <div class="velocity-rank" style="background-color: ${rankColor}">
                        <i class="fas fa-trophy"></i>
                        <span>${index + 1}</span>
                    </div>
                    <div class="velocity-details">
                        <div class="velocity-category">
                            <i class="${cat.icon}" style="color: ${cat.color}"></i>
                            <span class="category-name">${cat.name}</span>
                        </div>
                        <div class="velocity-metric">
                            <strong>${cat.domainsPerKB}</strong>
                            <small>domains/KB</small>
                        </div>
                    </div>
                    <div class="velocity-bar">
                        <div class="velocity-fill" style="width: ${(cat.domainsPerKB / categories[0].domainsPerKB) * 100}%; background-color: ${cat.color}"></div>
                    </div>
                </div>
            `;
        });

        content += `
                </div>
                <div class="card-footer">
                    <i class="fas fa-lightbulb"></i>
                    <span>Higher values indicate more compact, efficient threat detection and storage optimization.</span>
                </div>
            </div>
        `;

        velocityContainer.innerHTML = content;
    }

    updateCoverageAnalysis() {
        const coverageContainer = document.getElementById('coverage-analysis');
        
        if (!this.metadata.lists) {
            coverageContainer.innerHTML = '<div class="content-card"><p>No coverage data available</p></div>';
            return;
        }

        const totalUnique = this.metadata.lists.all_malicious ? 
            this.metadata.lists.all_malicious.domain_count : 0;
        const totalIndividual = Object.entries(this.metadata.lists)
            .filter(([category]) => category !== 'all_malicious')
            .reduce((sum, [, data]) => sum + data.domain_count, 0);

        const overlapPercentage = totalIndividual > 0 ? 
            (((totalIndividual - totalUnique) / totalIndividual) * 100).toFixed(1) : 0;
        const categoryCount = Object.keys(this.metadata.lists).length - 1;

        let content = `
            <div class="content-card">
                <div class="metrics-grid">
                    <div class="metric-card primary">
                        <div class="metric-icon">
                            <i class="fas fa-layer-group"></i>
                        </div>
                        <div class="metric-content">
                            <span class="metric-value">${overlapPercentage}%</span>
                            <span class="metric-label">Domain Overlap</span>
                            <small class="metric-note">Deduplication efficiency</small>
                        </div>
                    </div>
                    
                    <div class="metric-card secondary">
                        <div class="metric-icon">
                            <i class="fas fa-list-alt"></i>
                        </div>
                        <div class="metric-content">
                            <span class="metric-value">${categoryCount}</span>
                            <span class="metric-label">Categories</span>
                            <small class="metric-note">Threat types covered</small>
                        </div>
                    </div>
                    
                    <div class="metric-card tertiary">
                        <div class="metric-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <div class="metric-content">
                            <span class="metric-value">12</span>
                            <span class="metric-label">Months</span>
                            <small class="metric-note">Historical coverage</small>
                        </div>
                    </div>
                </div>
                
                <div class="card-summary">
                    <i class="fas fa-check-circle"></i>
                    <p>Comprehensive protection with <strong>${overlapPercentage}% overlap</strong> between categories, ensuring efficient storage while maintaining broad threat coverage across all attack vectors.</p>
                </div>
            </div>
        `;

        coverageContainer.innerHTML = content;
    }

    updateRiskAssessment() {
        const riskContainer = document.getElementById('risk-assessment');
        
        if (!this.metadata.lists) {
            riskContainer.innerHTML = '<div class="content-card"><p>No risk data available</p></div>';
            return;
        }

        const categories = Object.entries(this.metadata.lists)
            .filter(([category]) => category !== 'all_malicious')
            .map(([category, data]) => {
                let riskLevel = 'Low';
                let riskColor = '#28a745';
                let riskIcon = 'fas fa-shield-alt';
                
                if (data.domain_count > 30000) {
                    riskLevel = 'Critical';
                    riskColor = '#dc3545';
                    riskIcon = 'fas fa-exclamation-triangle';
                } else if (data.domain_count > 10000) {
                    riskLevel = 'High';
                    riskColor = '#fd7e14';
                    riskIcon = 'fas fa-exclamation-circle';
                } else if (data.domain_count > 1000) {
                    riskLevel = 'Medium';
                    riskColor = '#ffc107';
                    riskIcon = 'fas fa-exclamation';
                }

                return {
                    name: this.blocklistCategories[category]?.name || category,
                    count: data.domain_count,
                    riskLevel,
                    riskColor,
                    riskIcon,
                    category,
                    categoryIcon: this.blocklistCategories[category]?.icon || 'fas fa-shield-alt',
                    categoryColor: this.blocklistCategories[category]?.color || '#666'
                };
            })
            .sort((a, b) => b.count - a.count);

        let content = `
            <div class="content-card">
                <div class="risk-list">
        `;

        categories.forEach(cat => {
            content += `
                <div class="risk-item">
                    <div class="risk-category">
                        <i class="${cat.categoryIcon}" style="color: ${cat.categoryColor}"></i>
                        <span class="category-name">${cat.name}</span>
                    </div>
                    <div class="risk-level">
                        <span class="risk-badge" style="background-color: ${cat.riskColor}">
                            <i class="${cat.riskIcon}"></i>
                            ${cat.riskLevel}
                        </span>
                    </div>
                    <div class="risk-count">
                        <strong>${cat.count.toLocaleString()}</strong>
                        <small>domains</small>
                    </div>
                    <div class="risk-bar">
                        <div class="risk-fill" style="width: ${(cat.count / categories[0].count) * 100}%; background-color: ${cat.riskColor}"></div>
                    </div>
                </div>
            `;
        });

        content += `
                </div>
                <div class="risk-legend">
                    <h4><i class="fas fa-info-circle"></i> Risk Classification</h4>
                    <div class="legend-items">
                        <div class="legend-item">
                            <div class="legend-dot" style="background-color: #28a745"></div>
                            <span><strong>Low:</strong> &lt;1K domains</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot" style="background-color: #ffc107"></div>
                            <span><strong>Medium:</strong> 1K-10K domains</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot" style="background-color: #fd7e14"></div>
                            <span><strong>High:</strong> 10K-30K domains</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot" style="background-color: #dc3545"></div>
                            <span><strong>Critical:</strong> &gt;30K domains</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        riskContainer.innerHTML = content;
    }

    updateHistoricalTrends() {
        const trendsContainer = document.getElementById('historical-trends');
        
        const updateTime = new Date(this.metadata.generated_at);
        const daysSinceUpdate = Math.floor((new Date() - updateTime) / (1000 * 60 * 60 * 24));
        const hoursUntilNext = 24 - new Date().getHours();
        
        let content = `
            <div class="historical-content">
                <div class="trends-timeline">
                    <div class="timeline-item active">
                        <div class="timeline-marker">
                            <i class="fas fa-database"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>Current Dataset</h4>
                            <p class="timeline-stat">${this.metadata.total_unique_domains.toLocaleString()}</p>
                            <span class="timeline-label">unique domains</span>
                            <small class="timeline-time">${daysSinceUpdate === 0 ? 'Updated today' : `${daysSinceUpdate} days old`}</small>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <div class="timeline-marker">
                            <i class="fas fa-history"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>Coverage Period</h4>
                            <p class="timeline-stat">12</p>
                            <span class="timeline-label">months protection</span>
                            <small class="timeline-time">Maximum historical coverage</small>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <div class="timeline-marker">
                            <i class="fas fa-sync-alt"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>Next Update</h4>
                            <p class="timeline-stat">${hoursUntilNext}</p>
                            <span class="timeline-label">hours remaining</span>
                            <small class="timeline-time">24-hour refresh cycle</small>
                        </div>
                    </div>
                </div>
                
                <div class="trends-insight">
                    <div class="insight-card">
                        <i class="fas fa-chart-line"></i>
                        <div>
                            <h4>Data Freshness Strategy</h4>
                            <p>Our threat intelligence maintains 12 months of historical coverage while updating every 24 hours, ensuring both comprehensive protection and current threat awareness for maximum security effectiveness.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        trendsContainer.innerHTML = content;
    }

    updateThreatIntelligence() {
        this.updatePriorityThreats();
        this.updateThreatEvolution();
        this.updateDetectionEffectiveness();
    }

    updatePriorityThreats() {
        const priorityContainer = document.getElementById('priority-threats');
        
        if (!this.metadata.lists) {
            priorityContainer.innerHTML = '<p>No priority threat data available</p>';
            return;
        }

        // Identify high-priority threats based on various factors
        const priorities = [
            {
                category: 'phishing',
                priority: 'Critical',
                reason: 'Largest category with immediate user impact',
                recommendation: 'Deploy immediately for credential protection'
            },
            {
                category: 'banking_trojans',
                priority: 'High',
                reason: 'Financial targeting with severe consequences',
                recommendation: 'Essential for banking and financial services'
            },
            {
                category: 'c2_servers',
                priority: 'High',
                reason: 'Command infrastructure enables other attacks',
                recommendation: 'Critical for preventing botnet communication'
            },
            {
                category: 'apt_threats',
                priority: 'Medium',
                reason: 'Targeted attacks with sophisticated techniques',
                recommendation: 'Important for high-value targets'
            }
        ];

        let content = `
            <div class="priority-content">
        `;

        priorities.forEach(item => {
            const categoryData = this.metadata.lists[item.category];
            if (!categoryData) return;

            const categoryInfo = this.blocklistCategories[item.category];
            const priorityColor = item.priority === 'Critical' ? '#dc3545' : 
                                 item.priority === 'High' ? '#fd7e14' : '#ffc107';

            content += `
                <div class="priority-item">
                    <div class="priority-header">
                        <div class="priority-name" style="color: ${categoryInfo.color}">
                            <i class="${categoryInfo.icon}"></i>
                            ${categoryInfo.name}
                        </div>
                        <div class="priority-level" style="background-color: ${priorityColor}">
                            ${item.priority}
                        </div>
                    </div>
                    <div class="priority-details">
                        <p class="priority-reason"><strong>Why:</strong> ${item.reason}</p>
                        <p class="priority-recommendation"><strong>Action:</strong> ${item.recommendation}</p>
                        <div class="priority-stats">
                            <span>${categoryData.domain_count.toLocaleString()} domains</span>
                            <span>${categoryData.file_size_kb.toFixed(1)} KB</span>
                        </div>
                    </div>
                </div>
            `;
        });

        content += `</div>`;
        priorityContainer.innerHTML = content;
    }

    updateThreatEvolution() {
        const evolutionContainer = document.getElementById('threat-evolution');
        
        let content = `
            <div class="evolution-content">
                <div class="evolution-insights">
                    <div class="insight-item">
                        <i class="fas fa-trending-up" style="color: #dc3545;"></i>
                        <div>
                            <h4>Phishing Evolution</h4>
                            <p>Increasing sophistication in credential harvesting with AI-generated content and deepfake techniques.</p>
                        </div>
                    </div>
                    <div class="insight-item">
                        <i class="fas fa-user-secret" style="color: #6f42c1;"></i>
                        <div>
                            <h4>APT Campaigns</h4>
                            <p>State-sponsored actors increasingly using cloud infrastructure and legitimate services for attacks.</p>
                        </div>
                    </div>
                    <div class="insight-item">
                        <i class="fas fa-robot" style="color: #fd7e14;"></i>
                        <div>
                            <h4>Automation Trends</h4>
                            <p>Malware operators leveraging automation and AI for large-scale campaign deployment.</p>
                        </div>
                    </div>
                    <div class="insight-item">
                        <i class="fas fa-mobile-alt" style="color: #20c997;"></i>
                        <div>
                            <h4>Mobile Targeting</h4>
                            <p>Increased focus on mobile platforms with SMS phishing and malicious app distribution.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        evolutionContainer.innerHTML = content;
    }

    updateDetectionEffectiveness() {
        const effectivenessContainer = document.getElementById('detection-effectiveness');
        
        if (!this.metadata.lists) {
            effectivenessContainer.innerHTML = '<p>No effectiveness data available</p>';
            return;
        }

        const totalDomains = this.metadata.lists.all_malicious ? 
            this.metadata.lists.all_malicious.domain_count : 0;

        let content = `
            <div class="effectiveness-content">
                <div class="effectiveness-metrics">
                    <div class="metric-card">
                        <h4>Detection Rate</h4>
                        <div class="metric-value">99.8%</div>
                        <p>Expert verification ensures high accuracy</p>
                    </div>
                    <div class="metric-card">
                        <h4>False Positives</h4>
                        <div class="metric-value">0%</div>
                        <p>Zero false positive policy maintained</p>
                    </div>
                    <div class="metric-card">
                        <h4>Coverage Scope</h4>
                        <div class="metric-value">${totalDomains.toLocaleString()}</div>
                        <p>Unique malicious domains blocked</p>
                    </div>
                </div>
                <div class="effectiveness-quality">
                    <h4>Quality Assurance Process</h4>
                    <div class="quality-steps">
                        <div class="step">
                            <i class="fas fa-search"></i>
                            <span>Automated Discovery</span>
                        </div>
                        <div class="step">
                            <i class="fas fa-users"></i>
                            <span>Expert Review</span>
                        </div>
                        <div class="step">
                            <i class="fas fa-check-circle"></i>
                            <span>Community Consensus</span>
                        </div>
                        <div class="step">
                            <i class="fas fa-shield-alt"></i>
                            <span>Deployment</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        effectivenessContainer.innerHTML = content;
    }

    startAutoUpdate() {
        // Update every 24 hours (same as data refresh rate)
        setInterval(async () => {
            console.log('Auto-updating blocklist data...');
            await this.loadBlocklistData();
            this.updateStats();
            this.renderBlocklistGrid();
            this.updateAnalysis();
        }, 24 * 60 * 60 * 1000);
    }
}

// Initialize threat analytics when page loads
document.addEventListener('DOMContentLoaded', function() {
    new ThreatAnalytics();
});
