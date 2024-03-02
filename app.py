from flask import Flask, jsonify, render_template
from pymongo import MongoClient
from bson import json_util
import json


app = Flask(__name__)

client = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db = client['city_toronto']
collection = db['test']

# API for expenditures by program
@app.route('/api/program_analysis/<year>')
def get_program_analysis(year):
    # Get parameters from request

    coll = db[f"pNl_program_{year}"]
    program_data = list(coll.find())
    return jsonify(json.loads(json_util.dumps(program_data)))

@app.route("/")
def main():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
