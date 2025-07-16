class ThreatIntelligence {
    constructor() {
        this.map = null;
        this.threatData = new Map();
        this.countryLayers = new Map();
        this.currentFilter = 'all';
        this.lastUpdate = null;
        this.tooltip = null;
        this.threatTypes = {
            'compromised_host': 'Compromised Host',
            'dns_attack': 'DNS Attacks', 
            'port_scanning': 'Port Scanning',
            'sql_injection': 'SQL Injection',
            'ssh_scanning': 'SSH Scanning',
            'terminal_server_attack': 'Terminal Server Attacks',
            'tor_traffic': 'Tor Traffic',
            'unknown': 'Unknown Threats'
        };
        
        // GitHub repository base URL - using correct raw URL format
        this.githubBaseUrl = 'https://raw.githubusercontent.com/Tempest-Solutions-Company/threat-feeds/main/';
        // Alternative CORS proxy
        this.corsProxy = 'https://corsproxy.io/?';
        
        this.init();
    }

    async init() {
        this.initMap();
        this.setupEventListeners();
        await this.loadThreatData();
        this.updateMap();
        this.updateStats();
        this.updateAnalysis();
        this.startAutoUpdate();
    }

    initMap() {
        // Initialize Leaflet map without zoom controls
        this.map = L.map('threat-map', {
            center: [20, 0],
            zoom: 2,
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            dragging: false,
            attributionControl: true
        });

        // Add tile layer with dark theme to match site
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(this.map);

        // Initialize tooltip with debugging
        this.tooltip = document.getElementById('country-tooltip');
        if (!this.tooltip) {
            console.error('Tooltip element with ID "country-tooltip" not found!');
            // Create tooltip if it doesn't exist
            this.tooltip = document.createElement('div');
            this.tooltip.id = 'country-tooltip';
            this.tooltip.className = 'country-tooltip';
            this.tooltip.style.display = 'none';
            document.body.appendChild(this.tooltip);
            console.log('Created tooltip element');
        } else {
            console.log('Tooltip element found successfully');
        }
    }

    setupEventListeners() {
        // Filter dropdown - check if element exists
        const filterSelect = document.getElementById('threat-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.updateMap();
                this.updateStats();
            });
        } else {
            console.warn('threat-filter element not found in DOM');
        }

        // Mouse move for tooltip positioning - improved boundary detection
        const threatMap = document.getElementById('threat-map');
        if (threatMap) {
            threatMap.addEventListener('mousemove', (e) => {
                if (this.tooltip && this.tooltip.style.display === 'block') {
                    const mapRect = threatMap.getBoundingClientRect();
                    const tooltipRect = this.tooltip.getBoundingClientRect();
                    
                    // Calculate initial position relative to map container
                    let x = e.clientX - mapRect.left + 15;
                    let y = e.clientY - mapRect.top - 10;
                    
                    // Boundary detection for horizontal positioning
                    if (x + tooltipRect.width > mapRect.width) {
                        // Position tooltip to the left of cursor if it would go off right edge
                        x = e.clientX - mapRect.left - tooltipRect.width - 15;
                    }
                    
                    // Ensure tooltip doesn't go off left edge
                    if (x < 0) {
                        x = 10;
                    }
                    
                    // Boundary detection for vertical positioning
                    if (y + tooltipRect.height > mapRect.height) {
                        // Position tooltip above cursor if it would go off bottom edge
                        y = e.clientY - mapRect.top - tooltipRect.height - 15;
                    }
                    
                    // Ensure tooltip doesn't go off top edge
                    if (y < 0) {
                        y = 10;
                    }
                    
                    // Apply the calculated position relative to the map container
                    this.tooltip.style.left = (mapRect.left + x) + 'px';
                    this.tooltip.style.top = (mapRect.top + y) + 'px';
                }
            });
        } else {
            console.warn('threat-map element not found in DOM');
        }
    }

    async loadThreatData() {
        try {
            console.log('Loading threat data from GitHub CSV files...');
            // Clear existing data first
            this.threatData.clear();
            
            this.threatData = await this.fetchThreatDataFromCSV();
            
            if (this.threatData.size === 0) {
                throw new Error('No threat data loaded from CSV files - all files may be empty or inaccessible');
            }
            
            this.lastUpdate = new Date();
            
            // Update last update time
            document.getElementById('last-update-time').textContent = 
                this.lastUpdate.toLocaleString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
            console.log(`Successfully loaded data for ${this.threatData.size} countries`);
            
            // Calculate and verify total
            let totalThreats = 0;
            this.threatData.forEach(threats => {
                Object.values(threats).forEach(count => totalThreats += count);
            });
            console.log(`Total threats loaded: ${totalThreats} (expected: ~207 based on GitHub data)`);
            
        } catch (error) {
            console.error('Error loading threat data:', error);
            // Show error message to user
            document.getElementById('last-update-time').textContent = 'Error loading data from GitHub';
            document.getElementById('total-threats').textContent = 'Error';
            document.getElementById('countries-count').textContent = 'Error';
            document.getElementById('top-threat-type').textContent = 'Error';
            document.getElementById('top-country').textContent = 'Error';
            
            // Update analysis sections with error message
            document.getElementById('threat-summary').innerHTML = 
                '<p style="color: #ff6b35;">Failed to load threat data from GitHub repository. Please check repository accessibility.</p>';
            document.getElementById('geo-trends').innerHTML = 
                '<p style="color: #ff6b35;">Unable to load geographical data. Please verify GitHub repository is accessible.</p>';
        }
    }

    async fetchThreatDataFromCSV() {
        const threatData = new Map();
        // CORRECTED: Use .csv extensions (confirmed from your actual file content)
        const csvFiles = [
            'compromised_host_threats.csv',
            'dns_attack_threats.csv',
            'port_scanning_threats.csv',
            'sql_injection_threats.csv',
            'ssh_scanning_threats.csv',
            'terminal_server_attack_threats.csv',
            'tor_traffic_threats.csv',
            'unknown_threats.csv'
        ];

        console.log('Fetching REAL threat data from GitHub repository...');

        const fetchPromises = csvFiles.map(async (file) => {
            try {
                const threatType = file.replace('_threats.csv', '');
                const url = this.githubBaseUrl + file;
                
                console.log(`Fetching ${file} from ${url}...`);
                
                let response;
                
                try {
                    // First attempt: Direct fetch
                    response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Accept': 'text/plain, text/csv, */*',
                            'Cache-Control': 'no-cache'
                        }
                    });
                } catch (corsError) {
                    console.warn(`Direct fetch failed due to CORS for ${file}, using proxy...`);
                    
                    // Second attempt: Use different CORS proxy
                    const proxyUrl = this.corsProxy + encodeURIComponent(url);
                    console.log(`Trying proxy URL: ${proxyUrl}`);
                    
                    response = await fetch(proxyUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'text/plain, text/csv, */*'
                        }
                    });
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText} for ${file}`);
                }
                
                const csvText = await response.text();
                console.log(`Successfully fetched ${file}, size: ${csvText.length} bytes`);
                
                if (csvText.trim().length > 0) {
                    const entriesCount = this.parseCSVData(csvText, threatType, threatData);
                    console.log(`Parsed ${entriesCount} entries from ${file}`);
                } else {
                    console.warn(`${file} is empty`);
                }
                
                return { file, success: true };
            } catch (error) {
                console.error(`Failed to fetch ${file}:`, error.message);
                return { file, success: false, error: error.message };
            }
        });

        const results = await Promise.all(fetchPromises);
        const successfulFetches = results.filter(r => r.success);
        const failedFetches = results.filter(r => !r.success);
        
        console.log(`Successfully fetched ${successfulFetches.length}/${csvFiles.length} files`);
        
        if (failedFetches.length > 0) {
            console.log('Failed fetches:', failedFetches.map(f => `${f.file}: ${f.error}`));
        }
        
        // ONLY use real data - no fallback to mock data
        if (successfulFetches.length === 0) {
            throw new Error('Failed to fetch any CSV files from GitHub repository. Please check repository accessibility and CORS configuration.');
        }

        console.log(`Total countries with threat data: ${threatData.size}`);
        return threatData;
    }

    parseCSVData(csvText, threatType, threatData) {
        const lines = csvText.trim().split('\n');
        let validEntries = 0;
        let unknownCountryEntries = 0;
        
        lines.forEach((line, index) => {
            // Skip empty lines and header row
            if (!line.trim()) return;
            
            // Skip header row
            if (index === 0 && (line.includes('ip,first_seen') || line.includes('first_seen'))) {
                return;
            }
            
            // Parse CSV line with proper handling for quoted fields
            const columns = this.parseCSVLine(line);
            
            if (columns.length >= 7) {
                // Country is in the last column (index 7 for 8 columns, or could be blank)
                let country = '';
                if (columns.length >= 8 && columns[7] && columns[7].trim()) {
                    country = columns[7].trim().toUpperCase();
                } else if (columns.length >= 7 && columns[6] && columns[6].trim()) {
                    // Check if column 6 might be the country (when protocol is missing)
                    const possibleCountry = columns[6].trim();
                    if (possibleCountry.length === 2 && /^[A-Z]{2}$/i.test(possibleCountry)) {
                        country = possibleCountry.toUpperCase();
                    }
                }
                
                // If no valid country code, assign to "UNKNOWN" category
                if (!country || country.length !== 2) {
                    country = 'UNKNOWN';
                    unknownCountryEntries++;
                }
                
                // Each row represents 1 unique IP/threat
                const count = 1;
                
                if (!threatData.has(country)) {
                    threatData.set(country, {});
                }
                
                if (!threatData.get(country)[threatType]) {
                    threatData.get(country)[threatType] = 0;
                }
                
                threatData.get(country)[threatType] += count;
                validEntries++;
            }
        });
        
        console.log(`Parsed ${validEntries} valid entries for ${threatType} (${unknownCountryEntries} without country data)`);
        return validEntries;
    }

    // Helper method to properly parse CSV lines with quoted fields
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add the last field
        result.push(current);
        
        return result;
    }

    updateMap() {
        // Clear existing layers
        this.countryLayers.forEach(layer => {
            this.map.removeLayer(layer);
        });
        this.countryLayers.clear();

        // Country coordinates for visualization (EXPANDED with missing countries)
        const countryCoords = {
            'US': [39.8283, -98.5795], 'CN': [35.8617, 104.1954], 'RU': [61.5240, 105.3188],
            'DE': [51.1657, 10.4515], 'NL': [52.1326, 5.2913], 'FR': [46.2276, 2.2137],
            'GB': [55.3781, -3.4360], 'BR': [-14.2350, -51.9253], 'IN': [20.5937, 78.9629],
            'CA': [56.1304, -106.3468], 'ID': [-0.7893, 113.9213], 'KR': [35.9078, 127.7669],
            'JP': [36.2048, 138.2529], 'AU': [-25.2744, 133.7751], 'IT': [41.8719, 12.5674],
            'ES': [40.4637, -3.7492], 'SE': [60.1282, 18.6435], 'NO': [60.4720, 8.4689],
            'FI': [61.9241, 25.7482], 'PL': [51.9194, 19.1451], 'MX': [23.6345, -102.5528],
            'AR': [-38.4161, -63.6167], 'ZA': [-30.5595, 22.9375], 'EG': [26.8206, 30.8025],
            'TR': [38.9637, 35.2433], 'UA': [48.3794, 31.1656], 'TH': [15.8700, 100.9925],
            'VN': [14.0583, 108.2772], 'MY': [4.2105, 101.9758], 'SG': [1.3521, 103.8198],
            'PH': [12.8797, 121.7740], 'PK': [30.3753, 69.3451], 'BD': [23.6850, 90.3563],
            'IR': [32.4279, 53.6880], 'IQ': [33.2232, 43.6793], 'SA': [23.8859, 45.0792],
            'AE': [23.4241, 53.8478], 'IL': [31.0461, 34.8516], 'GR': [39.0742, 21.8243],
            'RO': [45.9432, 24.9668], 'BG': [42.7339, 25.4858], 'HR': [45.1000, 15.2000],
            'CZ': [49.8175, 15.4730], 'SK': [48.6690, 19.6990], 'HU': [47.1625, 19.5033],
            'AT': [47.5162, 14.5501], 'CH': [46.8182, 8.2275], 'BE': [50.5039, 4.4699],
            'DK': [56.2639, 9.5018], 'IE': [53.4129, -8.2439], 'PT': [39.3999, -8.2245],
            'IS': [64.9631, -19.0208], 'LU': [49.8153, 6.1296], 'MT': [35.9375, 14.3754],
            // ADDED MISSING COUNTRIES from your threat data:
            'HK': [22.3193, 114.1694], // Hong Kong
            'AD': [42.5462, 1.6014],   // Andorra
            'BZ': [17.1899, -88.4976], // Belize
            'AQ': [-75.2540, 0.0715],  // Antarctica (approx)
            'LT': [55.1694, 23.8813],  // Lithuania
            'SC': [-4.6796, 55.4920],  // Seychelles
            'PA': [8.4380, -80.9821],  // Panama
            'LI': [47.1410, 9.5209],   // Liechtenstein
            'MC': [43.7333, 7.4167],   // Monaco
            'SM': [43.9424, 12.4578],  // San Marino
            'VA': [41.9029, 12.4534],  // Vatican City
            'UY': [-32.5228, -55.7658], // Uruguay
            'CL': [-35.6751, -71.5430], // Chile
            'PE': [-9.1900, -75.0152],  // Peru
            'CO': [4.5709, -74.2973],   // Colombia
            'VE': [6.4238, -66.5897],   // Venezuela
            'GY': [4.8604, -58.9302],   // Guyana
            'SR': [3.9193, -56.0278],   // Suriname
            'GF': [3.9339, -53.1258],   // French Guiana
            'FK': [-51.7963, -59.5236], // Falkland Islands
            'GS': [-54.4296, -36.5882], // South Georgia
            'TF': [-49.2804, 69.3486],  // French Southern Territories
            'HM': [-53.1814, 73.5042],  // Heard & McDonald Islands
            'BV': [-54.4208, 3.3464],   // Bouvet Island
            'SJ': [77.5536, 23.6703],   // Svalbard & Jan Mayen
            'UM': [19.2823, 166.6470],  // U.S. Minor Outlying Islands
            'AS': [-14.2710, -170.1322], // American Samoa
            'GU': [13.4443, 144.7937],  // Guam
            'MP': [17.3308, 145.3846],  // Northern Mariana Islands
            'PR': [18.2208, -66.5901],  // Puerto Rico
            'VI': [18.3358, -64.8963],  // U.S. Virgin Islands
            'CC': [-12.1642, 96.8710],  // Cocos Islands
            'CX': [-10.4475, 105.6904], // Christmas Island
            'NF': [-29.0408, 167.9547], // Norfolk Island
            'PN': [-24.7036, -127.4393], // Pitcairn Islands
            'TK': [-8.9676, -171.8554], // Tokelau
            'NU': [-19.0544, -169.8672], // Niue
            'CK': [-21.2367, -159.7777], // Cook Islands
            'WF': [-13.7687, -177.1562], // Wallis & Futuna
            'PF': [-17.6797, -149.4068], // French Polynesia
            'NC': [-20.9043, 165.6180],  // New Caledonia
            'VU': [-15.3767, 166.9592],  // Vanuatu
            'FJ': [-16.5780, 179.4144],  // Fiji
            'SB': [-9.6457, 160.1562],   // Solomon Islands
            'TV': [-7.1095, 177.6493],   // Tuvalu
            'KI': [-3.3704, -168.7340],  // Kiribati
            'MH': [7.1315, 171.1845],    // Marshall Islands
            'FM': [7.4256, 150.5508],    // Micronesia
            'PW': [7.5150, 134.5825],    // Palau
            'WS': [-13.7590, -172.1046], // Samoa
            'TO': [-21.1789, -175.1982], // Tonga
            'NR': [-0.5228, 166.9315],   // Nauru
            'KP': [40.3399, 127.5101],   // North Korea
            'MM': [21.9162, 95.9560],    // Myanmar
            'LA': [19.8563, 102.4955],   // Laos
            'KH': [12.5657, 104.9910],   // Cambodia
            'BN': [4.5353, 114.7277],    // Brunei
            'TL': [-8.8742, 125.7275],   // East Timor
            'MV': [3.2028, 73.2207],     // Maldives
            'LK': [7.8731, 80.7718],     // Sri Lanka
            'BT': [27.5142, 90.4336],    // Bhutan
            'NP': [28.3949, 84.1240],    // Nepal
            'AF': [33.9391, 67.7100],    // Afghanistan
            'TJ': [38.8610, 71.2761],    // Tajikistan
            'KG': [41.2044, 74.7661],    // Kyrgyzstan
            'UZ': [41.3775, 64.5853],    // Uzbekistan
            'TM': [38.9697, 59.5563],    // Turkmenistan
            'KZ': [48.0196, 66.9237],    // Kazakhstan
            'MN': [46.8625, 103.8467],   // Mongolia
            'BY': [53.7098, 27.9534],    // Belarus
            'MD': [47.4116, 28.3699],    // Moldova
            'GE': [42.3154, 43.3569],    // Georgia
            'AM': [40.0691, 45.0382],    // Armenia
            'AZ': [40.1431, 47.5769],    // Azerbaijan
            'CY': [35.1264, 33.4299],    // Cyprus
            'LV': [56.8796, 24.6032],    // Latvia
            'EE': [58.5953, 25.0136],    // Estonia
            'SI': [46.1512, 14.9955],    // Slovenia
            'MK': [41.6086, 21.7453],    // North Macedonia
            'BA': [43.9159, 17.6791],    // Bosnia and Herzegovina
            'ME': [42.7087, 19.3744],    // Montenegro
            'RS': [44.0165, 21.0059],    // Serbia
            'AL': [41.1533, 20.1683],    // Albania
            'XK': [42.6026, 20.9030],    // Kosovo
            'LY': [26.3351, 17.2283],    // Libya
            'TN': [33.8869, 9.5375],     // Tunisia
            'DZ': [28.0339, 1.6596],     // Algeria
            'MA': [31.7917, -7.0926],    // Morocco
            'EH': [24.2155, -12.8858],   // Western Sahara
            'MR': [21.0079, -10.9408],   // Mauritania
            'ML': [17.5707, -3.9962],    // Mali
            'BF': [12.2383, -1.5616],    // Burkina Faso
            'NE': [17.6078, 8.0817],     // Niger
            'TD': [15.4542, 18.7322],    // Chad
            'SD': [12.8628, 30.2176],    // Sudan
            'SS': [6.8770, 31.3070],     // South Sudan
            'ER': [15.1794, 39.7823],    // Eritrea
            'ET': [9.1450, 40.4897],     // Ethiopia
            'DJ': [11.8251, 42.5903],    // Djibouti
            'SO': [5.1521, 46.1996],     // Somalia
            'KE': [-0.0236, 37.9062],    // Kenya
            'UG': [1.3733, 32.2903],     // Uganda
            'RW': [-1.9403, 29.8739],    // Rwanda
            'BI': [-3.3731, 29.9189],    // Burundi
            'TZ': [-6.3690, 34.8888],    // Tanzania
            'MW': [-13.2543, 34.3015],   // Malawi
            'ZM': [-13.1339, 27.8493],   // Zambia
            'ZW': [-19.0154, 29.1549],   // Zimbabwe
            'BW': [-22.3285, 24.6849],   // Botswana
            'NA': [-22.9576, 18.4904],   // Namibia
            'SZ': [-26.5225, 31.4659],   // Eswatini
            'LS': [-29.6100, 28.2336],   // Lesotho
            'MG': [-18.7669, 46.8691],   // Madagascar
            'MU': [-20.3484, 57.5522],   // Mauritius
            'KM': [-11.6455, 43.3333],   // Comoros
            'YT': [-12.8275, 45.1662],   // Mayotte
            'RE': [-21.1151, 55.5364],   // Reunion
            'CV': [16.5388, -24.0132],   // Cape Verde
            'ST': [0.1864, 6.6131],      // Sao Tome and Principe
            'GQ': [1.6508, 10.2679],     // Equatorial Guinea
            'GA': [-0.8037, 11.6094],    // Gabon
            'CG': [-0.2280, 15.8277],    // Republic of the Congo
            'CD': [-4.0383, 21.7587],    // Democratic Republic of the Congo
            'CF': [6.6111, 20.9394],     // Central African Republic
            'CM': [7.3697, 12.3547],     // Cameroon
            'NG': [9.0820, 8.6753],      // Nigeria
            'BJ': [9.3077, 2.3158],      // Benin
            'TG': [8.6195, 0.8248],      // Togo
            'GH': [7.9465, -1.0232],     // Ghana
            'CI': [7.5400, -5.5471],     // Cote d'Ivoire
            'LR': [6.4281, -9.4295],     // Liberia
            'SL': [8.4606, -11.7799],    // Sierra Leone
            'GN': [9.9456, -9.6966],     // Guinea
            'GW': [11.8037, -15.1804],   // Guinea-Bissau
            'SN': [14.4974, -14.4524],   // Senegal
            'GM': [13.4432, -15.3101],   // Gambia
            'JO': [30.5852, 36.2384],    // Jordan
            'LB': [33.8547, 35.8623],    // Lebanon
            'SY': [34.8021, 38.9968],    // Syria
            'YE': [15.5527, 48.5164],    // Yemen
            'OM': [21.4735, 55.9754],    // Oman
            'QA': [25.3548, 51.1839],    // Qatar
            'BH': [25.9304, 50.6378],    // Bahrain
            'KW': [29.3117, 47.4818]     // Kuwait
        };

        let mapHasData = false;

        this.threatData.forEach((threats, country) => {
            // Skip UNKNOWN countries for map display but include in statistics
            if (country === 'UNKNOWN') {
                return;
            }

            if (!countryCoords[country]) {
                console.warn(`No coordinates found for country: ${country} - adding to stats but not map`);
                return;
            }

            let threatCount = 0;
            if (this.currentFilter === 'all') {
                threatCount = Object.values(threats).reduce((sum, count) => sum + count, 0);
            } else {
                threatCount = threats[this.currentFilter] || 0;
            }

            if (threatCount === 0) return;

            // Only add to map if we have coordinates
            if (countryCoords[country]) {
                mapHasData = true;
                const [lat, lng] = countryCoords[country];
                const intensity = this.getThreatIntensity(threatCount);
                const color = this.getIntensityColor(intensity);
                const radius = Math.max(8, Math.min(40, Math.sqrt(threatCount) * 2));

                const circle = L.circleMarker([lat, lng], {
                    radius: radius,
                    fillColor: color,
                    color: '#ffffff',
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.6
                });

                // Add hover events with extensive debugging
                circle.on('mouseover', (e) => {
                    console.log('Circle mouseover triggered for:', country);
                    console.log('Threats data:', threats);
                    console.log('Total count:', threatCount);
                    console.log('Tooltip element exists:', !!this.tooltip);
                    
                    e.target.setStyle({
                        weight: 3,
                        fillOpacity: 0.9,
                        radius: radius * 1.1
                    });
                    
                    this.showTooltip(country, threats, threatCount);
                });

                circle.on('mouseout', (e) => {
                    console.log('Circle mouseout triggered for:', country);
                    
                    e.target.setStyle({
                        weight: 2,
                        fillOpacity: 0.6,
                        radius: radius
                    });
                    
                    this.hideTooltip();
                });

                circle.addTo(this.map);
                this.countryLayers.set(country, circle);
            }
        });

        if (!mapHasData) {
            console.warn('No data to display on map');
        }
    }

    showTooltip(country, threats, totalCount) {
        console.log('showTooltip called with:', country, threats, totalCount);
        
        if (!this.tooltip) {
            console.error('Tooltip element not found in showTooltip');
            return;
        }

        let content = `<div class="tooltip-header">
            <h4>${country}</h4>
            <div class="total-threats">Total: ${totalCount.toLocaleString()}</div>
        </div>`;
        
        if (this.currentFilter === 'all') {
            content += `<div class="threat-breakdown">`;
            const sortedThreats = Object.entries(threats)
                .filter(([type, count]) => count > 0)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8);
                
            console.log('Sorted threats for tooltip:', sortedThreats);
                
            if (sortedThreats.length > 0) {
                sortedThreats.forEach(([type, count]) => {
                    const intensity = this.getThreatIntensity(count);
                    const threatName = this.threatTypes[type] || type;
                    content += `<div class="threat-row">
                        <span class="threat-type">${threatName}:</span>
                        <span class="threat-count">${count.toLocaleString()}</span>
                        <span class="intensity-badge ${intensity}">${intensity.toUpperCase()}</span>
                    </div>`;
                });
            } else {
                content += `<div class="threat-row">
                    <span class="no-threats">No specific threat categories available</span>
                </div>`;
            }
            content += `</div>`;
        } else {
            const filteredCount = threats[this.currentFilter] || 0;
            const intensity = this.getThreatIntensity(filteredCount);
            const threatName = this.threatTypes[this.currentFilter] || this.currentFilter;
            content += `<div class="filtered-threat">
                <div class="threat-row">
                    <span class="threat-type">${threatName}:</span>
                    <span class="threat-count">${filteredCount.toLocaleString()}</span>
                    <span class="intensity-badge ${intensity}">${intensity.toUpperCase()}</span>
                </div>
            </div>`;
        }

        this.tooltip.innerHTML = content;
        this.tooltip.style.display = 'block';
        this.tooltip.style.opacity = '1';
        this.tooltip.style.position = 'fixed'; // Changed to fixed for better positioning control
        this.tooltip.style.zIndex = '10000';
        
        // Trigger a mouse move event to position the tooltip correctly
        const mapElement = document.getElementById('threat-map');
        if (mapElement) {
            const rect = mapElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Create a synthetic mouse event to position tooltip
            const syntheticEvent = new MouseEvent('mousemove', {
                clientX: centerX,
                clientY: centerY,
                bubbles: true
            });
            mapElement.dispatchEvent(syntheticEvent);
        }
        
        console.log('Tooltip content set:', content);
        console.log('Tooltip display style:', this.tooltip.style.display);
        console.log('Tooltip visibility:', this.tooltip.offsetWidth > 0 && this.tooltip.offsetHeight > 0);
    }

    hideTooltip() {
        console.log('hideTooltip called');
        if (this.tooltip) {
            this.tooltip.style.display = 'none';
            this.tooltip.style.opacity = '0';
            console.log('Tooltip hidden');
        }
    }

    getThreatIntensity(count) {
        if (count >= 500) return 'critical';
        if (count >= 100) return 'high';
        if (count >= 20) return 'medium';
        return 'low';
    }

    getIntensityColor(intensity) {
        const colors = {
            'low': '#00ff88',
            'medium': '#00d4ff',
            'high': '#ff6b35',
            'critical': '#ff0000'
        };
        return colors[intensity] || colors.low;
    }

    updateStats() {
        let totalThreats = 0;
        const countryCount = this.threatData.size;
        const threatTypeCounts = {};
        const countryTotals = new Map();

        this.threatData.forEach((threats, country) => {
            let countryTotal = 0;
            
            Object.entries(threats).forEach(([type, count]) => {
                if (this.currentFilter === 'all' || type === this.currentFilter) {
                    totalThreats += count;
                    countryTotal += count;
                    threatTypeCounts[type] = (threatTypeCounts[type] || 0) + count;
                }
            });
            
            if (countryTotal > 0) {
                countryTotals.set(country, countryTotal);
            }
        });

        // Update stat cards
        document.getElementById('total-threats').textContent = totalThreats.toLocaleString();
        document.getElementById('countries-count').textContent = countryCount;

        // Find top threat type
        const topThreatType = Object.entries(threatTypeCounts)
            .sort(([,a], [,b]) => b - a)[0];
        
        document.getElementById('top-threat-type').textContent = 
            topThreatType ? this.threatTypes[topThreatType[0]] || topThreatType[0] : 'None';

        // Find top country
        const topCountry = [...countryTotals.entries()]
            .sort(([,a], [,b]) => b - a)[0];
        
        document.getElementById('top-country').textContent = 
            topCountry ? topCountry[0] : 'None';
            
        console.log(`Stats updated: ${totalThreats} threats, ${countryCount} countries, top: ${topThreatType?.[0] || 'None'}, ${topCountry?.[0] || 'None'}`);
    }

    updateAnalysis() {
        this.updateThreatSummary();
        this.updateGeoTrends();
    }

    updateThreatSummary() {
        const summaryContainer = document.getElementById('threat-summary');
        
        // Calculate threat type statistics
        const threatStats = {};
        let totalThreats = 0;

        // Initialize all threat types to 0 to ensure they all appear
        Object.keys(this.threatTypes).forEach(type => {
            threatStats[type] = 0;
        });
        
        this.threatData.forEach((threats) => {
            Object.entries(threats).forEach(([type, count]) => {
                threatStats[type] = (threatStats[type] || 0) + count;
                totalThreats += count;
            });
        });

        if (totalThreats === 0) {
            summaryContainer.innerHTML = '<p>No threat data available</p>';
            return;
        }

        // Show ALL threat types (not just top 5) sorted by count
        const sortedThreats = Object.entries(threatStats)
            .sort(([,a], [,b]) => b - a);

        let content = `<div class="threat-summary-content">`;
        content += `<p class="summary-intro">Analysis of <strong>${totalThreats.toLocaleString()}</strong> threats detected across <strong>all ${sortedThreats.length} categories</strong> in the last 30 days:</p>`;
        content += `<div class="threat-list">`;

        sortedThreats.forEach(([type, count], index) => {
            const percentage = totalThreats > 0 ? ((count / totalThreats) * 100).toFixed(1) : '0.0';
            const statusClass = count > 0 ? 'active' : 'inactive';
            
            content += `
                <div class="threat-summary-item ${statusClass}">
                    <div class="threat-rank">${index + 1}</div>
                    <div class="threat-details">
                        <div class="threat-name">${this.threatTypes[type] || type}</div>
                        <div class="threat-stats">
                            <span class="threat-count">${count.toLocaleString()}</span>
                            <span class="threat-percentage">(${percentage}%)</span>
                            ${count === 0 ? '<span class="no-threats">No threats detected</span>' : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        content += `</div>`;
        
        // Add summary of categories
        const activeCategories = sortedThreats.filter(([,count]) => count > 0).length;
        const inactiveCategories = sortedThreats.length - activeCategories;
        
        content += `<div class="category-summary">`;
        content += `<p><strong>Active Categories:</strong> ${activeCategories} of ${sortedThreats.length} threat types detected</p>`;
        if (inactiveCategories > 0) {
            content += `<p><strong>Inactive Categories:</strong> ${inactiveCategories} threat types with no current activity</p>`;
        }
        content += `</div>`;
        
        content += `</div>`;
        summaryContainer.innerHTML = content;
    }

    updateGeoTrends() {
        const trendsContainer = document.getElementById('geo-trends');
        
        // Calculate geographical statistics (exclude UNKNOWN for country rankings)
        const countryStats = new Map();
        let unknownThreats = 0;
        
        this.threatData.forEach((threats, country) => {
            const total = Object.values(threats).reduce((sum, count) => sum + count, 0);
            if (country === 'UNKNOWN') {
                unknownThreats = total;
            } else {
                countryStats.set(country, total);
            }
        });

        if (countryStats.size === 0) {
            trendsContainer.innerHTML = '<p>No geographical data available</p>';
            return;
        }

        const sortedCountries = [...countryStats.entries()]
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10); // Changed from 5 to 10

        const totalThreats = [...countryStats.values()].reduce((sum, count) => sum + count, 0);

        let content = `<div class="geo-trends-content">`;
        content += `<p class="trends-intro">Top source countries for security threats:</p>`;
        content += `<div class="country-list">`;

        sortedCountries.forEach(([country, count], index) => {
            const percentage = ((count / totalThreats) * 100).toFixed(1);
            const intensity = this.getThreatIntensity(count);
            
            content += `
                <div class="country-trend-item">
                    <div class="country-rank">${index + 1}</div>
                    <div class="country-details">
                        <div class="country-name">${country}</div>
                        <div class="country-stats">
                            <span class="country-count">${count.toLocaleString()}</span>
                            <span class="country-percentage">(${percentage}%)</span>
                            <span class="intensity-badge ${intensity}">${intensity.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        content += `</div>`;
        
        if (unknownThreats > 0) {
            content += `<p class="unknown-note"><strong>Note:</strong> ${unknownThreats} threats detected without country identification.</p>`;
        }
        
        content += `<p class="trends-note">Geographic patterns may indicate compromised infrastructure, targeted campaigns, or regional security issues.</p>`;
        content += `</div>`;
        
        trendsContainer.innerHTML = content;
    }

    startAutoUpdate() {
        // Update every 30 minutes
        setInterval(async () => {
            console.log('Auto-updating threat data...');
            await this.loadThreatData();
            this.updateMap();
            this.updateStats();
            this.updateAnalysis();
        }, 30 * 60 * 1000);
    }
}

// Initialize threat intelligence when page loads
document.addEventListener('DOMContentLoaded', function() {
    new ThreatIntelligence();
});
