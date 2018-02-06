import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
	let className = "square " + props.color;
	return(
		(props.color === 'R') ?
			<button className={className} onClick={props.onClick}>{props.value}</button> :
			<button className={className} onClick={props.onClick}></button>
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
				squares: Array(64).fill('O', 0, 16).fill('X', 48, 64).fill(null, 16, 48),
				//squares: Array(64).fill(null),

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
		const moveResult = legalMove(square, movingPiece, squares[movingPiece], squares);
		
		if(calculateWinner(current.squares))
			return null;

		else if (moveResult[0]) {	
			squares[square] = squares[movingPiece];
			squares[movingPiece] = null;

			if(moveResult[1])
				squares[moveResult[1]] = null;

			this.setState({
				history: history.concat([{
					squares: squares,
				}]),
				redIsNext: !this.state.redIsNext,
				stepNumber: history.length,
				movingPiece: square,
			});
			return null;
		}

		this.setState({
				movingPiece: square,
				moveInProgress: true,
			});

		return null;

	}

	render()
	{
		const history = this.state.history;
		const current = history[this.state.stepNumber];

		//for ( let i = 0; i < current.squares.length; ++i){
		//	current.squares[i] = i;
		//}

		let status;
		const winner = calculateWinner(current.squares);

		if(winner)
			status = winner;
		else
			status = this.state.redIsNext ? 'Making Move: Red' : 'Making Move: Black';

		return (
			<div className="game">
				<div className="game-board">
					{status}
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


function legalMove(square, movingPiece, turn, squares){
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

	const blackOverRed = [
		[0, null, 18],
		[2, 16, 20],
		[4, 18, 22],
		[6, 20, null],
		[9, null, 27],
		[11, 25, 29],
		[13, 27, 31],
		[15, 29, null],
		[16, null, 34],
		[18, 32, 36],
		[20, 34, 38],
		[22, 36, null],
		[25, null, 43],
		[27, 41, 45],
		[29, 43, 47],
		[31, 45, null],
		[32, null, 50],
		[34, 48, 52],
		[36, 50, 54],
		[38, 52, null],
		[41, null, 59],
		[43, 57, 61],
		[45, 59, 63],
		[47, 61, null],
	];

	const redOverBlack = [
		[63, 45, null],
		[61, 43, 47],
		[59, 41, 45],
		[57, null, 43],
		[54, 36, null],
		[52, 34, 38],
		[50, 32, 36],
		[48, null, 34],
		[47, 29, null],
		[45, 27, 31],
		[43, 25, 29],
		[41, null, 27],
		[38, 20, null],
		[36, 18, 22],
		[34, 16, 20],
		[32, null, 18],
		[31, 13, null],
		[29, 11, 15],
		[27, 9, 13],
		[25, null, 11],
		[22, 4, null],
		[20, 2, 6],
		[18, 0, 4],
		[16, null, 2],
	];

	if (turn === 'O'){
		for (let i = 0; i < blackAllowed.length; ++i){
			const [moving, left, right] = blackAllowed[i];
			if(moving === movingPiece && ((left === square && squares[left] === null) || (right === square && squares[right] === null) ))
				return [true, null];
		}

		for (let i = 0; i < blackOverRed.length; ++i){
			const [moving, left, right] = blackOverRed[i];
			if(moving === movingPiece){
				if(left === square && squares[left - 7] === "X" && squares[left] === null) 
					return [true, left - 7];
				if(right === square && squares[right - 9] === 'X' && squares[right] === null)
					return [true, right - 9]; 
			}
		}
	}
	else if (turn === 'X'){
		for (let i = 0; i < redAllowed.length; ++i){
			const [moving, left, right] = redAllowed[i];
			if(moving === movingPiece && ((left === square && squares[left] === null) || (right === square && squares[right] === null)) )
				return [true, null];
		}

		for (let i = 0; i < redOverBlack.length; ++i){
			const [moving, left, right] = redOverBlack[i];
			if(moving === movingPiece){ 
				if (left === square && squares[left + 9] === "O" && squares[left] === null) 
					return [true, left + 9];
				if (right === square && squares[right + 7] === 'O' && squares[right] === null)
					return [true, right + 7];
			}
		}

	}
	return false;
}

function calculateWinner(squares){
	let red = 0;
	let black = 0;
	for( let i = 0; i < squares.length; ++i){
		if(squares[i] === 'X')
			++red;
		if(squares[i] === 'O')
			++black;
	}
	console.log(black);
	console.log(red);
	if(black && red === 8)
		return 'Winner: Black!';
	if(red && black === 8)
		return 'Winner: Red!';

	return false;
}
