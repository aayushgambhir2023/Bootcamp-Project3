import pandas as pd
from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from bson import ObjectId
from sklearn.linear_model import LinearRegression
import numpy as np
import requests

app = Flask(__name__)

client = MongoClient('mongodb+srv://catdb:projectboot@catdbcluster.n7tfznu.mongodb.net/')
db_ak = client['cat_db']
collection1_ak = db_ak['expense']
collection2_ak = db_ak['revenue']
collection3_ak = db_ak['total_year']
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


## Linear regression for five years all categories
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


## API to display all expense data

@app.route('/api/v1.0/merged_df_ak_final_rev', methods=['GET'])
def display_data_rev_ak():
    # Fetch data from MongoDB
    data = list(collection2_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)

## API to display all expense data year wise, running a loop to make dynamic

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

## API to display all expense data based on category, yearly, running a loop to make dynamic

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


## Linear regression for five years all categories
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

@app.route("/")
def welcome():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)