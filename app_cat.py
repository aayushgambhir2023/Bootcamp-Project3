
from flask import Flask, jsonify, render_template, request ,render_template_string
from pymongo import MongoClient
from bson import ObjectId, json_util
from sklearn.linear_model import LinearRegression
import numpy as np
import requests
import json

from scipy.stats import linregress

app = Flask(__name__, static_url_path='/static')

client = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db = client['city_toronto']

collection1_ak = db['expense']
collection2_ak = db['revenue']
collection3_ak = db['summary_data_ak']
collection4_ak = db['expense_sub_cat']
collection5_ak = db['revenue_sub_cat']

##-----------------------------------------------------------------------------------------------------------------------------##
@app.route('/home')
def home():
    # This will render a simple home page
    # You can replace this with more complex HTML or a call to `render_template` if you're using templates
     return '''
    <html>
        <head>
            <title>City of Toronto Budget Data Dashboard</title>
        </head>
        <body>
            <h1>Welcome to City of Toronto Budget Data</h1>
            <p>Explore category-wise expenditures and revenues within the City of Toronto's Operating Budget.</p>
            <p>Utilize our dashboard to delve into the specifics of how the budget is allocated and utilized across various categories and sub-categories.</p>
            <h2>Dashboard Overview: City of Toronto Operating Budget Analysis</h2>
            <h3>Introduction:</h3>
            <p>This dashboard is designed to provide insightful visualizations focusing on the "Category Wise Expenditure and Revenues" within the City of Toronto's Operating Budget. It aims to categorize expenditures into relevant categories, such as personnel, supplies, and utilities, to facilitate a comprehensive analysis of the city's budget allocation.</p>
            <h3>Main Features:</h3>
            <ul>
                <li><strong>Categorization of Expenditures:</strong> Expenditures are meticulously organized into relevant categories, enabling users to understand how the city allocates its financial resources across various needs.</li>
                <li><strong>Visual Exploration:</strong> Users can explore the distribution of expenditures across different categories utilizing intuitive visual representations like bar charts or pie charts. This visual approach aids in quickly identifying significant spending areas and trends.</li>
            </ul>
            <h3>Categories Defined:</h3>
            <p><strong>Categories:</strong> Serve as the major divisions where the budget is allocated. For both expenses and revenues, there are eight categories, encompassing the broad areas where funds are distributed.</p>
            <h3>Sub-Categories:</h3>
            <p><strong>Drill-Down Capability:</strong> For a more detailed analysis, users can drill down into each category to explore sub-categories. This feature is particularly useful for examining precise departments or areas where expenses and revenue figures are notable.</p>
            <p><a href="http://127.0.0.1:5000/">Back to Home</a><br></p>

    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp">All expense API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp/2019">Expense 2019 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp/2020">Expense 2020 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp/2021">Expense 2021 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp/2022">Expense 2022 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp/2023">Expense 2023 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/expense_data?category=Salaries%20And%20Benefits">Salary and Benefits 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/expense_data?category=Other%20Expenditures">Other Expenditure 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/expense_data?category=Service%20And%20Rent">Services and Rent 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/expense_data?category=Contribution%20To%20Reserves/Reserve%20Funds">Contribution To Reserves/Reserve Funds 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/expense_data?category=Materials%20&%20Supplies">Materials & Supplies 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/expense_data?category=Contribution%20To%20Capital">Contribution To Capital 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/expense_data?category=Inter-Divisional%20Charges">Inter-Divisional Charges 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/expense_data?category=Equipment">Equipment 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_rev">All revenue API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_rev/2019">Revenue 2019 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_rev/2020">Revenue 2020 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_rev/2021">Revenue 2021 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_rev/2022">Revenue 2022 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_rev/2023">Revenue 2023 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/revenue_data?category=Sundry%20and%20Other%20Revenues">Sundry and Other Revenues 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/revenue_data?category=Provincial%20Subsidies">Provincial Subsidies 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/revenue_data?category=User%20Fees%20&%20Donations">User Fees & Donations 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/revenue_data?category=Contribution%20From%20Reserves/Reserve%20Funds">Contribution From Reserves/Reserve Funds 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/revenue_data?category=Federal%20Subsidies">Federal Subsidies 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/revenue_data?category=Transfers%20From%20Capital">Transfers From Capital 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/revenue_data?category=Inter-Divisional%20Recoveries">Inter-Divisional Recoveries 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/revenue_data?category=Licences%20&%20Permits%20Revenue">Licences & Permits Revenue 2019-23 API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/linear_regression_exp">Expense: Linear Regression Expense data</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/linear_regression_rev">Revenue: Linear Regression Revenue data</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp_subcat">All Sub- Category Expense API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp_subcat/2019">Sub- Category Expense API Year 2019</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp_subcat/2020">Sub- Category Expense API Year 2020</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp_subcat/2021">Sub- Category Expense API Year 2021</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp_subcat/2022">Sub- Category Expense API Year 2022</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp_subcat/2023">Sub- Category Expense API Year 2023</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_rev_subcat">All Sub- Category Revenue API</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp_subcat/2019">Sub- Category Revenue API Year 2019</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp_subcat/2020">Sub- Category Revenue API Year 2020</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp_subcat/2021">Sub- Category Revenue API Year 2021</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp_subcat/2022">Sub- Category Revenue API Year 2022</a><br>
    <a href="http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp_subcat/2023">Sub- Category Revenue API Year 2023</a><br>


    <h3><strong>References:</strong></h3>
            <p><strong>1. W3 Schools:</strong> Some of the codes and approaches are inspired by W3 tutorials.</p>
            <p><strong>2. YouTube Channels - </strong> A significant resource for learning and inspiration.</p>
            <p><strong>3. ChatGPT:</strong> Reformatting and idea inspiration, particularly for Bootstraps.</p>
            <p><strong>4. Stack Overflow:</strong> A crucial resource for troubleshooting and enhancing code functionality.</p>

    '''

##-----------------------------------------------------------------------------------------------------------------------------##

## API to display all expense data
@app.route('/api/v1.0/merged_df_ak_final_exp', methods=['GET'])
def display_data_exp_ak():
    # Fetch data from MongoDB
    data = list(collection1_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)


##-----------------------------------------------------------------------------------------------------------------------------##

## API to display all expense data year wise, running a loop to make dynamic
@app.route('/api/v1.0/merged_df_ak_final_exp/<int:year>', methods=['GET'])
def display_data_by_year_exp_ak(year):
    # Fetch data from MongoDB
    data = list(collection1_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    # Filter data by year
    year_data = []
    total_expense_year = 0  # Initialize total expense for the year
    
    for item in data:
        for key, value in item.items():
            if key.startswith("Expense") and key.endswith(f"{year}(millions)"):
                total_expense_year += value  # Add expense to total for the year

    # Calculate percentage share for each category
    for item in data:
        for key, value in item.items():
            if key.startswith("Expense") and key.endswith(f"{year}(millions)"):
                category_name = item["Category Name"]
                expense = value
                percentage_share = (expense / total_expense_year) * 100 if total_expense_year != 0 else 0
                year_data.append({"Category Name": category_name, "Expense": expense, "Share": percentage_share})
    
    return jsonify(year_data)    


##-----------------------------------------------------------------------------------------------------------------------------##
## API to display all expense data based on category, yearly, running a loop to make dynamic
@app.route('/api/v1.0/expense_data', methods=['GET'])
def get_expense_data_ak():
    # Get parameters from request
    category = request.args.get('category')
    
    # Fetch data from MongoDB based on category
    data = list(collection1_ak.find({ "Category Name": category }))
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)

## calling API as below
##/api/v1.0/expense_data?category=Salaries%20And%20Benefits
##/api/v1.0/expense_data?category=Other%20Expenditures
## /api/v1.0/expense_data?category=Service%20And%20Rent


##-----------------------------------------------------------------------------------------------------------------------------##

## Linear regression for five years all categories in expense
API_ENDPOINT_exp = "http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_exp"

@app.route('/api/v1.0/linear_regression_exp', methods=['GET'])
def linear_regression_exp_ak():
    try:
        categories = {}
        
        # Fetch data from API
        response = requests.get(API_ENDPOINT_exp)
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data from API"}), 500
        
        data = response.json()
        
        # Aggregate expenses for each category
        for item in data:
            category_name = item["Category Name"]
            for key, value in item.items():
                if key.startswith("Expense"):
                    year = key.split()[1].split('(')[0]
                    if category_name not in categories:
                        categories[category_name] = {"expenses": {year: value}}
                    else:
                        categories[category_name]["expenses"][year] = value
        
        # Perform linear regression for each category
        for category, category_data in categories.items():
            years = list(map(int, category_data["expenses"].keys()))
            expenses = list(category_data["expenses"].values())
            expenses_array = np.array(expenses).reshape(-1, 1)  # Reshape expenses for sklearn
            model = LinearRegression().fit(np.array(years).reshape(-1, 1), expenses_array)  # Fit linear regression model
            category_data["slope"] = model.coef_[0][0]  # Slope of the linear regression line
            category_data["intercept"] = model.intercept_[0]  # Intercept of the linear regression line
        
        return jsonify(categories)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "An error occurred while processing the request"}), 500


##-----------------------------------------------------------------------------------------------------------------------------##


## API to display all revenue data

@app.route('/api/v1.0/merged_df_ak_final_rev', methods=['GET'])
def display_data_rev_ak():
    # Fetch data from MongoDB
    data = list(collection2_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)


##-----------------------------------------------------------------------------------------------------------------------------##
## API to display all revenue data year wise, running a loop to make dynamic

@app.route('/api/v1.0/merged_df_ak_final_rev/<int:year>', methods=['GET'])
def display_data_by_year_rev_ak(year):
    # Fetch data from MongoDB
    data = list(collection2_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    # Filter data by year
    year_data = []
    total_revenue_year = 0  # Initialize total revenue for the year
    
    for item in data:
        for key, value in item.items():
            if key.startswith("Revenue") and key.endswith(f"{year}(millions)"):
                total_revenue_year += value  # Add expense to total for the year

    # Calculate percentage share for each category
    for item in data:
        for key, value in item.items():
            if key.startswith("Revenue") and key.endswith(f"{year}(millions)"):
                category_name = item["Category Name"]
                revenue = value
                percentage_share = (revenue / total_revenue_year) * 100 if total_revenue_year != 0 else 0
                year_data.append({"Category Name": category_name, "Revenue": revenue, "Share": percentage_share})
    
    return jsonify(year_data)    

##-----------------------------------------------------------------------------------------------------------------------------##
## API to display all reveue data based on category, yearly, running a loop to make dynamic

@app.route('/api/v1.0/revenue_data', methods=['GET'])
def get_revenue_data_ak():
    # Get parameters from request
    category = request.args.get('category')
    
    # Fetch data from MongoDB based on category
    data = list(collection2_ak.find({ "Category Name": category }))
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)

## calling API as below
##/api/v1.0/revenue_data?category=Sundry%20and%20Other%20Revenues

##-----------------------------------------------------------------------------------------------------------------------------##

## Linear regression for five years all categories Revnue
API_ENDPOINT_rev = "http://127.0.0.1:5000/api/v1.0/merged_df_ak_final_rev"

@app.route('/api/v1.0/linear_regression_rev', methods=['GET'])
def linear_regression_rev_ak():
    try:
        categories = {}
        
        # Fetch data from API
        response = requests.get(API_ENDPOINT_rev)
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data from API"}), 500
        
        data = response.json()
        
        # Aggregate expenses for each category
        for item in data:
            category_name = item["Category Name"]
            for key, value in item.items():
                if key.startswith("Revenue"):
                    year = key.split()[1].split('(')[0]
                    if category_name not in categories:
                        categories[category_name] = {"revenues": {year: value}}
                    else:
                        categories[category_name]["revenues"][year] = value
        
        # Perform linear regression for each category
        for category, category_data in categories.items():
            years = list(map(int, category_data["revenues"].keys()))
            expenses = list(category_data["revenues"].values())
            revenues_array = np.array(expenses).reshape(-1, 1)  # Reshape revenues for sklearn
            model = LinearRegression().fit(np.array(years).reshape(-1, 1), revenues_array)  # Fit linear regression model
            category_data["slope"] = model.coef_[0][0]  # Slope of the linear regression line
            category_data["intercept"] = model.intercept_[0]  # Intercept of the linear regression line
        
        return jsonify(categories)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "An error occurred while processing the request"}), 500
    

##-----------------------------------------------------------------------------------------------------------------------------##

##API for summary dataframe
    
    
@app.route('/api/v1.0/dasboard_ak', methods=['GET'])
def display_data_summary_year_ak():
    # Fetch data from MongoDB
    data = list(collection3_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)


##-----------------------------------------------------------------------------------------------------------------------------##
## API to display all sub-category expense data
@app.route('/api/v1.0/merged_df_ak_final_exp_subcat', methods=['GET'])
def display_data_exp_subcat_ak():
    # Fetch data from MongoDB
    data = list(collection4_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)

## API to display all sub category expense data year wise, running a loop to make dynamic
@app.route('/api/v1.0/merged_df_ak_final_exp_subcat/<int:year>', methods=['GET'])
def display_data_by_year_exp_sub_cat_ak(year):
    # Fetch data from MongoDB
    data = list(collection4_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    # Filter data by year
    sub_cat_year_data = []
    total_sub_cat_expense_year = 0  # Initialize total expense for the year
    
    for item in data:
        for key, value in item.items():
            if key.startswith("Sub Expense") and key.endswith(f"{year}(millions)"):
                total_sub_cat_expense_year += value  # Add expense to total for the year

    # Calculate percentage share for each category
    for item in data:
        for key, value in item.items():
            if key.startswith("Sub Expense") and key.endswith(f"{year}(millions)"):
                sub_category_name = item["Sub-Category Name"]
                expense = value
                percentage_share = (expense / total_sub_cat_expense_year) * 100 if total_sub_cat_expense_year != 0 else 0
                sub_cat_year_data.append({"Sub-Category Name": sub_category_name, "Sub Expense": expense, "Share": percentage_share})
    
    return jsonify(sub_cat_year_data)    


## API to display all sub-category revenue data
@app.route('/api/v1.0/merged_df_ak_final_rev_subcat', methods=['GET'])
def display_data_rev_subcat_ak():
    # Fetch data from MongoDB
    data = list(collection5_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)


## API to display all sub category revenue data year wise, running a loop to make dynamic
@app.route('/api/v1.0/merged_df_ak_final_rev_subcat/<int:year>', methods=['GET'])
def display_data_by_year_rev_sub_cat_ak(year):
    # Fetch data from MongoDB
    data = list(collection5_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    # Filter data by year
    sub_cat_year_data_rev = []
    total_sub_cat_revenue_year = 0  # Initialize total expense for the year
    
    for item in data:
        for key, value in item.items():
            if key.startswith("Sub Revenue") and key.endswith(f"{year}(millions)"):
                total_sub_cat_revenue_year += value  # Add expense to total for the year

    # Calculate percentage share for each category
    for item in data:
        for key, value in item.items():
            if key.startswith("Sub Revenue") and key.endswith(f"{year}(millions)"):
                category_name = item["Sub-Category Name"]
                revenue = value
                percentage_share = (revenue / total_sub_cat_revenue_year) * 100 if total_sub_cat_revenue_year != 0 else 0
                sub_cat_year_data_rev.append({"Sub-Category Name": category_name, "Sub Revenue": revenue, "Share": percentage_share})
    
    return jsonify(sub_cat_year_data_rev)    



@app.route("/")
def main():
    return render_template('index_cat.html')



if __name__ == '__main__':
    app.run(debug=True)
