import pandas as pd
from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

client = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db = client['city_toronto']
collection = db['test']

@app.route('/api/v1.0/merged_df_ak_final_exp', methods=['GET'])
def display_data():
    # Fetch data from MongoDB
    data = list(collection.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)    


@app.route("/")
def welcome():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)