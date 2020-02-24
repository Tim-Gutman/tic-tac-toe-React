import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} id={props.id}>{/*5.4 给button id*/}
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        id={"but" + i}//5.3往Square组件传id
      />
    );
  }

  render() {
  	var rows = [];
    for (let i = 0; i < 3; i++) {
       var cols = [];
       for (let j = 0; j < 3; j++) {
       	 cols.push(this.renderSquare(3 * i + j));
       }
       rows.push(<div className="board-row">{cols}</div>);
    }//3.2创建棋盘数组

    return (
      <div>
        {/*<div className="board-row">
                  {this.renderSquare(0)}
                  {this.renderSquare(1)}
                  {this.renderSquare(2)}
                </div>
                <div className="board-row">
                  {this.renderSquare(3)}
                  {this.renderSquare(4)}
                  {this.renderSquare(5)}
                </div>
                <div className="board-row">
                  {this.renderSquare(6)}
                  {this.renderSquare(7)}
                  {this.renderSquare(8)}
                </div> 3.1注销原有的棋盘*/}
        {rows}{/*3.3将棋盘数组放入渲染函数*/}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: null//1.1新增location状态，默认为null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: "col" + (i % 3 + 1) + ", row" + (~~(i / 3) + 1)//1.2更新location的值，~~取整运算有数值大小限制
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });

  }

  jumpTo(step) {
  	document.getElementById(this.state.stepNumber).style.fontWeight = "normal";//2.3上个step对应的按钮正常化。注意如果棋盘的按钮被有效点击后，上次加粗的按钮不会被正常化，个人认为这样更符合需求
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
    document.getElementById(step).style.fontWeight = "bold";//2.2加粗点击的按钮
    if (calculateWinner(this.state.history[this.state.stepNumber].squares)) {
      for (let i = 0; i < 9; i++) {
      	document.getElementById("but" + i).style.border = "1px solid #999";
      }
    }//5.5消除高亮
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ": "+ history[move].location://1.3在步骤button中加入loaction的值
        'Go to game start';

      return (
        <li key={move}>
          <button id={move} onClick={() => this.jumpTo(move)}>{desc}</button>{/*2.1给每个按钮添加id*/}
        </li>
      );
    });

    

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === 9) {
      status = "Draw for both"; //6.1添加和局判断
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      boldSquare(lines[i]);	//5.1应用高亮函数
      return squares[a];
    }
  }
  return null;
}

function boldSquare(arr) {
  for (let i = 0; i < arr.length; i++) {
  	document.getElementById("but" + arr[i]).style.border = "2px solid #999";
  }
}//5.2创建高亮函数