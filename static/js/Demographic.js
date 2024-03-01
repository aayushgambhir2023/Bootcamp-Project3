//URL to fetch ward data
let wardsUrl = "/api/v1.0/city_wards_geo";
//URL to fetch demographic data
let demographicUrl = "/api/v1.0/demographic_data_2022_budget";

//this is because the selected parameter is different from the url.
const parameterToGraphType = {
    "Population density per square kilometre": "population",
    "Median total income in 2020 among recipients ($)": "median_income",
    "Average total income in 2020 among recipients ($)": "average_income"
};


//function to fetch ward data and demographic data. ward geo data was previously geojson converted into json to be put into mongodb collection.need to convert it back into geojson
d3.json(wardsUrl).then(function(wardsData){
    fetchData(wardsData)
}
// ****************** this doesnt work, need to somehow put in value for wardsData, degraphicData, and selected data in selected parameter
let demographicData = d3.json(demographicUrl);
function fetchData(selectedParameter) {
    //for map:
    // d3.json(wardsUrl).then(function(data){
    //     let wardsData = d3.json(data);
    //     let demographicData = d3.json(demographicUrl);

        renderMap(wardsData, demographicData, selectedParameter);
    // })
};

//function to render the choropleth map
function renderMap(wardsData, demographicData, selectedParameter) {
    //create a Leaflet map
    var map = L.map('map').setView([43.69, -79.347015], 10);

    //add OpenStreetMap tiles to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }).addTo(map);

    //min and max values for the selected option parameter
    let parameterValues = Object.values(demographicData).map(entry=>entry[selectedParameter])
    let minParameter = Math.min(...parameterValues);
    let maxParameter = Math.max(...parameterValues);

    console.log("Min Parameter:", minParameter);
    console.log("Max Parameter:", maxParameter);


    //map scaled based on data
    let colorScale = d3.scaleLinear()
        .domain([minParameter, maxParameter])
        .range(["#ffffcc", "#800026"]);

    //add GeoJSON layer with ward boundaries and change color
    L.geoJSON(wardsData, {
        style: function (feature) {
            let wardName = feature.properties.AREA_NAME;
            // Find the corresponding demographic data for the ward
            let wardData = demographicData.find(entry => entry.WARD = wardName);
            console.log("Ward Data for " + wardName + ":", wardData);
            
            // Check if wardData is undefined
            if (wardData) {
                // Get the selected parameter value for the ward
                let parameterValue = wardData[selectedParameter];
                // Map the parameter value to a color using scale
                return { fillColor: colorScale(parameterValue), color: "#000", weight: 1, fillOpacity: 0.8 };
            } else {
                // Handle the case where wardData is undefined (no corresponding entry found)
                console.log("No demographic data found for ward:", wardName);
                // Return a default style or handle as appropriate
                return { fillColor: 'gray', color: "#000", weight: 1, fillOpacity: 0.8 };
            }
        }
    }).addTo(map);
}

//dropdown options:
let dropdownMenu = d3.select("#selDataset");

let options = [
    "Population density per square kilometre",
    "Average total income in 2020 among recipients ($)",
    "Median total income in 2020 among recipients ($)"
];

//add options to the dropdown menu
options.forEach(function(option){
    dropdownMenu.append("option").text(option).property("value", option);
});

//dropdown option change
function optionChanged(selectedParameter) {
    fetchData(selectedParameter);
}


//initial fetch defaulted to population
fetchData(options[0])

