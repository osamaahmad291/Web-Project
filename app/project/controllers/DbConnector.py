import pymongo


class DbConnector:

    def __init__(self, host='mongo', db='project_db',
                 collection='current'):
        self._client = pymongo.MongoClient(host)
        self._db = self._client.get_database(db)
        self._collection = self._db.get_collection(collection)

    def insert(self, data):
        return self._collection.insert(data)

    def find(self, query, projection=None):
        return self._collection.find(query, projection)

    def find_and_modify(self, query, update, fields, new):
        id = str(self._collection.find_and_modify(
            query=query,
            update=update,
            fields=fields,
            new=new
        ).get('id'))
        return id

    def aggregate(self, pipeline):
        return self._collection.aggregate(pipeline)