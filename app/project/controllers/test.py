import pymongo
from DbConnector import DbConnector
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

provider_db = DbConnector(db='project_db',collection='provider')
news_db = DbConnector(db='project_db',collection='news')
seqs_db = DbConnector(db='project_db',collection='seqs')

data = [
  {
      "_id": 1,
      "name": "Al Jazeera English",
      "link": "https://www.aljazeera.com/xml/rss/all.xml",
      "Data Added": "Sun, 23 Jun 2019 12:32:50 GMT",
      "Data Updated": "Sun, 23 Jun 2019 12:32:50 GMT",
      "Status": 1
  },
  {
      "_id": 2,
      "name": "Defence Blog",
      "link": "https://defence-blog.com/feed",
      "Data Added": "Sun, 23 Jun 2019 12:32:50 GMT",
      "Data Updated": "Sun, 23 Jun 2019 12:32:50 GMT",
      "Status": 1
  },
  {
      "_id": 3,
      "name": "The Guardian",
      "link": "https://www.theguardian.com/world/rss",
      "Data Added": "Sun, 23 Jun 2019 12:32:50 GMT",
      "Data Updated": "Sun, 23 Jun 2019 12:32:50 GMT",
      "Status": 1
  },
  {
      "_id": 4,
      "name": "CBC",
      "link": "https://www.cbc.ca/cmlink/rss-world",
      "Data Added": "Sun, 23 Jun 2019 12:32:50 GMT",
      "Data Updated": "Sun, 23 Jun 2019 12:32:50 GMT",
      "Status": 1
  }
]


def insert_doc(doc):
    doc['_id'] = seqs_db.find_and_modify({'collection': 'provider_collection'},{'$inc': {'id': 1}},{'id': 1, '_id': 0},True)
    try:
        provider_db.insert(doc)

    except pymongo.errors.DuplicateKeyError as e:
        insert_doc(doc)
for item in data:
    insert_doc(item)
#provider_db.insert(data2)
provider = list(provider_db.find({}))
print(provider)