import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

function Square(props){
	return(
		<button className="square " onClick={props.onClick}>
		</button>
	);
}

class Board extends React.Component{

	renderSquare(i){
		return(
			<Square key={i}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render(){
		let squareNum = 0;

		let board = [];

		for( let i = 0; i < 8; ++i){
			let rows = [];

			for(let j = 0; j < 8; ++j){
				rows.push(this.renderSquare(squareNum));
				++squareNum;
			}
			board.push(
				<div key={i} className="board-row">{rows}</div>
			);
		}

		return(
			<div>
				{board}
			</div>
		);
	}
}

class Game extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			history: [{
				squares: Array(64).fill(null),
			}],
			redIsNext: true,
			stepNumber: 0,
			previousPosition: null,
		};
	}

	render()
	{
		const history = this.state.history;
		const current = history[this.state.stepNumber];

		return (
			<div className="game">
				<div className="game-board">
					<Board
						square = {current.squares}
						onClick = {(i) => this.handleClick(i)}
					/>
				</div>
			</div>
		);
	}
}


ReactDOM.render(<Game />, document.getElementById('root'));
registerServiceWorker();
