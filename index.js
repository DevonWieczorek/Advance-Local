import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import * as serviceWorker from './serviceWorker';
import './index.css';

const makeID = (name) =>{
    return name.toLowerCase().replace(' ', '') + parseInt(Math.random() * 1000);
}

const capitalize = (string) => {
  if (typeof string !== 'string') return '';
  return string.split(' ').map(function(s){
      return s.charAt(0).toUpperCase() + s.slice(1);
  }).join(' ');
}


const Header = () => (
    <header className="my-3">
        <center>
            <h1>Strange Universe</h1>
        </center>
    </header>
);

const Intro = () => (
    <div className="pr-3 pl-3 mb-5">
        <center>
            <p className="lead">
                It's a strange universe out there!<br />
                Take a look at some of the MANY species that we've found so far!
            </p>
        </center>
    </div>
);

const Footer = () => (
    <footer className="px-5 py-3 text-muted">
        <center>
            Devon Wieczorek &middot; <a className="text-muted" href="mailto:devon.wieczorek@icloud.com">Devon.Wieczorek@iCloud.com</a> &middot; <a className="text-muted" href="tel:2015277400">(201) 527-7400</a>
        </center>
    </footer>
);

const TableCard = (props) => (
    <Card id={props.id} key={props.key} className="card col-xs-6 mb-2">
        <Card.Header>{capitalize(props.header)}</Card.Header>
        <Card.Body>
            <Table className="card-table table">
                <tbody>
                    {props.rows.map((row, index) => (
                        <tr key={index}>
                            <td><strong>{capitalize(Object.keys(row)[0])}: </strong></td>
                            <td>{capitalize(Object.values(row)[0])}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card.Body>
    </Card>
);

class StarWars extends Component{

    state = { creatures: [] }

    getStarWarsCreatures = () => {
        return new Promise(function(resolve, reject){
            fetch('https://swapi.co/api/species/?limit=10')
                .then(res => res.json())
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }

    componentDidMount(){
        this.getStarWarsCreatures()
            .then((creatures) => {
                this.setState({creatures: creatures.results})
            })
            .catch((err) => { console.error(err) });
    }

    render(){
        return(
            <div id="star-wars">{
                this.state.creatures.map(c => (
                    <TableCard
                        id={makeID(c.name)}
                        key={makeID(c.name)}
                        header={c.name}
                        rows={[
                            {'name': c.name},
                            {'classification': c.classification},
                            {'designation': c.designation},
                            {'average height': c.average_height},
                            {'average lifespan': c.average_lifespan},
                            {'language': c.language}
                        ]}
                    />
                ))
            }</div>
        );
    }
}

class Pokemon extends Component{

    state = { pokemon: [] }

    getAllPokemonSpecies = () => {
        return new Promise(function(resolve, reject){
            fetch('https://pokeapi.co/api/v2/pokemon-species/?limit=10')
                .then(res => res.json())
                .then(function(res){ resolve(res) })
                .catch(function(err){ reject(err) });
        })
    }

    getSinglePokemon = (url) => {
        return new Promise(function(resolve, reject){
            fetch(url)
                .then(res => res.json())
                .then(function(res){ resolve(res) })
                .catch(function(err){ reject(err) });
        })
    }

    getAllPokemonInfo = (pokePromises) => {
        return new Promise(function(resolve, reject){
            Promise.all(pokePromises)
                .then(function(res){ resolve(res) })
                .catch(function(err){
                    console.error(err);
                    reject(err);
                });
        })
    }

    componentDidMount(){
        this.getAllPokemonSpecies()
            .then(async (species) => {
                var pokePromises = [];
                for(var s in species.results){
                    pokePromises.push(this.getSinglePokemon(species.results[s].url))
                }
                var pokedex = await this.getAllPokemonInfo(pokePromises);
                this.setState({pokemon: pokedex});
            })
            .catch((err) => console.error(err));
    }

    render(){
        return(
            <div id="pokemon">{
                this.state.pokemon.map(p => (
                    <TableCard
                        id={makeID(p.name)}
                        key={makeID(p.name)}
                        header={p.name}
                        rows={[
                            {'name': p.name},
                            {'shape': p.shape},
                            {'habitat': p.habitat},
                            {'base happiness': p.base_happiness},
                            {'capture rate': p.capture_rate},
                            {'generation': p.generation}
                        ]}
                    />
                ))
            }</div>
        );
    }
}

class App extends Component{
    render(){
        return(
            <div className="container-fluid bg-light">
                <Header />
                <Intro />
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xs-12 col-md-6 mt-2">
                                <h3>Star Wars</h3>
                                <StarWars />
                            </div>
                            <div className="col-xs-12 col-md-6 mt-2">
                                <h3>Pokemon</h3>
                                <Pokemon />
                            </div>
                        </div>
                    </div>
                <Footer />
            </div>

        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
