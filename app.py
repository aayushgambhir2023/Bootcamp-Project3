import pandas as pd
from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from bson import ObjectId
from scipy.stats import linregress

app = Flask(__name__)

client = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db = client['city_toronto']
collection = db['test']
wards_collection = db["city_wards_data"]
demographic_collection = db["demographic_data"]


@app.route('/api/v1.0/merged_df_ak_final_exp', methods=['GET'])
def display_data():
    # Fetch data from MongoDB
    data = list(collection.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)    


#demographic data start
@app.route('/api/v1.0/city_wards_geo', methods=['GET'])
def display_ward_geo():
    ward_geo = list(wards_collection.find({}, {'_id': 0}))  # Exclude _id field
    return jsonify(ward_geo)

@app.route('/api/v1.0/demographic_data_2022_budget', methods = ['GET'])
def display_data_demo():
    demographic_data = list(demographic_collection.find({}, {'_id': 0}))

    return jsonify(demographic_data)

#route to data for plotting
@app.route('/api/v1.0/demographic_graph_data', methods = ['GET'])
def graph_data():
    graph_type = request.args.get('graph_type')  
    #3 options: /demographic_graph_data?graph_type=population,/demographic_graph_data?graph_type=median_income,/demographic_graph_data?graph_type=average_income
    cursor = demographic_collection.find({})
    data = list(cursor)

    x_values = []
    y_values = []
    if graph_type == 'population':
        # data for population graph
        x_values = [entry["Population density per square kilometre"] for entry in data]
        y_values = [entry["2022 Budget"] for entry in data]
    elif graph_type == 'median_income':
        # data for median income graph
        x_values = [entry["Median total income in 2020 among recipients ($)"] for entry in data]
        y_values = [entry["2022 Budget"] for entry in data]
    elif graph_type == 'average_income':
        # data for average income graph
        x_values = [entry["Average total income in 2020 among recipients ($)"] for entry in data]
        y_values = [entry["2022 Budget"] for entry in data]

    # linear regression calculation
    slope, intercept, r_value, p_value, std_err = linregress(x_values, y_values)
    regress_values = [slope * x + intercept for x in x_values]

    response_data = {
        "x_values": x_values,
        "y_values": y_values,
        "regress_values": regress_values,
        "r_value": r_value
    }
    return jsonify(response_data)

#demographic data end

@app.route("/")
def welcome():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)