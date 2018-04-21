import React, { Component } from 'react';

import './App.css';

class App extends Component {
    constructor() {
        super();
        this._lastRequestSearch = 0;
        this.state = {
            people : [],
            searchedText: ''
        };
    }

    componentDidMount() {
        this.callApi("")
            .then(res => this.setState({people: res.data, searchedText: res.text}))
            .catch(err => console.log(err));
    }

    callApi = async (query) => {
        const response = await fetch(`/api/search?q=${query}`);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };


    _autosearch(event) {
        console.log("Changes occurs in the text input");
        const inputElement = this._input;
        const textToSearch = inputElement.value.toLowerCase();
        if (textToSearch) {
            const lastRequestText = textToSearch;
            this.callApi(textToSearch)




                .then(res => {
                    // because request are async we don't know which of the responses will come last, so we check that the response match the input
                    if (res.searchedText === lastRequestText) {
                        this.setState({people: res.data, searchedText: res.searchedText})
                    }
                })
                .catch(err => console.log(err));
        }


    }

    _buttonSearch(event) {
        // TODO: show the promo image with the first one.
        console.log("search button clicked")

    }


    _submit(event) {
        event.preventDefault();

    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">People search</h1>
                </header>
                <div className="App-intro">Searched text: {this.state.searchedText}</div>
                <div className="App-intro">{this.state.data}</div>
                <form onSubmit={this._submit.bind(this)}>
                    <input type="text" onChange={this._autosearch.bind(this)} ref={(input) => this._input = input}/>
                    <button type="submit" onClick={this._buttonSearch.bind(this)}>Search</button>
                </form>
            </div>
        );
    }
}

export default App;


