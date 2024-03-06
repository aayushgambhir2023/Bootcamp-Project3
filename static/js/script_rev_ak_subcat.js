// Function to fetch data and plot graph for Revenue and Share
function fetchAndPlotDatarev_rcat(category = 'rev_subcat', year = 'null') {
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
            const labels = data.map(item => item['Sub-Category Name']);
            const revenues = data.map(item => item['Sub Revenue']);
            const share = data.map(item => item.Share);

            // Plot Expense chart
            plotChart('myChart', labels, revenues, `Revenue in millions (${year})`, 'rgba(54, 162, 235, 0.8)', 'rgba(54, 162, 235, 1)');
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

document.getElementById('revenuesubOption').addEventListener('mouseover', function() {
    document.getElementById('yearDropdownsubrev').style.display = 'block';
});

document.getElementById('revenuesubOption').addEventListener('mouseleave', function(event) {
    // Timeout to allow transition to submenu
    setTimeout(() => {
        if (!document.getElementById('yearDropdownsubrev').contains(event.relatedTarget)) {
            document.getElementById('yearDropdownsubrev').style.display = 'none';
        }
    }, 300);
});

document.getElementById('yearDropdownsubrev').addEventListener('mouseleave', function() {
    this.style.display = 'none';
});

// Adjusted to correct reference
document.addEventListener('click', function(event) {
    const yearDropdownSubRev = document.getElementById('yearDropdownsubrev');
    if (!event.target.closest('#revenuesubOption') && !event.target.closest('#yearDropdownsubrev')) {
        yearDropdownSubRev.style.display = 'none';
    }
});

document.addEventListener('click', function(event) {
    if (event.target.closest('#yearDropdownsubrev .dropdown-item')) {
        const selectedYear = event.target.textContent.trim();
        document.getElementById('yearDropdownsubrev').style.display = 'none';
        fetchAndPlotDatarev_rcat('rev_subcat', selectedYear);
    }
});

// Hide all sub-category content when clicking on other menus
document.querySelectorAll('.nav-link:not(#revenuesubOption), .navbar-brand').forEach(item => {
    item.addEventListener('click', () => {
        const subMenus = document.querySelectorAll('.dropdown-menu.submenu');
        subMenus.forEach(menu => menu.style.display = 'none');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('yearDropdownsubrev').style.display = 'none';
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.getElementById('yearDropdownsubrev').style.display = 'none';
    }
});
