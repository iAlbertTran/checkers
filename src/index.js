import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

function Square(props){
	let className = "square " + props.value;
	return(
		(props.value == 'R') ?
			<button className={className} onClick={props.onClick}></button> :
			<button className={className}></button>
	);
}

class Board extends React.Component{

	renderSquare(square, row){
		const value = 
			(row % 2) ? 
				(square % 2) ? 'R' : 'B':
				(square % 2) ? 'B' : 'R';

		return(
			<Square key={square}
				onClick={() => this.props.onClick(square)}
				value={value}
			/>
		);
	}

	render(){
		let squareNum = 0;

		let board = [];

		for( let i = 0; i < 8; ++i){
			let rows = [];

			for(let j = 0; j < 8; ++j){
				rows.push(this.renderSquare(squareNum, i));
				++squareNum;
			}
			board.push(
				<div key={i} className="board-row">{rows}</div>
			);
		}

		return(
			<div className="board">
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
