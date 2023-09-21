// Initialize the map
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
  });
  
  //Ttile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(myMap);
  
  // Loading GeoJSON data
  var geoJSONURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; // Replace with the URL you obtained
  fetch(geoJSONURL)
    .then((response) => response.json())
    .then((data) => {
      // Setting marker size based on magnitude of earthquake
      function getMarkerSize(magnitude) {
        return magnitude * 5;
      }
  
      // Setting marker color according to earthquake depth
      function getMarkerColor(depth) {
        // Customising colours
        if (depth < 10) return "green";
        else if (depth < 30) return "yellow";
        else if (depth < 50) return "orange";
        else return "red";
      }
  
     // Legend
  var legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  var div = L.DomUtil.create("div", "info legend");
  var depthRanges = []; 

  // Determining depth categories and colours for earthquake data
  data.features.forEach(function (feature) {
    var depth = feature.geometry.coordinates[2];
    var color = getMarkerColor(depth);
    
    // Does depthrange already exist?
    var existingRange = depthRanges.find(function (range) {
      return range.color === color;
    });

    if (!existingRange) {
      // Adding a new range if non existent
      depthRanges.push({ color: color, minDepth: depth, maxDepth: depth });
    } else {
      // If yes, update the existing range's minDepth and maxDepth
      if (depth < existingRange.minDepth) {
        existingRange.minDepth = depth;
      }
      if (depth > existingRange.maxDepth) {
        existingRange.maxDepth = depth;
      }
    }
  });

  // Generate legend HTML
  depthRanges.forEach(function (range) {
    div.innerHTML +=
      '<i style="background:' +
      range.color +
      '"></i> ' +
      range.minDepth +
      ' - ' +
      range.maxDepth +
      ' km<br>';
  });

  return div;
};

legend.addTo(myMap);

  
      //  GeoJSON layer and custom styling
      L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          var magnitude = feature.properties.mag;
          var depth = feature.geometry.coordinates[2];
  
          var markerOptions = {
            radius: getMarkerSize(magnitude),
            fillColor: getMarkerColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          };
  
          return L.circleMarker(latlng, markerOptions);
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            "<h3>Location: " +
              feature.properties.place +
              "</h3><hr><p>Magnitude: " +
              feature.properties.mag +
              "</p><p>Depth: " +
              feature.geometry.coordinates[2] +
              "</p>"
          );
        },
      }).addTo(myMap);
    });
  