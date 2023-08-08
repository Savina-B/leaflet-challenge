// Function to determine marker color based on depth
function getColorForDepth(depth) {
    // color ranges based on depth
    var colorRanges = [
        [0, 'lightgreen'],
        [10, 'green'],
        [30, 'yellow'],
        [50, 'orange'],
        [70, 'red'],
        [90, 'darkred']
    ];

    // Loop through the color ranges and return the appropriate color
    for (var i = 0; i < colorRanges.length; i++) {
        if (depth <= colorRanges[i][0]) {
            return colorRanges[i][1];
        }
    }
    return 'black'; // Default color if depth is above the specified ranges
}

// Initializing map
var map = L.map('map').setView([0, 0], 2);

// Adding tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// earthquake data from JSON
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson', function(error, data) {
    if (error) throw error;

    //  create markers
    data.features.forEach(function(feature) {
        var magnitude = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];
        var markerSize = magnitude * 5; 
        var markerColor = getColorForDepth(depth);

        var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: markerSize,
            fillColor: markerColor,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth.toFixed(2)} km<br>Location: ${feature.properties.place}`);
    });

    // Legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        var depthRanges = [0, 10, 30, 50, 70, 90];
    
        for (var i = 0; i < depthRanges.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorForDepth(depthRanges[i] + 1) + '"></i> ' +
                depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    legend.addTo(map);
});
