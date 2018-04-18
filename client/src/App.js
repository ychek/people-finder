import React, { Component } from 'react';

import './App.css';

class App extends Component {
    constructor() {
        super();
        this._lastRequestNumber = 0;
        this.state = {
            people : [],
            searchedText: ''
        };
    }

    componentDidMount() {
        this.callApi("all", this._lastRequestNumber)
            .then(res => this.setState({people: res.data, searchedText: res.text}))
            .catch(err => console.log(err));
    }

    callApi = async (query, num) => {
        const response = await fetch(`/api/users?q=${query}&n=${num.toString()}`);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };


    _autosearch(event) {
        console.log("Changes occurs in the text input");
        const inputElement = this._input;
        const textToSearch = inputElement.value.trim();
        if (textToSearch) {
            const lastRequestNum = ++this._lastRequestNumber;
            this.callApi(textToSearch, lastRequestNum)




                .then(res => {
                    // update the state with the 'response' to most recent request sent
                    if (parseInt(res.num, 10) === lastRequestNum) {
                        this.setState({people: res.data, searchedText: res.text})
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


