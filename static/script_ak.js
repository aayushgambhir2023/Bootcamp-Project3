// Function to fetch data and plot graph for Expense and Share
function fetchAndPlotData(category = 'exp', year = 'null') {
    if (!year) {
        console.error('Year not provided');
        return;
    }
    
    const url = `http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_${category.toLowerCase()}/${year}`;

    const pieChartColors = [
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
            const expenses = data.map(item => item.Expense);
            const share = data.map(item => item.Share);

            // Plot Expense chart
            plotChart('myChart', labels, expenses, 'Expense', 'rgba(54, 162, 235, 0.8)', 'rgba(54, 162, 235, 1)');

            // Plot Share chart
            plotChart1('myChart2', labels, share, 'Share in %', pieChartColors, 'rgba(255, 99, 132, 1)');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function plotChart(canvasId, labels, data, label, backgroundColor, borderColor) {
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
                    top: 0,
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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Event listeners (unchanged)
document.getElementById('expenseOption').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('yearDropdown').style.display = 'block';
});

document.getElementById('revenueOption').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('yearDropdown').style.display = 'none';
});

document.querySelectorAll('#yearDropdown .dropdown-item').forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedYear = this.textContent.trim();
        document.getElementById('yearDropdown').style.display = 'none';
        fetchAndPlotData('exp', selectedYear);
    });
});
