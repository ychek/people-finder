'use strict';

const express = require('express');
const fs = require('fs');
const { Node, Trie } = require('./bll/trie');
const dataManager = require('./bll/dataStructuresManager');

const app = express();
const port = process.env.PORT || 5555;

const db = JSON.parse(fs.readFileSync('./data/people.json', 'utf8'));

// 1. Transform db to a key value store
const keyValueStore = dataManager.createKeyValueStore(db);

// 2. Create an index of the people
const peopleIndex = dataManager.createIndex(db);

const trie = new Trie();
// 3. Load names to the trie
dataManager.loadIndexToTrie(peopleIndex, trie);

app.get('/api/search', (req, res) => {

    const text = req.query.q;

    // Simulate delay for the requests

    // const randomTime = Math.floor(Math.random() * 6000) + 1000;
    // console.log(randomTime);
    // setTimeout(function () {
    //     res.send({ text : text , data : [], num : requestNumber });
    // },randomTime );
    //

    const dataSet = dataManager.searchForData(text, trie, keyValueStore, peopleIndex);
    if (dataSet) {

        const {suggestions, promo, users } = dataSet;
        res.send({ searchedText: text , suggestions, promo, users });
    }
    else{
        res.send({ searchedText: text , suggestions : [], promo: {}, users: [] });
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
