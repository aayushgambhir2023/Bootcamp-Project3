// Function to fetch data and plot graph for Expense and Share
function fetchAndPlotData_ecat(category = 'exp_subcat', year = 'null') {
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
            const expenses = data.map(item => item['Sub Expense']);
            const share = data.map(item => item.Share);

            plotChart('myChart', labels, expenses, `Expense in millions (${year})`, 'rgba(54, 162, 235, 0.8)', 'rgba(54, 162, 235, 1)');
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
                borderWidth: 4
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


document.getElementById('expensesubOption').addEventListener('mouseover', function() {
    document.getElementById('yearDropdownsubexp').style.display = 'block';
});

document.getElementById('expensesubOption').addEventListener('mouseleave', function(event) {
    // Timeout to allow transition to submenu
    setTimeout(() => {
        if (!document.getElementById('yearDropdownsubexp').contains(event.relatedTarget)) {
            document.getElementById('yearDropdownsubexp').style.display = 'none';
        }
    }, 300);
});

document.getElementById('yearDropdownsubexp').addEventListener('mouseleave', function() {
    this.style.display = 'none';
});

// Adjusted to correct reference
document.addEventListener('click', function(event) {
    const yearDropdownSubRev = document.getElementById('yearDropdownsubexp');
    if (!event.target.closest('#yearDropdownsubexp') && !event.target.closest('#yearDropdownsubexp')) {
        yearDropdownSubRev.style.display = 'none';
    }
});

document.addEventListener('click', function(event) {
    if (event.target.closest('#yearDropdownsubexp .dropdown-item')) {
        const selectedYear = event.target.textContent.trim();
        document.getElementById('yearDropdownsubexp').style.display = 'none';
        fetchAndPlotData_ecat('exp_subcat', selectedYear);
    }
});

// Hide all sub-category content when clicking on other menus
document.querySelectorAll('.nav-link:not(#expensesubOption), .navbar-brand').forEach(item => {
    item.addEventListener('click', () => {
        const subMenus = document.querySelectorAll('.dropdown-menu.submenu');
        subMenus.forEach(menu => menu.style.display = 'none');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('yearDropdownsubexp').style.display = 'none';
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.getElementById('yearDropdownsubexp').style.display = 'none';
    }
});