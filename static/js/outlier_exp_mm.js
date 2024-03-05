document.addEventListener('DOMContentLoaded', function() {
  const submenu13 = document.getElementById('submenu13'); // Target submenu13

  submenu13.addEventListener('click', function(event) {
      event.preventDefault();
      // Hide the side menu and other content areas
      document.querySelector('.side-menu').style.display = 'none';
      document.getElementById('homeContent').style.display = 'none';
      document.getElementById('APIcontent').style.display = 'none';
      document.getElementById('aboutContent').style.display = 'none';
      
      // Show and prepare the graphics output area
      const graphicArea = document.getElementById('graphics-output');
      graphicArea.style.display = 'block';
      graphicArea.innerHTML = ''; // Clear previous content

      // Call the function to show the Outlier Expenses graph
      showOutlierExpensesGraph();
  });
});

function showOutlierExpensesGraph() {
  const jsonUrl = 'http://127.0.0.1:5000/api/v1.0/expense_data_mm';

  fetch(jsonUrl)
      .then(response => response.json())
      .then(data => {
          // Assuming the JSON structure fits the required data mapping
          let categories = data.map(item => item["Category Name"]);
          let budget = data.map(item => item["Budgeted amount"]);
          let trace = {
              x: categories,
              y: budget,
              type: "bar"
          };

          Plotly.newPlot('graphics-output', [trace], {
              title: 'Outlier Expenses by Category (2019-2023)'
          });
      })
      .catch(error => console.error('Error fetching or processing data:', error));
}
