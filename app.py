import pandas as pd
from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

client = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db = client['city_toronto']
statsexpense_collectiom = db['stats_expenses']
statsrevenue_collectiom = db['stats_revenue']
ol_all_outliers_rev_collection = db['OL_all_outliers_rev']
ol_all_outliers_exp_collection = db['OL_all_outliers_exp']


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



@app.route('/api/v1.0/revenue_data_mm', methods=['GET'])
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

@app.route('/api/v1.0/expense_data_mm', methods=['GET'])
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
