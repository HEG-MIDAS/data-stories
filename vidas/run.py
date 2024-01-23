# import everything we need
from flask import Flask, render_template, Response, request, redirect, jsonify
import json
import csv
import pandas as pd
import os

# Setup Flask app.
app = Flask(__name__)

# Extra debugging
app.debug = True

# Import DataFrame
PATH_IN_TEMPS = r'static/data/temps-cointrin-decades-norme-6190.csv'
PATH_IN_CO2 = r'static/data/tous-les-GES.csv'
PATH_IN_WATER_TEMPS = r'static/data/water-course-geneva-rhone-and-arve-leman-temps-moving-avg.csv'
PATH_IN_GLACIER_VOL = r'static/data/volume-total-rhone.csv'
PATH_GES_PARIS_LIN_REGR = r'static/data/tous-les-ges-sw-with-goals-and-linear-regression.csv'

PATH_IN_TEMPS = os.getcwd()+'/static/data/temps-cointrin-decades-norme-6190.csv'
PATH_IN_CO2 = os.getcwd()+'/static/data/tous-les-GES.csv'
PATH_IN_WATER_TEMPS = os.getcwd()+'/static/data/water-course-geneva-rhone-and-arve-leman-temps-moving-avg.csv'
PATH_IN_GLACIER_VOL = os.getcwd()+'/static/data/volume-total-rhone.csv'
PATH_GES_PARIS_LIN_REGR = os.getcwd()+'/static/data/tous-les-ges-sw-with-goals-and-linear-regression.csv'

# prevent cached responses
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
      response.headers["Cache-Control"] = " no-store,  max-age=0"
      return response

# Routes
# This is root path, use index.html in "static" folder
@app.route('/')
def root():
  return render_template("index.html")


@app.route('/scientificaudience', methods=['GET'])
def scientificaudience():
    # show the form, it wasn't submitted
    return render_template('scientific-audience.html')

@app.route('/generalaudience', methods=['GET'])
def generalaudience():
    # show the form, it wasn't submitted
    return render_template('general-audience.html')


@app.route('/youngpublic', methods=['GET'])
def youngpublic():
    # show the form, it wasn't submitted
    return render_template('young-public.html')


@app.route('/<path:path>')
def static_proxy(path):
  return app.send_static_file(path)

@app.route('/getCO2')
def getCO2():
    name = request.args.get('name')
    if name == "co2":
      # print(name)
      dfco2 = pd.read_csv(PATH_IN_CO2)
      json_resp = dfco2.to_json()
      # print(f'json_resp={json_resp}')
      response = Response(response=json_resp, status=200, mimetype="application/json")
      return(response)

@app.route('/gesParisLinReg')
def gesParisLinReg():  
    dfges = pd.read_csv(PATH_GES_PARIS_LIN_REGR)
    json_resp = dfges.to_json()
    # print(f'json_resp={json_resp}')
    response = Response(response=json_resp, status=200, mimetype="application/json")
    return(response)


@app.route('/getWaterTemps')
def getWaterTemps():
    name = request.args.get('name')
    if name == "water-temps":
      # print(name)
      dfwater = pd.read_csv(PATH_IN_WATER_TEMPS)
      json_resp = dfwater.to_json()
      # print(f'json_resp={json_resp}')
      response = Response(response=json_resp, status=200, mimetype="application/json")
      return(response)
    

@app.route('/getAirTempAnomalies')
def getAirTempAnomalies():
    
    name = request.args.get('name')
    if name == "air-temp-anomalies":
      # print(name)
      df_air_temps = pd.read_csv(PATH_IN_TEMPS)
      json_resp = df_air_temps.to_json()
      # print(f'json_resp={json_resp}')
      response = Response(response=json_resp, status=200, mimetype="application/json")
      return(response)


@app.route('/getGlacierVol')
def getGlacierVol():
    
    # Get the "name" value sent from p5
    name = request.args.get('name')
    if name == "glacier-vol":
      # print(name)
      dfglacier = pd.read_csv(PATH_IN_GLACIER_VOL)

      json_resp = dfglacier.to_json()
      # print(f'json_resp={json_resp}')
      response = Response(response=json_resp, status=200, mimetype="application/json")
      return(response)

# Run app:
if __name__ == '__main__':
    app.run( host='0.0.0.0', port=80, debug=True )
