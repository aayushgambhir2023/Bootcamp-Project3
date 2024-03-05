// Function to fetch data and plot graph for Revenue and Share
function fetchAndPlotDatarev_rcat(category = 'rev_subcat', year = 'null') {
    if (!year) {
        console.error('Year not provided');
        return;
    }
    
    const url = `http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_${category.toLowerCase()}/${year}`;



    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const labels = data.map(item => item['Sub-Category Name']);
            const revenues = data.map(item => item['Sub Revenue']);
            const share = data.map(item => item.Share);

            // Plot Expense chart
            plotChartrev('myChart', labels, revenues, `Revenue in millions (${year})`, 'rgba(54, 162, 235, 0.8)', 'rgba(54, 162, 235, 1)');

        
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function plotChartrev(canvasId, labels, data, label, backgroundColor, borderColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Clear previous chart if exists
    if (window[canvasId] instanceof Chart) {
        window[canvasId].destroy();
    }

    // Create and render chart
    window[canvasId] = new Chart(ctx, {
        type: 'bar', // Change chart type as needed
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {

            maintainAspectRatio: true,
            aspectRatio: 1,// Adjust this value to control the drawing area sizw

            layout: {
                padding: {
                    // Adjust padding to effectively reduce the drawing area
                    left: 0,
                    right: 0,
                    top: 1,
                    bottom: 0
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function plotChart1rev(canvasId, labels, data, label, backgroundColor, borderColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Clear previous chart if exists
    if (window[canvasId] instanceof Chart) {
        window[canvasId].destroy();
    }

    // Create and render chart
    window[canvasId] = new Chart(ctx, {
        type: 'pie', // Change chart type as needed
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: true,
            aspectRatio: 0.8,
            layout: {
                padding: {
                    left: 0,
                    right: 2,
                    top: 4,
                    bottom: 0
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Updated event listeners for hover functionality
document.getElementById('revenuesubOption').addEventListener('mouseover', function() {
    document.getElementById('yearDropdownsubrev').style.display = 'block';
});

document.getElementById('revenuesubOption').addEventListener('mouseleave', function(event) {
    // Timeout to allow transition to submenu
    setTimeout(() => {
        if (!document.getElementById('yearDropdownsubrev').contains(event.relatedTarget)) {
            document.getElementById('yearDropdownsubrev').style.display = 'none';
        }
    }, 300); // Adjust delay as necessary
});

document.getElementById('yearDropdownsubrev').addEventListener('mouseleave', function() {
    this.style.display = 'none';
});

// Function to toggle display of year dropdown
function toggleYearDropdown(yearDropdownId) {
    const dropdown = document.getElementById(yearDropdownId);
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Attach event listener to hide year dropdown if clicked outside
document.addEventListener('click', function(event) {
    const yearDropdownExp = document.getElementById('yearDropdownsubrev');
    if (!event.target.closest('#revenuesubOption') && !event.target.closest('#yearDropdownsubrev')) {
        revenuesubOption.style.display = 'none';
    }
});

// Attach event listener using event delegation for the expense dropdown year items
document.addEventListener('click', function(event) {
    if (event.target.closest('#yearDropdownsubrev .dropdown-item')) {
        const selectedYear = event.target.textContent.trim();
        document.getElementById('yearDropdownsubrev').style.display = 'none';
        fetchAndPlotDatarev_rcat('rev_subcat', selectedYear);
    }
});

// Initialize dropdown visibility on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('yearDropdownsubrev').style.display = 'none';
});

// Handle dropdown visibility on pageshow for back-forward navigation
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.getElementById('yearDropdownsubrev').style.display = 'none';
    }
});