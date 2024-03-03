// notes: tried to have 1 layer that updates instead of making 3 layers, but the errors took up too much time and still couldnt find a solution. made 3 layers instaed to switch between.
// maybe add ward# inside choropleth map and popup?

//url for ward and demographic data
const wardsUrl = "/api/v1.0/city_wards_geo";
const demographicUrl = "/api/v1.0/demographic_data_2022_budget";

//variables to hold fetched data
let wardsData;
let demographicData;

//options for dropdown and data.
let options = [
    "Population density per square kilometre",
    "Median total income in 2020 among recipients ($)",
    "Average total income in 2020 among recipients ($)"
];

//initial map and layer
let map = L.map("map").setView([43.69, -79.347015], 10);
let populationLayer, medianIncomeLayer, averageIncomeLayer;

//fetch ward and demographic data
d3.json(wardsUrl).then(function(wardgeoData) {
    wardsData = wardgeoData;
    
    return d3.json(demographicUrl);
}).then(function(demoData) {
    demographicData = demoData;
    //initialize map
    initMap(options[0]);
    //add dropdown options
    populateDropdown();
    //initial update for graph text
    updateAdditionalText(options[0]);

    // console.log("Wards Data:", wardsData);
    // console.log("Demographic Data:", demographicData);
});

//populate dropdown with options
function populateDropdown() {
    let selectDropdown = document.getElementById("selDataset");

    options.forEach(option => {
        let optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        selectDropdown.appendChild(optionElement);
    });
}

//initialize map and layers
function initMap(selectedValue) {
    // Add OpenStreetMap tiles to the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }).addTo(map);

    //add layers
    populationLayer = L.layerGroup().addTo(map);
    medianIncomeLayer = L.layerGroup().addTo(map);
    averageIncomeLayer = L.layerGroup().addTo(map);

    renderLayers(selectedValue);
}

//dropdown option update
function optionChanged(selectedValue) {
    renderLayers(selectedValue);
    updateAdditionalText(selectedValue)
}

//render all layers based on the dropdown option
function renderLayers(selectedValue) {
    populationLayer.clearLayers();
    medianIncomeLayer.clearLayers();
    averageIncomeLayer.clearLayers();

    switch (selectedValue) {
        case options[0]:
            renderPopulationMap(selectedValue);
            break;
        case options[1]:
            renderMedianIncomeMap(selectedValue);
            break;
        case options[2]:
            renderAverageIncomeMap(selectedValue);
            break;
        default:
            console.error("Invalid option");
    }
}

//population graph
function renderPopulationMap(selectedValue) {

    d3.json(demographicUrl).then(function(demographicData) {
        //color scale
        var colorScale = d3.scaleLinear()
            .domain([d3.min(demographicData, d => d[selectedValue]), d3.max(demographicData, d => d[selectedValue])])
            .range(["#ffffcc", "#800026"]);

        updateLegend(selectedValue);

        //add GeoJSON layer with ward boundaries and change color
        L.geoJSON(wardsData, {
            style: function (feature) {
                let wardName = feature.properties.AREA_NAME;
                //find the corresponding demographic data for the ward by searching for the same ward name
                let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
                //get population density for the ward
                let populationDensity = wardDemographicData ? wardDemographicData[selectedValue] : 0;
                return {
                    color: "black",
                    fillColor: colorScale(populationDensity),
                    weight: 1.5,
                    fillOpacity: 0.7
                };
            }
        }).addTo(populationLayer)
        .eachLayer(function(layer) {
            let wardName = layer.feature.properties.AREA_NAME;
            let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
            let populationDensity = wardDemographicData ? wardDemographicData["Population density per square kilometre"] : 0;
            
            //click to popup text
            let popupContent = `<b>Ward Name:</b> ${wardName}<br><b>Population Density:</b> ${populationDensity} per sq. km`;
            
            //Bind popup to each layer
            layer.bindPopup(popupContent);
        });
    });
    //make population graph
    fetchGraphData(selectedValue);
}

//median income graph, nearly the same as population
function renderMedianIncomeMap(selectedValue) {
    d3.json(demographicUrl).then(function(demographicData) {

        var colorScale = d3.scaleLinear()
            .domain([d3.min(demographicData, d => d[selectedValue]), d3.max(demographicData, d => d[selectedValue])])
            .range(["#ffffcc", "#800026"]);

        updateLegend(selectedValue);

 
        L.geoJSON(wardsData, {
            style: function (feature) {
                let wardName = feature.properties.AREA_NAME;
                
                let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
                
                let medianIncome = wardDemographicData ? wardDemographicData[selectedValue] : 0;
                return {
                    color: "black",
                    fillColor: colorScale(medianIncome),
                    weight: 1.5,
                    fillOpacity: 0.7
                };
            }
        }).addTo(medianIncomeLayer)
        .eachLayer(function(layer) {
            let wardName = layer.feature.properties.AREA_NAME;
            let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
            let medianIncome = wardDemographicData ? wardDemographicData["Median total income in 2020 among recipients ($)"] : 0;
            
            
            let popupContent = `<b>Ward Name:</b> ${wardName}<br><b>Median Total Income:</b> ${medianIncome}`;
            
           
            layer.bindPopup(popupContent);
        });
    });
    fetchGraphData(selectedValue);
}

//average income graph
function renderAverageIncomeMap(selectedValue) {

    d3.json(demographicUrl).then(function(demographicData) {

        var colorScale = d3.scaleLinear()
            .domain([d3.min(demographicData, d => d[selectedValue]), d3.max(demographicData, d => d[selectedValue])])
            .range(["#ffffcc", "#800026"]);
           
        updateLegend(selectedValue);

        L.geoJSON(wardsData, {
            style: function (feature) {
                let wardName = feature.properties.AREA_NAME;
 
                let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
 
                let averageIncome = wardDemographicData ? wardDemographicData[selectedValue] : 0;
                return {
                    color: "black",
                    fillColor: colorScale(averageIncome),
                    weight: 1.5,
                    fillOpacity: 0.7
                };
            }
        }).addTo(averageIncomeLayer)
        .eachLayer(function(layer) {
            let wardName = layer.feature.properties.AREA_NAME;
            let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
            let averageIncome = wardDemographicData ? wardDemographicData["Average total income in 2020 among recipients ($)"] : 0;
            

            let popupContent = `<b>Ward Name:</b> ${wardName}<br><b>Average Total Income:</b> ${averageIncome}`;
            

            layer.bindPopup(popupContent);
        });
    });
    fetchGraphData(selectedValue);
}

//add legend and update
function updateLegend(selectedValue) {
    //clear existing legend
    if (map.legend) {
        map.legend.remove();
    }

    map.legend = L.control({ position: "bottomright" });

    map.legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let legendTitle;
        let colorLow, colorHigh;

        //legend title and colors based on dropdown option
        switch (selectedValue) {
            case options[0]:
                legendTitle = "Population Density";
                colorLow = "#ffffcc";
                colorHigh = "#800026";
                break;
            case options[1]:
                legendTitle = "Median Total Income";
                colorLow = "#ffffcc";
                colorHigh = "#800026";
                break;
            case options[2]:
                legendTitle = "Average Total Income";
                colorLow = "#ffffcc";
                colorHigh = "#800026";
                break;
            default:
                console.error("Invalid option");
                break;
        }

        //add legend title
        div.innerHTML += "<h4>" + legendTitle + "</h4>";

        //add legend colors and labels
        div.innerHTML +=
            '<div class="legend-item"><i style="background:' + colorLow + '"></i> Lowest</div>';
        div.innerHTML +=
            '<div class="legend-item"><i style="background:' + colorHigh + '"></i> Highest</div>';

        return div;
    };

    map.legend.addTo(map);
}
//==============================
//
//graph portion

//this is because the url is different from option name.
var graphName = {
    "Population density per square kilometre": "population_density",
    "Median total income in 2020 among recipients ($)": "median_income",
    "Average total income in 2020 among recipients ($)": "average_income"
};

const graphUrl = "/api/v1.0/demographic_graph_data"

//function to make graph
function fetchGraphData(selectedValue) {
    fetch(`${graphUrl}?graph_type=${graphName[selectedValue]}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            // console.log(selectedValue)
            let xValues = data.x_values;
            let yValues = data.y_values;
            let regressValues = data.regress_values;
            let rValue = data.r_value;

            //trace for scatter plot
            let scatterTrace = {
                x: xValues,
                y: yValues,
                mode: "markers",
                marker: {color: "red", opacity: 0.7},
                name: "Population Density of Each Ward"
            };

            //trace for regression line
            let regressionTrace = {
                x: xValues,
                y: regressValues,
                mode: "lines",
                line: {color: "blue"},
                name: "Population Density Regression Line"
            };

            //graph layout
            let layout = {
                title: "Relationship between Population Density and Budget Allocation",
                xaxis: {title: "Population Density per Square Kilometer"},
                yaxis: {title: "Budget Allocation in 2022 ($)"},
                showlegend: true,
                legend: {x: 1, xanchor: "right", y: 1},
                annotations: [{
                    x: 0.0,
                    y: -0.1,
                    xref: "paper",
                    yref: "paper",
                    text: `The Population Density r-value is: ${rValue}`,
                    showarrow: false,
                    font: {size: 12},
                }]
            };

            //plot graph
            Plotly.newPlot("graph", [scatterTrace, regressionTrace], layout);
        })
}


//Additional text for graph explanation:

// Function to update additional text based on the selected option
function updateAdditionalText(selectedValue) {
    let additionalText = document.getElementById("additionalText");

    // Clear previous text
    additionalText.innerHTML = "";
    
    if (selectedValue === options[0]) {
        additionalText.innerHTML = "This is an analysis of how the population density per square kilometers of wards in Toronto impacts how much budget Toronto allocates to to the wards.<br> The correlation coefficient suggests a positive correlation, so as population density increases, the budget allocation tends to increase as well, but the relationship is weak to moderate.";
    } else {
        additionalText.innerHTML = "This graph is made to understand how income levels influence budget allocation. <br>We used the income in 2020 because this would be the data they receive in 2021 to determine the 2022 budget if there was an impact, and used both median income and average income. <br>Both regression suggests a positive relationship. <br>However, when looking at the correlation coefficient, both are relatively weak, so we can’t claim that income levels play a significant part in deciding budget choices. <br>There could be many other factors that could influence the budget.";
    }
}

