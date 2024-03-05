// Function to fetch data and plot graph for Expense and Share
function fetchAndPlotData(category = 'exp', year = 'null') {
    if (!year) {
        console.error('Year not provided');
        return;
    }
    
    const url = `http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_${category.toLowerCase()}/${year}`;

    const pieChartColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(92, 119, 0 , 0.6)',
        'rgba(92 , 119 , 250 , 0.6)'
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
            const expenses = data.map(item => item.Expense);
            const share = data.map(item => item.Share);

            plotChart('myChart', labels, expenses, 'Expense', 'rgba(54, 162, 235, 0.8)', 'rgba(54, 162, 235, 1)');
            plotChart1('myChart2', labels, share, 'Share in %', pieChartColors, 'rgba(255, 99, 132, 1)');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function plotChart(canvasId, labels, data, label, backgroundColor, borderColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (window[canvasId] instanceof Chart) {
        window[canvasId].destroy();
    }
    window[canvasId] = new Chart(ctx, {
        type: 'bar',
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
            aspectRatio: 1,
            layout: {
                padding: {
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

function plotChart1(canvasId, labels, data, label, backgroundColor, borderColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (window[canvasId] instanceof Chart) {
        window[canvasId].destroy();
    }
    window[canvasId] = new Chart(ctx, {
        type: 'pie',
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
document.getElementById('expenseOption').addEventListener('mouseover', function() {
    document.getElementById('yearDropdownexp').style.display = 'block';
});

document.getElementById('expenseOption').addEventListener('mouseleave', function(event) {
    // Timeout to allow transition to submenu
    setTimeout(() => {
        if (!document.getElementById('yearDropdownexp').contains(event.relatedTarget)) {
            document.getElementById('yearDropdownexp').style.display = 'none';
        }
    }, 300); // Adjust delay as necessary
});

document.getElementById('yearDropdownexp').addEventListener('mouseleave', function() {
    this.style.display = 'none';
});

// Function to toggle display of year dropdown
function toggleYearDropdown(yearDropdownId) {
    const dropdown = document.getElementById(yearDropdownId);
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Attach event listener to hide year dropdown if clicked outside
document.addEventListener('click', function(event) {
    const yearDropdownExp = document.getElementById('yearDropdownexp');
    if (!event.target.closest('#expenseOption') && !event.target.closest('#yearDropdownexp')) {
        yearDropdownExp.style.display = 'none';
    }
});

// Attach event listener using event delegation for the expense dropdown year items
document.addEventListener('click', function(event) {
    if (event.target.closest('#yearDropdownexp .dropdown-item')) {
        const selectedYear = event.target.textContent.trim();
        document.getElementById('yearDropdownexp').style.display = 'none';
        fetchAndPlotData('exp', selectedYear);
    }
});

// Initialize dropdown visibility on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('yearDropdownexp').style.display = 'none';
});

// Handle dropdown visibility on pageshow for back-forward navigation
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.getElementById('yearDropdownexp').style.display = 'none';
    }
});