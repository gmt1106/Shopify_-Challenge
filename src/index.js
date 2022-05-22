
// set up express
const express = require('express');
const app = express();
const path = require('path');

// set up mongodb
const mongoClient = require('mongodb').MongoClient;
const dbName = 'shopify_challenge';
const mongodbURL = 'mongodb://localhost:27017'
// reference to the database 
var database

// parse application/json
app.use(require('body-parser').json());

//start local host 4000
mongoClient.connect(mongodbURL, (err, db) => {
    if (err) return console.log(err) 
  
    database = db.db(dbName)
    console.log(`Connected MongoDB: ${mongodbURL}`)
    console.log(`Database: ${dbName}`)
    app.listen(4000, () => {
      console.log('server started on localhost:4000');
    });
})

//************ get ************ 
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/template.html'));
})

// READ
app.get('/:name', async (req, res) => {
    const query = { name: req.params.name };
    try {
        const result = await database.collection('items').findOne(query);
        console.log(`Found an item in the collection with the name '${query.name}':`);
        res.send(result);
    } catch(err) {
        console.log(`No item found with the name '${query.name}'`);
        res.send(err);
    }
});

//************ put ************ 
// UPDATE
app.put('/:name', async (req, res) => {
    const query = { name: req.params.name };
    const newName = req.body.newName ?? req.params.name
    const body = {
        name: newName,
        quantity: req.body.quantity
    };
    try {
        const result = await database.collection('items').updateOne(query, { $set: body });
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
app.post('/', async (req, res) => {
    console.log(req.body.name)
    console.log(req.body.quantity)
    const item = {
        name: req.body.name,
        quantity: req.body.quantity
    };
    try {
        const result = await database.collection('items').insertOne(item);
        console.log(`A new item, ${item.name} is created with the following id: ${result.insertedId}`);
        res.send(item);
    } catch(err) {
        console.log(err);
        res.send(err);
    }
})

//************ delete ************ 
// DELETE
app.delete('/:name', async (req, res) => {
    const query = { name: req.params.name };
    try {
        const result = await database.collection('items').remove(query);
        console.log(`Deleted an item in the collection with the name '${query.name}':`);
        res.send(result);
    } catch(err) {
        console.log(`No item found with the name '${query.name}'`);
        res.send(err);
    }
});

