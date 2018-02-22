import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function CheckerPiece(props){


	let value = props.value;
	let classNames = "fas fa-chess-";

	switch(value){
		case 'O':
			classNames += "pawn black-piece piece";
			break;
		case 'X':
			classNames += "pawn red-piece piece";
			break;
		case 'OK':
			classNames += "queen black-piece piece";
			break;
		case 'XK':
			classNames += "queen red-piece piece";
			break;
		default: 
			break;
	}

	if (value){
		return (
			<div>
				<i className={classNames}></i>
				<div className="piece-value">{value}</div>
			</div>
		);
	}

	return null;

}

function Square(props){
	let className = "square " + props.color;

	return(
		(props.color === 'R') ?
			<button className={className} onClick={props.onClick}>
				<CheckerPiece 
					value={props.value}
				/>
			</button> :
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
				squares: Array(64).fill(null).fill('O', 0, 16).fill('X', 48, 64),
				//squares: Array(64).fill(null),

			}],
			redIsNext: true,
			stepNumber: 0,
			movingPiece: null,
			jumpInProgress: false,
		

		};
	}

	jumpTo(step){

	  	this.setState({
	  		stepNumber: step,
	  		redIsNext: (step % 2) === 0,
	  		jumpInProgress: false,
	  		movingPiece: null,
	  	})
 	}

	handleClick(square){
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const movingPiece = this.state.movingPiece;

		let redIsNext = this.state.redIsNext;
		let jump = this.state.jumpInProgress;

		if(calculateWinner(current.squares) )
			return null;

		if ((this.state.redIsNext && (squares[movingPiece] === 'X' || squares[movingPiece] === "XK")) || (!this.state.redIsNext && (squares[movingPiece] === 'O' || squares[movingPiece] === 'OK'))) {	
			const moveResult = legalMove(square, movingPiece, squares[movingPiece], squares, jump);

			if (moveResult[0]){
				squares[square] = squares[movingPiece];

				if([0, 2, 4, 6, 57, 59, 61, 63].indexOf(square) !== -1 && squares[square].length === 1)
					squares[square] += 'K';

				squares[movingPiece] = null;

				redIsNext = !redIsNext;

				if(moveResult[1]){
					squares[moveResult[1]] = null;
					redIsNext = !redIsNext;
					jump = true;
				}
				else{
					square = null;
					jump = false;
				}

				this.setState({
					history: history.concat([{
						squares: squares,
					}]),
					redIsNext: redIsNext,
					stepNumber: history.length,
					movingPiece: square,
					jumpInProgress: jump,
				});
				return null;
			}
		}
		
		if(jump){
			jump = false;
			redIsNext = !redIsNext;
		}

		this.setState({
			movingPiece: square,
			jumpInProgress: jump,
			redIsNext: redIsNext,
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

		let historyList = history.map((boardState, move) => {

			const desc = move ? 
				'Move #' + move :
				'Start';

	    	return (
	    		<li key={move}>
		        	{/* Bolds the most recent move in move history */}
		        	{(move === this.state.stepNumber) ? 
		    			<button className="highlighted" onClick={() => this.jumpTo(move)}>{desc}</button> :
		          		<button onClick={() => this.jumpTo(move)}>{desc}</button>}
	    		</li>
	    	);
		} );

		return (
			<div className="game">
				<div className="game-board">
					{status}
					<Board
						squares = {current.squares}
						onClick = {(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div className="title">Move History</div>
					<ol>{historyList}</ol>
				</div>
			</div>
		);
	}
}


ReactDOM.render(<Game />, document.getElementById('root'));


function legalMove(square, movingPiece, turn, squares, jump){

	//destination square must be empty, otherwise can't move there
	if(squares[square])
		return [null, null];

	const leftEdge = [0, 16, 32, 48];
	const rightEdge = [15, 31, 47, 63];

	const redPieces = ['X', 'XK'];
	const blackPieces = ['O', 'OK'];


	//left and right move. If moving piece is X, moveA = right move, moveB = left move, and vice versa for O
	let moveA = 7;
	let moveB = 9;

	//if jump is being attempted, moveA and moveB are doubled;
	if(square - movingPiece > 10 || movingPiece - square > 10){
		moveA = 14;
		moveB = 18;
	}

	let possibleMoves;
	//generate a list of possible moves depending on what kind of piece is moving
	switch (turn){

		case 'X':
			possibleMoves = [movingPiece - moveB, movingPiece - moveA, null, null];
			break;

		case 'O':
			possibleMoves = [null, null, movingPiece + moveA, movingPiece + moveB];
			break;

		case 'XK':
		case 'OK':
			possibleMoves = [movingPiece - moveB, movingPiece - moveA, movingPiece + moveA, movingPiece + moveB];
			break;
	}

	//corresponds to the space in between the moving piece and its potential destination. Used to check if it has the opponent piece occupying it.
	let spaceInBetween = null;

	//if the attempted move is a jump
	if(square - movingPiece > 10 || movingPiece - square > 10){

		const madeMove = possibleMoves.indexOf(square);

		let spaceCount;

		//destination 'square' must be a possible move of moving piece
		switch(madeMove){

			case 0:
			case 1:
				spaceCount = (movingPiece - square) / 2;
				spaceInBetween = movingPiece - spaceCount;
				break;

			case 2:
			case 3:
				spaceCount = (square - movingPiece) / 2;
				spaceInBetween = movingPiece + spaceCount;
				break;

			default:
				return [null, null];
		}

		//the piece in bteween must be an opponent piece
		switch (turn){
			case 'X':
			case 'XK':
				if(blackPieces.includes(squares[spaceInBetween]))
					break;

			case 'O':
			case 'OK':
				if(redPieces.includes(squares[spaceInBetween]))
					break;

			default:
				return [null, null];

		}

	}

	if(jump && !spaceInBetween){
		return [null, null];
	}

	//if moving piece is on the left edge of board, only allows right moves [1] [3]
	if(leftEdge.includes(movingPiece) && (possibleMoves[1] === square || possibleMoves[3] === square))
		return [true, spaceInBetween];

	//if moving piece is on the right edge of board, only allows left moves [0] [2]
	if(rightEdge.includes(movingPiece) && (possibleMoves[0] === square || possibleMoves[2] === square))
		return [true, spaceInBetween];

	//else piece can move right or left
	if(possibleMoves.includes(square))
		return [true, spaceInBetween];

	return [null, null];
}

function calculateWinner(squares){
	let red = 0;
	let black = 0;
	for( let i = 0; i < squares.length; ++i){
		if(squares[i] === 'X' || squares[i] === 'XK')
			++red;
		if(squares[i] === 'O' || squares[i] === 'OK')
			++black;
	}

	if(black && red === 8)
		return 'Winner: Black!';
	if(red && black === 8)
		return 'Winner: Red!';

	return false;
}
