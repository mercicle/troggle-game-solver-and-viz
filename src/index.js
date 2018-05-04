
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './App.css';
import logo from './rstudio-logo.png';

import d3 from 'd3';
import _ from 'underscore';

const matrix_rank = 2;
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

const get_random_letter = (in_alphabet) => {
	return in_alphabet[_.random(0, in_alphabet.length-1)]
}

class Square extends React.Component {
  render() {
    return (
      <input className="square" type="text" value={this.props.value}></input>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square />;
  }

  render() {

    const status = 'Next player: X';
    const space = _.range(matrix_rank);
    var cell_index = 0 ;

    return (
      <div className="boardContainer">
        <div className="status">{status}</div>
        {space.map(function(i){
        	return <div className="board-row"> 
        			{space.map(function(j){ 
        				cell_index +=1;
        				var temp_char = get_random_letter(alphabet)
        				return <Square value={temp_char} key = {cell_index} />; })
        		     }
        		    </div>
        	 
         })}
        
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
