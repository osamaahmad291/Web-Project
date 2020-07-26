from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_restplus import Api, Resource, fields
import json
from bson import ObjectId, json_util
from flask_cors import CORS, cross_origin
from datetime import datetime
from bson import json_util

app = Flask(__name__)
CORS(app)
app.config["MONGO_DBNAME"] = "project_db"
app.config["MONGO_HOST"] = "mongo"
mongo = PyMongo(app, config_prefix='MONGO')
#APP_URL = "http://0.0.0.0:5000"
api = Api(app, version='0.1.0', title='Project API',
    description='This API handles the CRUD operations',
)


pns = api.namespace('Providers', description='News feeds Provider Data')
nns = api.namespace('News', description='News Data')

provider_parser = api.parser()
provider_parser.add_argument('name', type=str, required=True, help='Name', location='form')
provider_parser.add_argument('link', type=str, required=True, help='Link', location='form')
provider_parser.add_argument('Date Added', type=lambda x: datetime.strptime(x,'%Y-%m-%dT%H:%M:%S'), required=True, help='Date Added', location='form')
provider_parser.add_argument('Date Updated', type=lambda x: datetime.strptime(x,'%Y-%m-%dT%H:%M:%S'), required=True, help='Date Updated', location='form')
provider_parser.add_argument('Status', type=str, required=True, help='Status', location='form')


news_parser = api.parser()
news_parser.add_argument('name', type=str, required=True, help='Name', location='form')
news_parser.add_argument('description', type=str, required=True, help='Description', location='form')
news_parser.add_argument('link', type=float, required=True, help='Price', location='form')
news_parser.add_argument('Pub Added', type=str, required=True, help='Publish Added', location='form')
news_parser.add_argument('Date Added', type=str, required=True, help='Date Added', location='form')
news_parser.add_argument('Date Updated', type=str, required=True, help='Date Updated', location='form')

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

class Provider(object):
    def __init__(self):
        with app.app_context():
            mongo.db.seqs.insert({'collection' : 'provider_collection','id' : 0})

    def get_one(self, id):
        data = []
        provider_info = mongo.db.provider.find_one({"_id": str(id)})
        if provider_info:
            return jsonify({"status": "ok", "data": provider_info})
            #return json_util.dumps({"status": "ok","data": provider_info})
        else:
            return {"response": "no provider found for {}".format(id)}

    def get_all(self):
        data = []
        if 'search' in request.args:
            query = request.args['search']
            query = query.split(',')
            if(len(query) == 3 and len(query[2]) > 0):
                if(query[1] == 'like'):
                    cursor = mongo.db.provider.find({query[0]:query[2]}).limit(10)
                elif(query[1] == 'contains'):
                    cursor = mongo.db.provider.find({query[0]:{"$regex": query[2]}}).limit(10)
                else:
                    return jsonify({"response": "Invalid operation.Please check again"})
                
                for provider in cursor:
                    #resturant['url'] = APP_URL + url_for('resturants') + "/" + resturant.get('name')
                    data.append(provider)
                return jsonify({"response": data})
                #return jsonify({"response": data},indent=4, default=json_util.default)
            else:
                return jsonify({"response": "Invalid querry.Please check again"})
        else:
            cursor = mongo.db.provider.find({}).limit(10)
            for provider in cursor:
                #resturant['url'] = APP_URL + url_for('resturants') + "/" + resturant.get('name')
                data.append(provider)
            return jsonify({"response": data})
            #return jsonify({"response": data},indent=4, default=json_util.default)

    def create(self, data):
        #data = request.get_json()
        if not data:
            data = {"response": "ERROR"}
            return jsonify(data)
        else:
            name = data.get('name')
            if name:
                if mongo.db.provider.find_one({"name": name}):
                    return {"response": "Provider name already exists."}
                else:
                    self.insert_doc(data)
                    return jsonify({"response": "Data inserted Successfully!!"})
            else:
                return {"response": "something missing.Please try again!!!"}

    def update(self, id , data):
        if data:
            mongo.db.provider.update({'_id': str(id)}, {'$set': data})
            return jsonify({"status": "ok", "response": "Data updated Successfully!!"})
        else:
            return jsonify({"status": "ok", "response": "Data not found.Please try again!!"})

    def delete(self, record_id):
        result = mongo.db.provider.remove({"_id": str(record_id)})
        print result
        return jsonify({"status": "ok", "response": "Data deleted Successfully!!"}) 

    def insert_doc(self,doc):
        doc['_id'] = str(mongo.db.seqs.find_and_modify(
            query={ 'collection' : 'provider_collection' },
            update={'$inc': {'id': 1}},
            fields={'id': 1, '_id': 0},
            new=True 
        ).get('id'))

        try:
            mongo.db.provider.insert(doc)

        except pymongo.errors.DuplicateKeyError as e:
            insert_doc(doc) 

class News(object):
    def __init__(self):
        with app.app_context():
            mongo.db.seqs.insert({'collection' : 'news_collection','id' : 0})


    def get_one(self, id):
        data = []
        news_info = mongo.db.news.find_one({"_id": str(id)})
        if news_info:
            return jsonify({"status": "ok", "data": news_info})
        else:
            return {"response": "No Data found for {}".format(id)}

    def get_all(self):
        data = []
        cursor = mongo.db.news.find({})
        for menu in cursor:
            data.append(menu)
        return jsonify({"response": data})
       
    def create(self, data):
        if not data:
            data = {"response": "ERROR"}
            return jsonify(data)
        else:
            name = data['name']
            if name:
                if mongo.db.news.find_one({"name": name}):
                    return {"response": "News already exists."}
                else:
                    self.insert_doc(data)
                    return jsonify({"response": "Data inserted Successfully!!"})
            else:
                return {"response": "Required Field missing"}

    def update(self, id,data):
        if data:
            mongo.db.news.update({'_id': str(id)}, {'$set': data})
            return jsonify({"status": "ok", "response": "Data updated Successfully!!"})
        else:
            return jsonify({"status": "ok", "response": "Data not found.Please try again!!"})

    def delete(self, id):
        mongo.db.news.remove({'_id': str(id)})
        return jsonify({"status": "ok", "response": "Data deleted Successfully!!"}) 


    def insert_doc(self,doc):
        doc['_id'] = str(mongo.db.seqs.find_and_modify(
            query={ 'collection' : 'news_collection' },
            update={'$inc': {'id': 1}},
            fields={'id': 1, '_id': 0},
            new=True 
        ).get('id'))

        try:
            mongo.db.news.insert(doc)
            mongo.db.news.create_index([('name', 'text')])
            mongo.db.news.create_index([('description', 'text')])

        except pymongo.errors.DuplicateKeyError as e:
            insert_doc(doc)

provider = Provider()
news = News()

@pns.route('/')
class ProviderList(Resource):
    '''Shows a list of all Demonstrators, and lets you POST to add new Demonstrators'''
    @pns.doc('list_provider')
    def get(self):
        '''List all Providers'''
        return provider.get_all()

    @api.doc(parser=provider_parser)
    def post(self):
        '''Create a Provoder'''
        args = provider_parser.parse_args()
        return provider.create(args)

@pns.route('/<int:id>')
class Provider(Resource):
    '''Shows a list of all todos, and lets you POST to add new tasks'''
    @pns.doc('get_provider_by_id')
    def get(self,id):
        '''List Provider by id'''
        return provider.get_one(id)

    @api.doc(parser=provider_parser)
    def put(self, id):
        '''Update a Provider record'''
        args = provider_parser.parse_args()
        return provider.update(id,args)

    @pns.doc('delete_resturant_by_id')
    def delete(self,id):
        '''delete provider by id'''
        return provider.delete(id)

@nns.route('/')
class NewsList(Resource):
    '''Shows a list of all Demonstrators, and lets you POST to add new Demonstrators'''
    @nns.doc('list_news')
    def get(self):
        '''List all News'''
        return news.get_all()

    @api.doc(parser=news_parser)
    def post(self):
        '''Create a News Feed'''
        args = news_parser.parse_args()
        return news.create(args)

@nns.route('/<int:id>')
class News(Resource):
    '''Shows a list of all todos, and lets you POST to add new tasks'''
    @nns.doc('get_news_by_id')
    def get(self,id):
        '''List news by id'''
        return news.get_one(id)


    @api.doc(parser=news_parser)
    def put(self, id):
        '''Update a News record'''
        args = news_parser.parse_args()
        return news.update(id,args)

    @nns.doc('delete_news_by_id')
    def delete(self,id):
        '''delete news by id'''
        return news.delete(id)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)

