FROM mongo

COPY init.json /init.json
CMD mongoimport --host mongo --db project_db --collection provider --type json --file /init.json --jsonArray