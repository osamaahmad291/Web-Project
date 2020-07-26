# -*- coding: utf-8 -*-
from project import app
from flask import render_template, request
from requests import get, post, put, delete
import requests
import xml.etree.ElementTree as ET
import json
from bson import json_util
import sys
from DbConnector import DbConnector
from datetime import datetime
reload(sys)
sys.setdefaultencoding('utf-8')

provider_db = DbConnector(db='project_db',collection='provider')
news_db = DbConnector(db='project_db',collection='news')
seqs_db = DbConnector(db='project_db',collection='seqs')

@app.route('/')
def start():
	return render_template('index.html')


@app.route('/save_providers')
def save_provider():

    page = requests.get("https://www.aljazeera.com/xml/rss/all.xml")
    data = []
    tree = ET.fromstring(page.content)
    for item in tree.iter('item'):
        mydata = { "title": item.find('title').text,
                 "description": item.find('description').text,
                 "link": item.find('link').text,
                 "pubDate": item.find('pubDate').text
        }
        data.append(provider_db.insert(mydata))

    return json.dumps({"response": data}, default=json_util.default)


@app.route('/save_feeds')
def save_feeds():
    providers = provider_db.find({})
    data = []
    for provider in providers:
        page = requests.get(provider['link'])
        tree = ET.fromstring(page.content)
        for item in tree.iter('item'):
            mydata = {"title": item.find('title').text,
                       "description": item.find('description').text,
                       "link": item.find('link').text,
                       "pubDate": item.find('pubDate').text,
                       "provider": provider['_id'],
                       "Data Added": datetime.now(),
                       "Data Update": datetime.now(),
                        "_id": seqs_db.find_and_modify({'collection': 'news_collection'}, {'$inc': {'id': 1}},
                                                 {'id': 1, '_id': 0}, True)
                      }
            data.append(news_db.insert(mydata))

    return json.dumps({"response": data}, default=json_util.default)

@app.route('/get_results')
def get_results():
    return json.dumps({"response": list(news_db.find({}))},indent=4, default=json_util.default)