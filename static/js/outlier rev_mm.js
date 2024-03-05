import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';

const RevenueBoxPlot = () => {
  useEffect(() => {
    const jsonUrl = 'http://127.0.0.1:5000/api/v1.0/revenue_data_mm';

    fetch(jsonUrl)
      .then(response => response.json())
      .then(data => {
        // Process the JSON data to fit the box plot structure
        const years = ['2019', '2020', '2021', '2022', '2023'];
        const categories = [...new Set(data.map(item => item.category))];
        const plotData = categories.map(category => {
          return years.map(year => {
            return {
              y: data.filter(item => item.year === year && item.category === category).map(item => item.revenue),
              type: 'box',
              name: `${category} ${year}`,
              boxpoints: 'outliers', // Show only outliers
            };
          });
        }).flat();

        Plotly.newPlot('boxplot', plotData, {
          title: 'Outlier Revenues by Category (2019-2023)'
        });
      })
      .catch(error => console.error('Error fetching or processing data:', error));
  }, []);

  return <div id="boxplot"></div>;
};

export default RevenueBoxPlot;
