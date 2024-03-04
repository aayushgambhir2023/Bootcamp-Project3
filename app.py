import pandas as pd
from flask import Flask, jsonify, request, render_template, send_file
from pymongo import MongoClient
from bson import ObjectId
import json
from flask import Flask, jsonify


app = Flask(__name__)

client = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db = client['city_toronto']
 # Define the dictionary of collections for different years
collections = {
        2019: db['pNl_program_2019'],
        2020: db['pNl_program_2020'],
        2021: db['pNl_program_2021'],
        2022: db['pNl_program_2022'],
        2023: db['pNl_program_2023']
}

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET'
    return response

@app.route('/api/v1.0/summarized_revenue_data/<int:year>', methods=['GET'])
def summarized_revenue_data(year):
    summarized_revenue_data = summarize_data(year, 'rev')
    return jsonify(summarized_revenue_data)

@app.route('/api/v1.0/summarized_expense_data/<int:year>', methods=['GET'])
def summarized_expense_data(year):
    summarized_expense_data = summarize_data(year, 'exp')
    return jsonify(summarized_expense_data)

@app.route('/api/v1.0/summarized_profit_data/<int:year>', methods=['GET'])
def summarized_profit_data(year):
    summarized_profit_data = summarize_data(year, f'res-{year}')
    return jsonify(summarized_profit_data)

def summarize_data(year, field):
    summarized_data = {}
    data = list(collections[year].find())

    for item in data:
        program = item["Program"]
        value = item.get(field, 0)
        summarized_data[program] = summarized_data.get(program, 0) + value

    return summarized_data

@app.route("/")
def welcome():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
