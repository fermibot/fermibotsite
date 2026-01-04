// ============================================
// BC HARBOUR SEAL HAUL-OUT MAP
// Uses Leaflet.js for interactive mapping with OpenStreetMap
// Data from DFO Canada API with local CSV fallback
// ============================================

class BCHarbourSealMap {
    constructor() {
        // Data sources
        this.dfoApiUrl = 'https://api-proxy.edh-cde.dfo-mpo.gc.ca/catalogue/records/be5a4ba8-79dd-4787-bf8a-0d460d25954c/attachments/Phoques_commun_d%C3%A9nombrements_%C3%A9choueries_c%C3%B4teCB.csv';
        this.localCsvPath = 'Harbour_seal_counts_haulout_locs_BCcoast.csv';

        // Data storage
        this.data = [];
        this.aggregatedBySiteYear = new Map();

        // UI state
        this.years = [];
        this.regions = [];
        this.currentYear = null;
        this.currentRegion = 'all';
        this.dataSource = 'unknown';
        this.hasInitializedBounds = false;

        // Map elements
        this.map = null;
        this.markers = [];
        this.baseLayers = {};
        this.currentLayer = 'osm';

        // Leaflet layer groups
        this.markerLayer = null;
    }

    async initialize() {
        await this.loadData();
        this.buildAggregates();
        this.createMap();
        this.initControls();
        this.updateMarkers();
    }

    // ============================================
    // DATA LOADING
    // ============================================

    async loadData() {
        console.log('Loading harbour seal data...');

        try {
            // Try DFO API first
            console.log('Attempting to load from DFO API...');
            const response = await fetch(this.dfoApiUrl);

            if (!response.ok) {
                throw new Error(`DFO API returned status ${response.status}`);
            }

            const csvText = await response.text();
            this.data = d3.csvParse(csvText, d => ({
                SubsiteID: d.SubsiteID,
                Region: d.Region,
                Complex: d.Complex,
                Subarea: d.Subarea,
                Year: +d.Year,
                Date: d.Date,
                Longitude: +d.Longitude,
                Latitude: +d.Latitude,
                complex_count: +d.complex_count
            }));

            this.dataSource = 'dfo-api';
            console.log(`✓ Loaded ${this.data.length} records from DFO API`);

        } catch (error) {
            console.warn('Failed to load from DFO API:', error.message);
            console.log('Falling back to local CSV...');

            try {
                // Fallback to local CSV
                this.data = await d3.csv(this.localCsvPath, d => ({
                    SubsiteID: d.SubsiteID,
                    Region: d.Region,
                    Complex: d.Complex,
                    Subarea: d.Subarea,
                    Year: +d.Year,
                    Date: d.Date,
                    Longitude: +d.Longitude,
                    Latitude: +d.Latitude,
                    complex_count: +d.complex_count
                }));

                this.dataSource = 'local-csv';
                console.log(`✓ Loaded ${this.data.length} records from local CSV`);

            } catch (localError) {
                console.error('Failed to load local CSV:', localError);
                this.data = [];
                this.dataSource = 'failed';
            }
        }

        // Show data source status
        this.showDataSourceStatus();
    }

    showDataSourceStatus() {
        const statusHtml = `
            <div class="alert ${this.dataSource === 'dfo-api' ? 'alert-success' : 'alert-warning'} mb-2">
                <small>
                    <strong>📡 Data Source:</strong> ${this.dataSource === 'dfo-api' ?
                        '✓ DFO Canada API (live data)' :
                        this.dataSource === 'local-csv' ? '⚠ Local CSV (offline fallback)' : '✗ Failed to load data'}
                    ${this.dataSource !== 'failed' ? `| <strong>${this.data.length}</strong> records loaded` : ''}
                </small>
            </div>
        `;

        const mapCard = document.querySelector('#bcHarbourSealMap').closest('.card');
        const existingStatus = mapCard.previousElementSibling;
        if (existingStatus && existingStatus.classList.contains('alert')) {
            existingStatus.remove();
        }
        mapCard.insertAdjacentHTML('beforebegin', statusHtml);
    }

    buildAggregates() {
        const yearsSet = new Set();
        const regionsSet = new Set();

        this.data.forEach(row => {
            if (!row.Year || isNaN(row.Year)) return;
            if (!row.Longitude || !row.Latitude) return; // Skip invalid coordinates

            yearsSet.add(row.Year);
            if (row.Region) regionsSet.add(row.Region);

            const key = `${row.SubsiteID}-${row.Year}`;
            if (!this.aggregatedBySiteYear.has(key)) {
                this.aggregatedBySiteYear.set(key, {
                    SubsiteID: row.SubsiteID,
                    Region: row.Region,
                    Complex: row.Complex,
                    Year: row.Year,
                    lon: row.Longitude,
                    lat: row.Latitude,
                    total: 0,
                    count: 0 // Track number of records
                });
            }
            const agg = this.aggregatedBySiteYear.get(key);

            // Add count only if valid (not NaN and not negative)
            const count = row.complex_count;
            if (!isNaN(count) && count >= 0) {
                agg.total += count;
                agg.count++;
            }
        });

        this.years = Array.from(yearsSet).sort((a, b) => a - b);
        this.regions = Array.from(regionsSet).sort();
        this.currentYear = this.years[this.years.length - 1];

        console.log(`Aggregated: ${this.aggregatedBySiteYear.size} sites across ${this.years.length} years`);

        // Log sample data for debugging
        const sample = Array.from(this.aggregatedBySiteYear.values()).slice(0, 3);
        console.log('Sample aggregated data:', sample);
    }

    // ============================================
    // MAP CREATION
    // ============================================

    createMap() {
        // Initialize Leaflet map centered on Strait of Georgia
        this.map = L.map('bcHarbourSealMap', {
            center: [49.5, -124.5],
            zoom: 8,
            zoomControl: true
        });

        // Define base layers
        this.baseLayers = {
            'osm': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }),
            'satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics',
                maxZoom: 18
            }),
            'topo': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenTopoMap contributors',
                maxZoom: 17
            })
        };

        // Add default layer
        this.baseLayers['osm'].addTo(this.map);

        // Create marker layer group
        this.markerLayer = L.layerGroup().addTo(this.map);

        // Add scale
        L.control.scale({ imperial: false, metric: true }).addTo(this.map);

        // Add legend
        this.addLegend();

        // Add zoom event listener to adjust circle sizes
        this.map.on('zoomend', () => {
            this.updateCircleSizes();
        });

        console.log('Leaflet map initialized');
    }

    getRadiusForZoom(zoom) {
        // Dynamic radius based on zoom level
        // Zoom 6-7: Very zoomed out (show region) - tiny circles
        // Zoom 8-10: Medium zoom (show area) - small circles
        // Zoom 11-13: Zoomed in (show details) - medium circles
        // Zoom 14+: Very zoomed in (street level) - larger circles
        if (zoom <= 7) return 3;
        if (zoom <= 9) return 5;
        if (zoom <= 11) return 7;
        if (zoom <= 13) return 9;
        return 11;
    }

    getBorderWeightForZoom(zoom) {
        // Dynamic border weight - thinner when zoomed out to show color better
        if (zoom <= 7) return 0.5;  // Very thin border when zoomed out
        if (zoom <= 9) return 0.8;  // Thin border
        if (zoom <= 11) return 1;   // Normal border
        if (zoom <= 13) return 1.2; // Slightly thicker
        return 1.5;                 // Thicker border when zoomed in
    }

    updateCircleSizes() {
        const currentZoom = this.map.getZoom();
        const newRadius = this.getRadiusForZoom(currentZoom);
        const newWeight = this.getBorderWeightForZoom(currentZoom);

        this.markerLayer.eachLayer((layer) => {
            if (layer.setRadius) {
                layer.setRadius(newRadius);
            }
            if (layer.setStyle) {
                layer.setStyle({ weight: newWeight });
            }
        });
    }

    addLegend() {
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = (map) => {
            const div = L.DomUtil.create('div', 'map-legend');
            div.innerHTML = `
                <div style="background: rgba(255, 255, 255, 0.95); padding: 12px; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.3); border: 1px solid #ccc;">
                    <h6 style="margin: 0 0 10px 0; font-weight: bold; font-size: 13px; color: #333;">Harbour Seal Count</h6>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 18px; height: 18px; background: #bd0026; border-radius: 50%; border: 2px solid #333; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
                            <span style="font-size: 11px; color: #333;">500+</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 18px; height: 18px; background: #f03b20; border-radius: 50%; border: 2px solid #333; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
                            <span style="font-size: 11px; color: #333;">300-500</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 18px; height: 18px; background: #fd8d3c; border-radius: 50%; border: 2px solid #333; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
                            <span style="font-size: 11px; color: #333;">150-300</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 18px; height: 18px; background: #fecc5c; border-radius: 50%; border: 2px solid #333; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
                            <span style="font-size: 11px; color: #333;">50-150</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 18px; height: 18px; background: #ffffb2; border-radius: 50%; border: 2px solid #333; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
                            <span style="font-size: 11px; color: #333;">1-50</span>
                        </div>
                    </div>
                </div>
            `;
            return div;
        };

        legend.addTo(this.map);
    }

    // ============================================
    // CONTROLS
    // ============================================

    initControls() {
        const yearSelect = d3.select('#bcYearSelect');
        const regionSelect = d3.select('#bcRegionSelect');
        const layerSelect = d3.select('#bcMapLayer');

        // Populate year dropdown
        yearSelect.selectAll('option')
            .data(this.years)
            .join('option')
            .attr('value', d => d)
            .text(d => d);
        yearSelect.property('value', this.currentYear);

        // Populate region dropdown
        regionSelect.selectAll('option.region-opt')
            .data(this.regions)
            .join('option')
            .attr('class', 'region-opt')
            .attr('value', d => d)
            .text(d => d);

        // Event handlers
        yearSelect.on('change', (event) => {
            this.currentYear = +event.target.value;
            this.updateMarkers();
        });

        regionSelect.on('change', (event) => {
            this.currentRegion = event.target.value;
            this.updateMarkers();
        });

        layerSelect.on('change', (event) => {
            this.switchMapLayer(event.target.value);
        });

        d3.select('#bcReset').on('click', () => {
            this.currentYear = this.years[this.years.length - 1];
            this.currentRegion = 'all';
            this.map.setView([49.5, -124.5], 8);

            yearSelect.property('value', this.currentYear);
            regionSelect.property('value', 'all');

            this.updateMarkers();
        });
    }

    switchMapLayer(layerName) {
        // Remove current layer
        if (this.baseLayers[this.currentLayer]) {
            this.map.removeLayer(this.baseLayers[this.currentLayer]);
        }

        // Add new layer
        if (this.baseLayers[layerName]) {
            this.baseLayers[layerName].addTo(this.map);
            this.currentLayer = layerName;
        }
    }

    // ============================================
    // MARKERS
    // ============================================

    updateMarkers() {
        // Clear existing markers
        this.markerLayer.clearLayers();

        // Get filtered data
        const sites = [];
        this.aggregatedBySiteYear.forEach(agg => {
            if (agg.Year !== this.currentYear) return;
            if (this.currentRegion !== 'all' && agg.Region !== this.currentRegion) return;
            sites.push(agg);
        });

        if (sites.length === 0) {
            console.warn(`No data for year ${this.currentYear} and region ${this.currentRegion}`);
            return;
        }

        // Calculate max count for color scale
        const maxCount = d3.max(sites, d => d.total) || 1;
        const minCount = 0; // Start from 0 for better color distribution

        // Color scale using threshold breaks
        const getColor = (count) => {
            if (count >= 500) return '#bd0026';      // Dark red
            if (count >= 300) return '#f03b20';      // Red
            if (count >= 150) return '#fd8d3c';      // Orange
            if (count >= 50) return '#fecc5c';       // Light orange
            if (count >= 1) return '#ffffb2';        // Yellow
            return '#cccccc';                         // Gray for 0
        };

        // Dynamic radius and border weight based on current zoom level
        const currentZoom = this.map.getZoom();
        const radius = this.getRadiusForZoom(currentZoom);
        const borderWeight = this.getBorderWeightForZoom(currentZoom);

        // Add circle markers
        sites.forEach(site => {
            const color = getColor(site.total);

            const circle = L.circleMarker([site.lat, site.lon], {
                radius: radius,
                fillColor: color,
                color: '#fff',
                weight: borderWeight,
                opacity: 1,
                fillOpacity: 0.85
            });

            // Create tooltip content (shows on hover)
            const tooltipContent = `
                <div style="font-family: system-ui; font-size: 13px;">
                    <strong style="color: #0083B0;">🦭 ${site.Complex}</strong><br/>
                    <strong>Count:</strong> ${site.total > 0 ? site.total.toLocaleString() : 'No data'}<br/>
                    <strong>Year:</strong> ${site.Year}
                </div>
            `;

            // Create popup content (shows on click for more details)
            const popupContent = `
                <div class="seal-popup">
                    <h6>🦭 ${site.Complex}</h6>
                    <div class="popup-row">
                        <span class="popup-label">Site ID:</span>
                        <span>${site.SubsiteID}</span>
                    </div>
                    <div class="popup-row">
                        <span class="popup-label">Region:</span>
                        <span>${site.Region}</span>
                    </div>
                    <div class="popup-row">
                        <span class="popup-label">Year:</span>
                        <span>${site.Year}</span>
                    </div>
                    <div class="popup-row">
                        <span class="popup-label">Seal Count:</span>
                        <span><strong>${site.total > 0 ? site.total.toLocaleString() : 'No data available'}</strong></span>
                    </div>
                </div>
            `;

            // Bind tooltip (shows on hover) - permanent and sticky
            circle.bindTooltip(tooltipContent, {
                permanent: false,
                sticky: true,
                direction: 'top',
                offset: [0, -10]
            });

            // Also bind popup (shows on click for more details)
            circle.bindPopup(popupContent);

            circle.addTo(this.markerLayer);
        });

        console.log(`Rendered ${sites.length} haul-out sites for ${this.currentYear}`);
        console.log(`Count range: ${minCount} to ${maxCount}`);

        // Fit map to markers on first load only (not on filter changes)
        if (sites.length > 0 && !this.hasInitializedBounds) {
            const bounds = L.latLngBounds(sites.map(s => [s.lat, s.lon]));
            this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
            this.hasInitializedBounds = true;
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const bcMap = new BCHarbourSealMap();
        await bcMap.initialize();
    } catch (error) {
        console.error('Error initializing BC Harbour Seal map:', error);

        // Show error message
        const container = document.getElementById('bcHarbourSealMap');
        container.innerHTML = `
            <div class="alert alert-danger m-3">
                <strong>Error loading map:</strong> ${error.message}
            </div>
        `;
    }
});
