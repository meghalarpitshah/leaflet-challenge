// Define the URL for earthquake data
let earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map centered on a specific location
let map = L.map("map").setView([37.09, -95.71], 4);

// Add a base tile layer (e.g., OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch earthquake data and create markers
fetch(earthquakeDataUrl)
    .then(response => response.json())
    .then(data => {
        createMarkers(data.features);
    });

// Function to create markers and popups
function createMarkers(earthquakeData) {
    // Loop through earthquake data and create markers
    earthquakeData.forEach(feature => {
        const { geometry, properties } = feature;
        const { coordinates } = geometry;
        const [longitude, latitude, depth] = coordinates;
        const magnitude = properties.mag;

        // Customize marker size and color based on magnitude and depth
        const marker = L.circleMarker([latitude, longitude], {
            radius: magnitude * 5, // Adjust the size multiplier as needed
            fillColor: getColor(depth), // Determine color based on depth
            color: 'black',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Create a popup with earthquake information
        marker.bindPopup(`
            <b>Magnitude:</b> ${magnitude}<br>
            <b>Depth:</b> ${depth} km
        `);

        // Add the marker to the map
        marker.addTo(map);
    });

    // Create a legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const depths = [0, 10, 30, 50, 70, 90];
        const labels = [];

        // Add legend labels
        for (let i = 0; i < depths.length - 1; i++) {
            labels.push(
                `<i style="background:${getColor(depths[i] + 1)}"></i> ${depths[i]}-${depths[i + 1]} km`
            );
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map);
}

// Function to determine marker color based on depth
function getColor(depth) {
    return depth > 90 ? '#ff0000' :
           depth > 70 ? '#ff6600' :
           depth > 50 ? '#ff9900' :
           depth > 30 ? '#ffcc00' :
           depth > 10 ? '#ffff00' :
                        '#ccff00';
}
