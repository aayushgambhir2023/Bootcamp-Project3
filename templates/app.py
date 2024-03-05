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


@app.route('/api/v1.0/new_statsexp/<int:year>', methods=['GET'])
def get_stats_exp(year):
    # Extract statistics for the specified year
    stats_data = statsexpense_collectiom.find_one({str(year): {'$exists': True}})

    # If the year is not found, return a 404 error
    if not stats_data:
        return jsonify({'error': 'Statistics for the specified year not found'}), 404

    # Extract statistics values for the year
    year_stats = stats_data[str(year)]

    # Calculate mean, median, and standard deviation
    mean = year_stats.get('mean', None)
    median = year_stats.get('median', None)
    std_dev = year_stats.get('std_dev', None)

    # Create stats dictionary
    stats1 = {
        "mean": mean,
        "median": median,
        "std_dev": std_dev
    }

 # Return the statistics as JSON
    return jsonify(stats1)


@app.route('/api/v1.0/new_statsrev/<int:year>', methods=['GET'])
def get_stats_rev(year):
    # Extract statistics for the specified year
    stats_data = statsrevenue_collectiom.find_one({str(year): {'$exists': True}})

    # If the year is not found, return a 404 error
    if not stats_data:
        return jsonify({'error': 'Statistics for the specified year not found'}), 404

    # Extract statistics values for the year
    year_stats = stats_data[str(year)]

    # Calculate mean, median, and standard deviation
    mean = year_stats.get('mean', None)
    median = year_stats.get('median', None)
    std_dev = year_stats.get('std_dev', None)

    # Create stats dictionary
    stats2 = {
        "mean": mean,
        "median": median,
        "std_dev": std_dev
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
