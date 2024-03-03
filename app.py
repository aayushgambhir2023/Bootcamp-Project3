import pandas as pd
from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

client = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db = client['city_toronto']
expense_collection = db['expense']
revenue_collection = db['revenue']
statsexpense_collectiom = db['stats_expenses']
statsrevenue_collectiom = db['stats_revenue']
ol_all_outliers_rev_collection = db['OL_all_outliers_rev']
ol_all_outliers_exp_collection = db['OL_all_outliers_exp']

## API to display all expense data
@app.route('/api/v1.0/expense_data', methods=['GET'])
def display_expense_data():
    # Fetch data from MongoDB
    data = list(expense_collection.find())
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    return jsonify(data)

## API to display all expense data year wise, making it dynamic
@app.route('/api/v1.0/expense_data/<int:year>', methods=['GET'])
def display_expense_data_by_year(year):
    # Fetch data from MongoDB
    data = list(expense_collection.find())
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    # Filter data by year and calculate
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

## API to display all revenue data
@app.route('/api/v1.0/revenue_data', methods=['GET'])
def display_revenue_data():
    # Fetch data from MongoDB
    data = list(revenue_collection.find())
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    return jsonify(data)

## API to display all revenue data year wise, making it dynamic
@app.route('/api/v1.0/revenue_data/<int:year>', methods=['GET'])
def display_revenue_data_by_year(year):
    # Fetch data from MongoDB
    data = list(revenue_collection.find())
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    # Filter data by year
    year_data = []
    total_revenue_year = 0  # Initialize total revenue for the year
    for item in data:
        for key, value in item.items():
            if key.startswith("Revenue") and key.endswith(f"{year}(millions)"):
                total_revenue_year += value  # Add revenue to total for the year
    # Calculate percentage share for each category
    for item in data:
        for key, value in item.items():
            if key.startswith("Revenue") and key.endswith(f"{year}(millions)"):
                category_name = item["Category Name"]
                revenue = value
                percentage_share = (revenue / total_revenue_year) * 100 if total_revenue_year != 0 else 0
                year_data.append({"Category Name": category_name, "Revenue": revenue, "Share": percentage_share})
    return jsonify(year_data)


@app.route('/api/v1.0/new_statsrev/<int:year>', methods=['GET'])
def get_new_stats_by_year(year):
 
 data = statsrevenue_collectiom.find()
    # Attempt to fetch the document for the specified year
 for item in data:
    item['_id'] = str(item['_id'])
    stats_document = statsrevenue_collectiom.find_one({"_id": str(item["_id"])})


    if not stats_document:
        # If the document doesn't exist, return a 404 not found response
        return jsonify({"error": "Stats not found for the specified year"}), 404

    # Extract the mean, median, and std_dev values
    stats2 = {
        "mean": stats_document.get("mean", 0),
        "median": stats_document.get("median", 0),
        "std_dev": stats_document.get("std_dev", 0)
    }

    # Return the statistics as JSON
    return jsonify(stats2)







@app.route('/api/v1.0/revenue_data', methods=['GET'])
def get_revenue_data():
    # Optional: Use request arguments to filter by year or category, if needed
    year = request.args.get('year', type=int)
    category = request.args.get('category')

    query = {}
    if year:
        query['year'] = year
    if category:
        query['Category Name'] = category

    # Fetch data from MongoDB using the constructed query
    OLrevdata = list(ol_all_outliers_rev_collection.find(query))

    # Convert MongoDB ObjectId to string
    for item in OLrevdata:
        item['_id'] = str(item['_id'])

    # Return the data as JSON
    return jsonify(OLrevdata)

@app.route('/api/v1.0/expense_data', methods=['GET'])
def get_expense_data():
    # Optional: Use request arguments to filter by year or category, if needed
    year = request.args.get('year', type=int)
    category = request.args.get('category')

    query = {}
    if year:
        query['year'] = year
    if category:
        query['Category Name'] = category

    # Fetch data from MongoDB using the constructed query
    OLexpdata = list(ol_all_outliers_exp_collection.find(query))

    # Convert MongoDB ObjectId to string
    for item in OLexpdata:
        item['_id'] = str(item['_id'])

    # Return the data as JSON
    return jsonify(OLexpdata)

@app.route("/")
def welcome():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
