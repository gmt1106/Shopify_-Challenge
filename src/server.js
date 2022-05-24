// set up express
const express = require('express');
const app = express();
const path = require('path');

// set up mongodb
const mongoClient = require('mongodb').MongoClient;
const databaseName = 'shopify_challenge';
const mongodbURL = 'mongodb://localhost:27017';

//start local host 4000
mongoClient.connect(mongodbURL)
    .then(db => {
        const database = db.db(databaseName);
        console.log(`Connected MongoDB: ${mongodbURL}`);
        console.log(`Database: ${databaseName}`);

        // parse application/json
        app.use(require('body-parser').json());

        app.use(express.static('public'));
        app.set('view engine', 'ejs');

        //************ get ************ 
        app.get('/', async (req, res) => {
            database.collection("items").find().toArray()
                .then(results => {
                    res.render('template.ejs', { items: results });
                })
                .catch(err => {
                    console.log('Rendering homepage had error.');
                    console.log(err);
                    res.send(err);
                })
        })

        app.get('/:location', async (req, res) => {
            database.collection(req.params.location).find().toArray()
                .then(results => {
                    res.render('template.ejs', { items: results });
                })
                .catch(err => {
                    console.log('Rendering homepage had error.');
                    console.log(err);
                    res.send(err);
                })
        })

        // READ
        app.get('/:location/:id', async (req, res) => {
            const ObjectID = require('mongodb').ObjectID;
            const id = req.params.id;
            const query = { _id: new ObjectID(id) };
            try {
                const result = await database.collection(req.params.location).findOne(query);
                console.log(`Found an item in the collection with the name '${query._id}':`);
                res.send(result);
            } catch(err) {
                console.log(`No item found with the name '${query._id}'`);
                res.send(err);
            }
        });

        //************ put ************ 
        // UPDATE
        app.put('/:location/:id', async (req, res) => {
            const ObjectID = require('mongodb').ObjectID;
            const id = req.params.id;
            const query = { _id: new ObjectID(id) };
            const body = {
                name: req.body.name,
                quantity: req.body.quantity
            };
            try {
                const result = await database.collection(req.params.location).updateOne(query, { $set: body });
                console.log(`For a item, ${query.name}, ${result.matchedCount} document(s) matched the query criteria.`);
                console.log(`A item, ${result.modifiedCount} is updated.`);
                res.send(body);
            } catch(err) {
                console.log(`No item is found with the name: '${result.name}'`);
                res.send(err);
            }
        });

        //************ post ************
        // CREATE
        app.post('/:location', async (req, res) => {
            const item = {
                name: req.body.name,
                quantity: req.body.quantity
            };
            try {
                const result = await database.collection(req.params.location).insertOne(item);
                console.log(`A new item, ${item.name} is created with the following id: ${result.insertedId}`);
                res.send(item);
            } catch(err) {
                console.log(err);
                res.send(err);
            }
        });

        //************ delete ************ 
        // DELETE
        app.delete('/:location/:id', async (req, res) => {
            const ObjectID = require('mongodb').ObjectID;
            const id = req.params.id;
            const query = { _id: new ObjectID(id) };
            try {
                const result = await database.collection(req.params.location).remove(query);
                console.log(`Deleted an item in the collection with the name '${query._id}':`);
                res.send(result);
            } catch(err) {
                console.log(`No item found with the name '${query._id}'`);
                res.send(err);
            }
        });

        app.listen(4000, () => {
        console.log('server started on localhost:4000');
        });

    })
    .catch(err => {
        console.log(err);
        return; 
    })
