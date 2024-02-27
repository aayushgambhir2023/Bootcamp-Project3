import pandas as pd
from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

client = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db = client['city_toronto']
collection = db['test']

## API to display all expense data

@app.route('/api/v1.0/merged_df_ak_final_exp', methods=['GET'])
def display_data():
    # Fetch data from MongoDB
    data = list(collection.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)

## API to display all expense data year wise, running a loop to make dynamic

@app.route('/api/v1.0/merged_df_ak_final_exp/<int:year>', methods=['GET'])
def display_data_by_year(year):
    # Fetch data from MongoDB
    data = list(collection.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    # Filter data by year
    year_data = []
    for item in data:
        for key, value in item.items():
            if key.startswith("Expense") and key.endswith(f"{year}(millions)"):
                year_data.append({"Category Name": item["Category Name"], "Expense": value})
    
    return jsonify(year_data)    

## API to display all expense data based on category, yearly, running a loop to make dynamic

@app.route('/api/v1.0/expense_data', methods=['GET'])
def get_expense_data():
    # Get parameters from request
    category = request.args.get('category')
    
    # Fetch data from MongoDB based on category
    data = list(collection.find({ "Category Name": category }))
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)

## calling API as below
##/api/v1.0/expense_data?category=Salaries%20And%20Benefits
##/api/v1.0/expense_data?category=Other%20Expenditures
## /api/v1.0/expense_data?category=Service%20And%20Rent



@app.route("/")
def welcome():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)