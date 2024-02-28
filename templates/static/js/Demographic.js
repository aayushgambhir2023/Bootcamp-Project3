url = "/api/v1.0/city_ward_geojson"

d3.json(url).then(function(response){
    console.log(response)
    createWardFeatures(response)
})

// Function to create ward features
function createWardFeatures(wardData) {
  // interaction
  function onEachWardFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.name}</h3>`);  //insert popup here
  }

  // GeoJSON layer for the ward boundaries
  let wardLayer = L.geoJSON(wardData, {
    onEachFeature: onEachWardFeature
    // interaction as needed
  });

  // Call the function to create the map with the ward boundaries
  createWardMap(wardLayer);
}

// Function to create the map with ward boundaries
function createWardMap(wardLayer) {
  // Create base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create an object to hold base layers
  let baseMaps = {
    "Street Map": street
  };

  // Create an object to hold overlay layers
  let overlayMaps = {
    "Wards": wardLayer
  };

  // Create the map
  let myMap = L.map("map", {
    center: [43.65107, -79.347015], // Default center to Toronto
    zoom: 10, // Default zoom level
    layers: [street, wardLayer] // Default layers
  });

  // Add layer control
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  // Define data and conditions for coloring
  var populationConditions = {
      1000: '#800026',
      500: '#BD0026',
      200: '#E31A1C',
      100: '#FC4E2A',
      50: '#FD8D3C',
      20: '#FEB24C',
      10: '#FED976',
      0: '#FFEDA0'
  };

  var averageIncomeConditions = {
      // conditions for average income
      
  };

  var medianIncomeConditions = {
      // conditions for median income
  };

  var currentConditions = populationConditions; // Default conditions

  // Create legend
  function updateLegend() {
      var legend = document.getElementById('legend');
      legend.innerHTML = ''; // Clear existing legend

      for (var key in currentConditions) {
          var color = currentConditions[key];
          legend.innerHTML += '<i style="background:' + color + '"></i> ' +
                              key + (parseInt(key) === 0 ? ' or less' : '') + '<br>';
      }
  }

  updateLegend(); // Initial legend update

  // Function to update map based on dropdown selection
  function updateMap(selection) {
      switch (selection) {
          case 'population':
              currentConditions = populationConditions;
              break;
          case 'average_income':
              currentConditions = averageIncomeConditions;
              break;
          case 'median_income':
              currentConditions = medianIncomeConditions;
              break;
      }

      updateLegend(); // Update legend based on new conditions
  }

  // Add event listener for dropdown change
  var dropdown = document.getElementById('dropdown');
  dropdown.addEventListener('change', function() {
      updateMap(this.value);
  });
}

// Call the function to fetch GeoJSON data and create features
fetchWardGeoJSON();


//*need to create dropdown.