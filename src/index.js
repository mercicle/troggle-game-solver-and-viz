
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './App.css';
import logo from './rstudio-logo.png';

import d3 from 'd3';
import _ from 'underscore';

const matrix_rank = 2;
const total_letters = matrix_rank * matrix_rank;
const space = _.range(matrix_rank);

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

const get_random_letter = (in_alphabet) => {
	return in_alphabet[_.random(0, in_alphabet.length-1)]
}

const get_random_board = (size) => {
	return  _.map(_.range(size), function(){return get_random_letter(alphabet)})
}

class Square extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  // thanks to
  //https://stackoverflow.com/questions/38394015/how-to-pass-data-from-child-component-to-its-parent-in-reactjs

  handleChange(event) {
     this.props.sendData(this.props.id, event.target.value);
  }
 
  render() {
    return (
      <input className="square" 
              type="text" 
              name="square"
              value={this.props.value} 
              onChange={ this.handleChange }> 
      </input>
    );
  }
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      squares: get_random_board(total_letters),
    };

    this.renderSquare = this.renderSquare.bind(this);
    this.getData = this.getData.bind(this);

  }

  getData(i, new_letter){
	    const squares = this.state.squares.slice(); // copy to respect immutability
	    squares[i] = new_letter;
	    this.setState({squares: squares});
  }
 
  renderSquare(i) {
    return (
      <Square value={this.state.squares[i]} 
        	  key = {i} 
        	  id = {i} // for ease in Square handleChange
        	  sendData={this.getData} />
    );
  }

  render() {

    const status = 'Unsolved';
    return (
      <div className="boardContainer">
        <div className="status">{status}</div>
        { /* Iteration through rows and append Square column elements 
             dynamically based on global parms */ 
        }
        {space.map(function(i){
        	 
        	return <div className="board-row" key={ "r"+i}> 
        			{space.map(function(j){ 
        				  
        				var temp_vector_index  =  i * matrix_rank + j;
        				return this.renderSquare(temp_vector_index)

        			  }, this)
        		     }
        		    </div>
        	 
         }, this)}
        
      </div>
    );
 
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="App-Container">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">RStudio Challenge</h1>
        </header>
	      <div className="game">
	        <div className="game-board">
	          <Board />
	        </div>
	        <div className="game-info">
	          <div>{/* status */}</div>
	          <ol>{/* TODO */}</ol>
	        </div>
	      </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
