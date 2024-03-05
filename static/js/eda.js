// URLs for the APIs where the JSON data for revenue and expenses are stored
const revenueApiUrl = 'https://api.example.com/revenue';
const expensesApiUrl = 'https://api.example.com/expenses';

// Function to fetch data from an API
async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Could not fetch data:', error);
  }
}

// Function to plot the data using Plotly.js
function plotData(revenueData, expensesData) {
  const years = revenueData.map(entry => entry.year);
  const revenueMeans = revenueData.map(entry => entry.mean);
  const revenueMedians = revenueData.map(entry => entry.median);
  const revenueStdDevs = revenueData.map(entry => entry.std_dev);
  const expenseMeans = expensesData.map(entry => entry.mean);
  const expenseMedians = expensesData.map(entry => entry.median);
  const expenseStdDevs = expensesData.map(entry => entry.std_dev);

  // Create traces for the revenue and expenses
  const revenueTrace = {
    x: years,
    y: revenueMeans,
    name: 'Revenue Mean',
    type: 'scatter',
    mode: 'lines+markers',
    line: { shape: 'spline', smoothing: 1.3 },
    marker: { size: 8 }
  };

  const expenseTrace = {
    x: years,
    y: expenseMeans,
    name: 'Expense Mean',
    type: 'scatter',
    mode: 'lines+markers',
    line: { shape: 'spline', smoothing: 1.3 },
    marker: { size: 8 }
  };

  const layout = {
    title: 'Yearly Revenue and Expense Statistics',
    xaxis: { title: 'Year' },
    yaxis: { title: 'Amount' },
    hovermode: 'closest'
  };

  // Plot the chart to a div tag with id "myDiv"
  Plotly.newPlot('myDiv', [revenueTrace, expenseTrace], layout);
}

// Call the APIs and plot the data
async function getAndPlotData() {
  const revenueData = await fetchData(revenueApiUrl);
  const expensesData = await fetchData(expensesApiUrl);
  if (revenueData && expensesData) {
    plotData(revenueData, expensesData);
  }
}

// Get and plot the data when the window loads
window.onload = getAndPlotData;
