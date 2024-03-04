// Function to fetch data and plot graph for Revenue and Share
function fetchAndPlotDatarev(category = 'rev', year = 'null') {
    if (!year) {
        console.error('Year not provided');
        return;
    }
    
    const url = `http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_${category.toLowerCase()}/${year}`;

    const pieChartColorsrev = [
        'rgba(255, 99, 132, 0.6)', // Red
        'rgba(54, 162, 235, 0.6)', // Blue
        'rgba(255, 206, 86, 0.6)', // Yellow
        'rgba(75, 192, 192, 0.6)', // Green
        'rgba(153, 102, 255, 0.6)', // Purple
        'rgba(255, 159, 64, 0.6)', // Orange
        'rgba(92, 119, 0 , 0.6)', // Dark green
        'rgba(92 , 119 , 250 , 0.6)' // Dark blue
        // Add more colors as needed depending on the number of slices
    ];

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const labels = data.map(item => item['Category Name']);
            const revenues = data.map(item => item.Revenue);
            const share = data.map(item => item.Share);

            // Plot Expense chart
            plotChartrev('myChart', labels, revenues, 'Revenue', 'rgba(54, 162, 235, 0.8)', 'rgba(54, 162, 235, 1)');

            // Plot Share chart
            plotChart1rev('myChart2', labels, share, 'Share in %', pieChartColorsrev, 'rgba(255, 99, 132, 1)');
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
document.getElementById('revenueOption').addEventListener('mouseover', function() {
    document.getElementById('yearDropdownrev').style.display = 'block';
});

document.getElementById('revenueOption').addEventListener('mouseleave', function(event) {
    // Timeout to allow transition to submenu
    setTimeout(() => {
        if (!document.getElementById('yearDropdownrev').contains(event.relatedTarget)) {
            document.getElementById('yearDropdownrev').style.display = 'none';
        }
    }, 300); // Adjust delay as necessary
});

document.getElementById('yearDropdownrev').addEventListener('mouseleave', function() {
    this.style.display = 'none';
});

// Function to toggle display of year dropdown
function toggleYearDropdown(yearDropdownId) {
    const dropdown = document.getElementById(yearDropdownId);
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Attach event listener to hide year dropdown if clicked outside
document.addEventListener('click', function(event) {
    const yearDropdownExp = document.getElementById('yearDropdownrev');
    if (!event.target.closest('#revenueOption') && !event.target.closest('#yearDropdownrev')) {
        yearDropdownExp.style.display = 'none';
    }
});

// Attach event listener using event delegation for the expense dropdown year items
document.addEventListener('click', function(event) {
    if (event.target.closest('#yearDropdownrev .dropdown-item')) {
        const selectedYear = event.target.textContent.trim();
        document.getElementById('yearDropdownrev').style.display = 'none';
        fetchAndPlotDatarev('rev', selectedYear);
    }
});

// Initialize dropdown visibility on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('yearDropdownrev').style.display = 'none';
});

// Handle dropdown visibility on pageshow for back-forward navigation
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.getElementById('yearDropdownrev').style.display = 'none';
    }
});