'use strict';

// Represent a node in the trie
class Node {

    constructor(key, parent=null, terminates=false) {
        this.key = key;
        this.terminates = false; // the char is the end of a word
        this.parent = parent;
        this.children = new Map();
    }
}


// Trie (Prefix Tree) data structure
class Trie {

    constructor(){
        this.root = new Node('');

    }

    // Insert word into the trie
    insert(word) {

        if (!word) {
            throw "word can't be 'undefined', 'null' or 'empty string'";
        }
        let node = this.root;

        for (let i = 0; i < word.length; i++){
            const char = word[i];

            if (node.children.get(char)) {
                node = node.children.get(char);

            } else {

                node.children.set(char, new Node(char, node));
                node = node.children.get(char);
            }

        }
        node.terminates = true;
    }


    // Search for a prefix or a whole key in the trie and return a node reference where the search ends
    searchPrefix(word) {
        if (!word) {
            throw "word can't be 'undefined', 'null' or 'empty string'";
        }

        let node = this.root;

        for (let i = 0; i < word.length; i++){
            const char = word[i];

            if (node.children.get(char)) {
                node = node.children.get(char);
            } else {
                return null;
            }
        }

        return node;

    }

    // Search if an exact word is in the trie. (if the word is terminating)
    containsExactWord(word) {

        const node = this.searchPrefix(word);
        return node != null && node.terminates

    }

    // Return an array with all whole words (terminating words) in the trie starting with 'prefix' string.
    listWordsStartingWith(prefix) {

        const node = this.searchPrefix(prefix);

        if (node === null) {

            return []

        }

        const result = [];

        if (node.terminates) {

            result.push(prefix)
        }

        this._listWords(node, prefix, result);


        return result


    }


    // Return an array with all whole words (terminating words) in the trie.
    listAllWordsInTheTrie() {

        const result = [];
        const currWord = '';
        this._listWords(this.root, currWord, result);
        return result

    }

    // pre-order traversal
    _listWords(node, currWord, result) {

        if (!node) {
            return
        }

        for (let [key, child] of node.children) {
            if (child.terminates) {
                result.push(currWord + key);
            }
            this._listWords(child, currWord + key, result)
        }

    }


}

module.exports = { Node, Trie };
