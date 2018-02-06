import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
	let className = "square " + props.color;
	return(
		(props.color === 'R') ?
			<button className={className} onClick={props.onClick}>{props.value}</button> :
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
				value={this.props.squares[square]}
				color={value}
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
				squares: Array(64).fill('O', 0, 16).fill('X', 48, 64),

			}],
			redIsNext: true,
			stepNumber: 0,
			movingPiece: null,
			moveInProgress: false,
		};
	}

	handleClick(square){

		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const movingPiece = this.state.movingPiece;
		if(!this.state.moveInProgress){

			this.setState({
				moveInProgress: !this.state.moveInProgress,
				movingPiece: square,
			});

			return null;
		}

		if(this.state.movingPiece === square){

			this.setState({
				moveInProgress: !this.state.moveInProgress,
				movingPiece: null,
			});

			return null;
		}

		if (legalMove(square, movingPiece, squares[movingPiece])) {	
			squares[square] = squares[movingPiece];
			squares[movingPiece] = null;

			this.setState({
				history: history.concat([{
					squares: squares,
				}]),
				redIsNext: !this.state.redIsNext,
				stepNumber: history.length,
				movingPiece: null,
				moveInProgress: !this.state.moveInProgress,
			});

			return null;
		}

		this.setState({
				movingPiece: null,
				moveInProgress: !this.state.moveInProgress,
			});

	}

	render()
	{
		const history = this.state.history;
		const current = history[this.state.stepNumber];

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares = {current.squares}
						onClick = {(i) => this.handleClick(i)}
					/>
				</div>
			</div>
		);
	}
}


ReactDOM.render(<Game />, document.getElementById('root'));


function legalMove(square, movingPiece, turn){
	const blackAllowed = [
		[0, null, 9],
		[2, 9, 11],
		[4, 11, 13],
		[6, 13, 15],
		[9, 16, 18],
		[11, 18, 20],
		[13, 20, 22],
		[15, 22, null],
		[16, null, 25],
		[18, 25, 27],
		[20, 27, 29],
		[22, 29, 31],
		[25, 32, 34],
		[27, 34, 36],
		[29, 36, 38],
		[31, 38, null],
		[32, null, 41],
		[34, 41, 43],
		[36, 43, 45],
		[38, 45, 47],
		[41, 48, 50],
		[43, 50, 52],
		[45, 52, 54],
		[47, 54, null],
		[48, null, 57],
		[50, 57, 59],
		[52, 59, 61],
		[54, 61, 63]
	];

	const redAllowed = [
		[63, 54, null],
		[61, 52, 54],
		[59, 50, 52],
		[57, 48, 50],
		[54, 45, 47],
		[52, 43, 45],
		[50, 41, 43],
		[48, null, 41],
		[47, 38, null],
		[45, 36, 38],
		[43, 34, 36],
		[41, 32, 34],
		[38, 29, 31],
		[36, 27, 29],
		[34, 25, 27],
		[32, null, 25],
		[31, 22, null],
		[29, 20, 22],
		[27, 18, 20],
		[25, 16, 18],
		[22, 13, 15],
		[20, 11, 13],
		[18, 9, 11],
		[16, null, 9],
		[15, 6, null],
		[13, 4, 6],
		[11, 2, 4],
		[9, 0, 2]
	];

	if(turn === 'O'){
		for (let i = 0; i < blackAllowed.length; ++i){
			const [moving, left, right] = blackAllowed[i];
			if(moving === movingPiece && (left === square || right === square))
				return true;
		}
	}
}
