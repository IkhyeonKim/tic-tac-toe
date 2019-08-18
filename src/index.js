import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// class Square extends React.Component {
//     render() {
//         return (
//         <button className="square" 
//         onClick={ () => { this.props.onClick() }}
//         >
//         {this.props.value}
//         </button>
//         );
//     }
// }

function Square(props) {

    const winningSquareStyle = {
        backgroundColor: '#777'
    };
    
    return (
        <button className="square" onClick={props.onClick} style={props.winningSquare ? winningSquareStyle : null}>
            {props.value}
        </button>
    )
}



class Board extends React.Component {

    renderSquare(i) {
        let winningSquare = this.props.winner.winner && this.props.winner.winningRow.includes(i) ? true : false
        return (<Square 
        value={this.props.squares[i]} 
        onClick={ () => {this.props.onClick(i)} }
        key={i}
        winningSquare={winningSquare}
        />
        )
    }

    createBoard() {
        let board = []
        let index = 0

        for(let i = 0; i < 3; i++){
            // row
            let singleRow = []
            for(let j = 0; j < 3; j++){
                // col
                singleRow.push(this.renderSquare(index++))
            }
            board.push(<div className="board-row" key={index} >{singleRow}</div>)
        }
        return board
    }

    render() {
        return (
            <div>
                {this.createBoard()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[this.state.stepNumber]
        
        const squares = current.squares.slice(); // To create a copy of the squares array to modify instead of modifying the existing array.
        

        if(calculateWinner(squares).winner || squares[i]){
            // ignoring a click if someone has won the game
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({ 
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
         })
    }

    jumpTo(step) {

        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })

    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.stepNumber !== prevState.stepNumber){
            console.log('update')
        }
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        
        const moves = history.map( (step, move) => {
            const desc = move ? 
            'Go to move #' + move :
            `Go to game start`

            return (
                <li key={move} >
                    <button className="button__steps" onClick={ () => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        })
        console.log('current: ', current)
        console.log('history: ', history)
        
        let status
        if(winner.winner){
            status = "Winner: " + winner.winner;
        }else {
            if(isDraw(current.squares)){
                // when the result is a draw
                status = "Draw!"
            }else{
                status = "Next player: " + (this.state.xIsNext ? "X" : "O")
            }            
        }
        // if(this.state.stepNumber === 0){
        //     moves = <li key={0} >
        //                 <button className="button__steps" onClick={ () => this.jumpTo(0)}>
        //                     {`Go to game start`}
        //                 </button>
        //             </li>
        // }

        // for(let i = 0; i< this.state.stepNumber; i++){

        //     let desc
        //     if(i === 0){
        //         desc = `Go to game start`
        //     }else {
        //         desc = 'Go to move #' + i
        //     }

        //     moves.push(
        //         <li key={i} >
        //             <button className="button__steps" onClick={ () => this.jumpTo(i)}>
        //                 {desc}
        //             </button>
        //         </li>
        //     ) 
               
        // }


        return (
        <div className="game">
            <div className="game-info">
                <div className="game-info__status">{status}</div>
                <ol className="game-info__list">{moves}</ol>
            </div>
            <div className="game-board">
            <Board
                winner={winner}
                squares={current.squares}
                onClick={ (i) => this.handleClick(i)}
            />
            </div>
        </div>
        );
    }
}

function isDraw(squares){
    if(!squares.includes(null)){
        return true
    }else{
        return false
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for(let i = 0; i < lines.length; i++){
        
        const [a, b, c] = lines[i] // [a,b,c] = [0,1,2] ... [2,4,6]
        
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            // squares[a] && squares[a] <- to check if it's empty(null)
            return {winner: squares[a], winningRow: [a,b,c]}
            //return squares[a]
        }
    }
    return {winner: null, winningRow: null}
    //return null
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
