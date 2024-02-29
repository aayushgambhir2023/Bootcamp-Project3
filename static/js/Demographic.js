document.addEventListener('DOMContentLoaded', function () {
    // URL to fetch ward data
    let wardsUrl = "/api/v1.0/city_wards_geo";
    // URL to fetch demographic data
    let demographicUrl = "/api/v1.0/demographic_data_2022_budget";

    // Function to fetch ward data from the server
    function fetchWardsData() {
        fetch(wardsUrl)
            .then(response => response.json())
            .then(wardsData => {
                // render map when received ward data
                renderMap(wardsData);
            })
            .catch(error => console.error('Error fetching ward data:', error));
    }

    // Function to fetch demographic data from the server
    function fetchDemographicData() {
        fetch(demographicUrl)
            .then(response => response.json())
            .then(demographicData => {
                // Once demographic data is fetched, call function to render graphs
                renderDemographicData(demographicData);
            })
            .catch(error => console.error('Error fetching demographic data:', error));
    }

    // Function to render the choropleth map
    function renderMap(wardsData) {
        // Create a Leaflet map
        var map = L.map('map').setView([43.69, -79.347015], 10);

        // Add OpenStreetMap tiles to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        // Add GeoJSON layer with ward boundaries
        L.geoJSON(wardsData).addTo(map);
    }

    // Function to render demographic data
    function renderDemographicData(demographicData) {
        //add demographic data for colour changes.
    }

    // Fetch ward data and demographic data when the page loads
    fetchWardsData();
    fetchDemographicData();
});
