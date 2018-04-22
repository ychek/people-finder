import React, { Component } from 'react';
import './App.css';
import './assets/react-toolbox/theme.css';
import theme from './assets/react-toolbox/theme.js';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import Button from 'react-toolbox/lib/button/Button';
import Autocomplete from 'react-toolbox/lib/autocomplete/Autocomplete';
import List from 'react-toolbox/lib/list/List';
import ListItem from 'react-toolbox/lib/list/ListItem';
import Card from 'react-toolbox/lib/card/Card';
import CardMedia from 'react-toolbox/lib/card/CardMedia';
import CardTitle from 'react-toolbox/lib/card/CardTitle';
import CardText from 'react-toolbox/lib/card/CardText';

const dummyText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.';


class App extends Component {
    constructor() {
        super();
        this._autosearch = this._autosearch.bind(this);
        this.state = {
            inputValue: '',
            people : [],
            suggestions: [],
            promo : {}
        };
    }

    componentDidMount() {
        this.callApi("")
            .then(res => this.setState({
                people: res.users,
                suggestions: res.suggestions,
                promo: res.promo
            }))
            .catch(err => console.log(err));
    }

    callApi = async (query) => {
        const response = await fetch(`/api/search?q=${query}`);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };


    _autosearch(inputText) {
        this.setState({inputValue: inputText});

        if (inputText) {
            this.callApi(inputText.toLowerCase())

                .then(res => {
                    // because request are async we don't know which of the responses will come first or last, so we accept only the request that the response match the input
                    if (res.searchedText === this.state.inputValue.toLowerCase()) {
                        this.setState({
                            people: res.users,
                            suggestions: res.suggestions,
                            promo: res.promo
                        })
                    }
                })
                .catch(err => console.log(err));
        }


    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div className="App">
                    <header className="App-header">
                        <div className="App-title">People search</div>
                    </header>
                    <div className="Search-box">
                        <div className="Search-input">
                            <Autocomplete

                                direction="down"
                                label="Search for people..."
                                multiple={false}
                                source={this.state.suggestions}
                                suggestionMatch="word"
                                value={this.state.inputValue}
                                onQueryChange={this._autosearch}
                                onChange={this._autosearch}
                            />
                        </div>
                        <div className="Search-button">
                            <Button label="Search" raised primary/>
                        </div>

                    </div>
                    <div className="Result-box">
                        <Peoplebox people={this.state.people} />
                        <Promo data={this.state.promo}/>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

class Promo extends React.Component {

    render() {
        if (Object.keys(this.props.data).length !== 0) {

            return <div className="Promo-box">
                <Card style={{width: '350px'}}>
                    <CardTitle
                        avatar={this.props.data.avatar}
                        title={`${this.props.data.firstName} ${this.props.data.lastName}`}
                        subtitle={this.props.data.gender}
                    />
                    <CardMedia
                        aspectRatio="wide"
                        image="https://placeimg.com/800/450/nature"
                    />
                    <CardTitle
                        title={this.props.data.email}
                        subtitle={this.props.data.description}
                    />
                    <CardText>{dummyText}</CardText>
                </Card>
            </div>;

        } else {

            return null;
        }

    }
}


class Peoplebox extends React.Component {

    _getPeople() {

        return this.props.people.map((person, idx) =>
            <Card key={idx} className="Person-card">
                <ListItem
                    avatar={person.avatar}
                    caption={`${person.firstName} ${person.lastName}`}
                    legend={`${person.gender}, ${person.email}`}
                />
            </Card>

        )
    }

    render() {

        const persons = this._getPeople();

        if (persons.length === 0) {
            return null
        }

        return <div className="People-box">
            <List ripple>
                {persons}
            </List>
        </div>
    }


}

export default App;


