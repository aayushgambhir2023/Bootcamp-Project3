// Function to fetch data and plot graph for Expense and Share
function fetchAndPlotData_ecat(category = 'exp_subcat', year = 'null') {
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
            const expenses = data.map(item => item['Sub Expense']);
            // const share = data.map(item => item.Share);

            plotChart('myChart', labels, expenses, `Expense in millions (${year})`, 'rgba(54, 162, 235, 0.8)', 'rgba(54, 162, 235, 1)');
          
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



// Updated event listeners for hover functionality
document.getElementById('expensesubOption').addEventListener('mouseover', function() {
    document.getElementById('yearDropdownsubexp').style.display = 'block';
});

document.getElementById('expensesubOption').addEventListener('mouseleave', function(event) {
    // Timeout to allow transition to submenu
    setTimeout(() => {
        if (!document.getElementById('yearDropdownsubexp').contains(event.relatedTarget)) {
            document.getElementById('yearDropdownsubexp').style.display = 'none';
        }
    }, 300); // Adjust delay as necessary
});

document.getElementById('yearDropdownsubexp').addEventListener('mouseleave', function() {
    this.style.display = 'none';
});

// Function to toggle display of year dropdown
function toggleYearDropdown(yearDropdownId) {
    const dropdown = document.getElementById(yearDropdownId);
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Attach event listener to hide year dropdown if clicked outside
document.addEventListener('click', function(event) {
    const yearDropdownExp = document.getElementById('yearDropdownsubexp');
    if (!event.target.closest('#expensesubOption') && !event.target.closest('#yearDropdownexp')) {
        yearDropdownExp.style.display = 'none';
    }
});

// Attach event listener using event delegation for the expense dropdown year items
document.addEventListener('click', function(event) {
    if (event.target.closest('#yearDropdownsubexp .dropdown-item')) {
        const selectedYear = event.target.textContent.trim();
        document.getElementById('yearDropdownsubexp').style.display = 'none';
        fetchAndPlotData_ecat('exp_subcat', selectedYear);
    }
});

// Initialize dropdown visibility on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('yearDropdownsubexp').style.display = 'none';
});

// Handle dropdown visibility on pageshow for back-forward navigation
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.getElementById('yearDropdownsubexp').style.display = 'none';
    }
});

