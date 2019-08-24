import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import pandas as pd

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/shark.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
shark_data_cleaned = Base.classes.shark_data_cleaned

# Create our session (link) from Python to the DB
# session = Session(engine)



#################################################
# Flask Routes
#################################################

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/v1.0/data")
def shark_data():

    results = db.session.query(shark_data_cleaned.id, 
                            shark_data_cleaned.Case_Number, 
                            shark_data_cleaned.Date,
                            shark_data_cleaned.Year,
                            shark_data_cleaned.Type,
                            shark_data_cleaned.Country,
                            shark_data_cleaned.Area,
                            shark_data_cleaned.Location,
                            shark_data_cleaned.Activity,
                            shark_data_cleaned.Name,
                            shark_data_cleaned.Sex,
                            shark_data_cleaned.Age,
                            shark_data_cleaned.Injury,
                            shark_data_cleaned.Fatality,
                            shark_data_cleaned.Time,
                            shark_data_cleaned.Species,
                            shark_data_cleaned.Investigator_or_Source,
                            shark_data_cleaned.href_formula).all()

    # Create a dictionary entry for each row of metadata information
    data = []

    for result in results:
        shark_data = {}
        shark_data["id"] = result[0],
        shark_data["Case_Number"] = result[1],
        shark_data["Date"] = result[2],
        shark_data["Year"] = result[3],
        shark_data["Type"] = result[4],
        shark_data["Country"] = result[5],
        shark_data["Area"] = result[6],
        shark_data["Location"] = result[7],
        shark_data["Activity"] = result[8],
        shark_data["Name"] = result[9],
        shark_data["Sex"] = result[10],
        shark_data["Age"] = result[11],
        shark_data["Injury"] = result[12],
        shark_data["Fatal_(Y/N)"] = result[13],
        shark_data["Time"] = result[14],
        shark_data["Species"] = result[15],
        shark_data["Investigator_or_Source"] = result[16],
        shark_data["href_formula"] = result[17]

        data.append(shark_data)

    return jsonify(data)



if __name__ == "__main__":
    app.run(debug=True)
