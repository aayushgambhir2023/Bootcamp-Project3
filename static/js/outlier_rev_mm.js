jsonUrl = 'http://127.0.0.1:5000/api/v1.0/revenue_data_mm';

    fetch(jsonUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        // Process the JSON data to fit the box plot structure
        const years = ['2019', '2020', '2021', '2022', '2023'];
        let categories = data.map(item => item["Category Name"]);
        let budget = data.map(item => item["Budgeted amount"]);
        trace={
          x: categories,
          y:budget,
          type:"bar"
        }
 

        Plotly.newPlot('bar', [trace], {
          title: 'Outlier Expenses by Category (2019-2023)'
        });
      })
      .catch(error => console.error('Error fetching or processing data:', error));
 
