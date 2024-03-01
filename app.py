import pandas as pd
from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

client = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db = client['city_toronto']

@app.route('/api/v1.0/profit_revenue_expense_data/<int:year>', methods=['GET'])
def display_expense_data(year):
    # Define the dictionary of collections for different years
    collections = {
        2019: db['pNl_program_2019'],
        2020: db['pNl_program_2020'],
        2021: db['pNl_program_2021'],
        2022: db['pNl_program_2022'],
        2023: db['pNl_program_2023']
    }

    # Initialize an empty dictionary to store expense data
    expense_data = {}

    # Fetch expense data for the specified year from MongoDB
    data = list(collections[year].find())

    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])

    # Filter data to include only expense-related information
    year_expense_data = []
    for item in data:
        document_data = {
            "Program": item["Program"],
            "_id": str(item["_id"]),
            "rev": item.get("rev", 0),  # Get revenue value or default to 0
            "exp": item.get("exp", 0),  # Get expense value or default to 0
            "res": item.get(f"res-{year}", 0)  # Get result value for the current year or default to 0
        }
        year_expense_data.append(document_data)

    # Store the expense data for the specified year in the expense_data dictionary
    expense_data[year] = year_expense_data

    return jsonify(expense_data)


@app.route("/")
def welcome():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)