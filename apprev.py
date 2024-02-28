import pandas as pd
from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

# Assuming the MongoDB setup remains the same but with a different collection for revenues
client = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db = client['city_toronto']
collection = db['revenues']  # Changed to 'revenues' collection

## API to display all revenue data
@app.route('/api/v1.0/merged_df_ak_final_rev', methods=['GET'])
def display_data():
    # Fetch data from MongoDB
    data = list(collection.find())

    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])

    return jsonify(data)

## API to display all revenue data year wise, running a loop to make dynamic
@app.route('/api/v1.0/merged_df_ak_final_rev/<int:year>', methods=['GET'])
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
            if key.startswith("Revenue") and key.endswith(f"{year}(millions)"):  # Changed from "Expense" to "Revenue"
                year_data.append({"Category Name": item["Category Name"], "Revenue": value})  # Changed "Expense" to "Revenue"

    return jsonify(year_data)

## API to display all revenue data based on category, yearly, running a loop to make dynamic
@app.route('/api/v1.0/revenue_data', methods=['GET'])
def get_revenue_data():
    # Get parameters from request
    category = request.args.get('category')

    # Fetch data from MongoDB based on category
    data = list(collection.find({ "Category Name": category }))

    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])

    return jsonify(data)

# Example calling API for revenues
# /api/v1.0/revenue_data?category=Sales
# /api/v1.0/revenue_data?category=Grants
# /api/v1.0/revenue_data?category=Donations

@app.route("/")
def welcome():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
