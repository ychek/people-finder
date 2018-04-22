'use strict';

const helpers = require('./helpers');

// Create a key value store in memory (id -> personObject)
const createKeyValueStore = (db) => {

    const keyValueStore = {};

    for (let i = 0; i < db.length; i++) {
        const person = db[i];
        const id = person.id;
        keyValueStore[id] = person
    }

    return keyValueStore

};

// Create an index on people names:
// firstname, lastname, firstname + lastname, lastname + firstname
// name -> id of the data in the key value store
const createIndex = (db) => {

    const bigIndex = {};

    for (let i = 0; i < db.length; i++) {
        const person = db[i];

        const firstlastname = person.firstName + ' ' + person.lastName;
        const lastfirstname = person.lastName + ' ' + person.firstName;
        const id = person.id;

        bigIndex[firstlastname.toLowerCase()] = id;
        bigIndex[lastfirstname.toLowerCase()] = id;
    }

    return bigIndex

};

const loadIndexToTrie = (index, trie) => {

    for (const key of Object.keys(index)) {
        trie.insert(key);
    }
};


const searchForData = (query, trie, keyValueStore, peopleIndex) => {
    let matches = query === '' ? trie.listAllWordsInTheTrie() : trie.listWordsStartingWith(query);

    if (matches.length === 0) {
        return null
    }

    const peopleIds = [];

    const seenPeopleIds = new Set();

    for (let i = 0; i < matches.length; i++) {
        const name = matches[i];
        const personId = peopleIndex[name];

        // search if in the set is O(1) so better for performance
        if (!seenPeopleIds.has(personId)) {
            seenPeopleIds.add(personId);
            peopleIds.push(personId)
        }

    }

    const users = [];
    let promo = {};
    const suggestions = [];

    for (let i = 0; i < peopleIds.length; i++) {

        const personId = peopleIds[i];
        const user = keyValueStore[personId];

        if (i === 0) {
            promo = user
        }

        if (i < 10) {
            suggestions.push(helpers.toTitleCase(user.firstName) + ' ' + helpers.toTitleCase(user.lastName))
        }

        const { id, firstName, lastName, gender, email, avatar } = user;
        users.push({ id, firstName, lastName, gender, email, avatar })

    }

    return { users, promo, suggestions }

};

module.exports = { createKeyValueStore, createIndex, loadIndexToTrie, searchForData };