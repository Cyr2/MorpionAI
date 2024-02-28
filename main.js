let currentPlayer = 'X';
let gameOver = false;

let game = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

displayGame();

function move(row, col) {
  if(game[row][col] === '') {
    game[row][col] = currentPlayer;

    displayGame();

    if(checkWin(currentPlayer)) {
      alert(`Player ${currentPlayer} wins!`);
      gameOver = true;
    } else if(checkDraw()) {
      alert('It\'s a draw!');
      gameOver = true;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }


    if(currentPlayer === 'O' && !gameOver) {
      aiSentence();
    };
  };
};

function checkWin(player) {
  for(let row = 0; row < 3; row++) {
    if(game[row][0] === player && game[row][1] === player && game[row][2] === player) {
      return true;
    };
  };
  for(let col = 0; col < 3; col++) {
    if(game[0][col] === player && game[1][col] === player && game[2][col] === player) {
      return true;
    };
  };
  if(game[0][0] === player && game[1][1] === player && game[2][2] === player) {
    return true;
  };
  if(game[0][2] === player && game[1][1] === player && game[2][0] === player) {
    return true;
  };
};

function checkDraw() {
  for(let row = 0; row < 3; row++) {
    for(let col = 0; col < 3; col++) {
      if(game[row][col] === '') {
        return false;
      };
    };
  };
  return true;
};

function displayGame() {
  for(let row = 0; row < 3; row++) {
    for(let col = 0; col < 3; col++) {
      const cell = document.getElementById(`cell-${row}-${col}`);
      cell.innerText = game[row][col];

      if (!cell.clickEvent) {
        cell.clickEvent = ()=> { move(row, col); };
        cell.addEventListener('click', cell.clickEvent);
      }
    };
  };
};

function resetGame() {
  game = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  currentPlayer = 'X';
  gameOver = false;
  displayGame();
};

document.querySelector('.reset').addEventListener('click', resetGame);




// AI

function aiSentence() {
  const listMove = [];
  for(let i = 0; i<100; i++) {
    const testGame = JSON.parse(JSON.stringify(game));
    listMove.push({score: 0, move: []})
    let tempPlayer = currentPlayer;
    while(true) {
      while(true) {
        let row = Math.floor(Math.random() * 3);
        let col = Math.floor(Math.random() * 3);
        if (testGame[row][col] === '') {
          testGame[row][col] = tempPlayer;
          listMove[i].move.push([row, col]);
          break;
        }
      }
      if(aiCheckWin(tempPlayer, testGame)) {
        listMove[i].score = tempPlayer === currentPlayer ? 2 : -2;
        break;
      } else {
        if(aiCheckDraw(testGame)) {
          listMove[i].score = 1;
          break;
        }
      }
      tempPlayer = tempPlayer === 'X' ? 'O' : 'X';
    }
  }
  bestSentence(listMove);
}

function aiCheckWin(player, newGame){
  for(let row = 0; row < 3; row++) {
    if(newGame[row][0] === player && newGame[row][1] === player && newGame[row][2] === player) {
      return true;
    };
  };
  for(let col = 0; col < 3; col++) {
    if(newGame[0][col] === player && newGame[1][col] === player && newGame[2][col] === player) {
      return true;
    };
  };
  if(newGame[0][0] === player && newGame[1][1] === player && newGame[2][2] === player) {
    return true;
  };
  if(newGame[0][2] === player && newGame[1][1] === player && newGame[2][0] === player) {
    return true;
  };
}

function aiCheckDraw(newGame) {
  for(let row = 0; row < 3; row++) {
    for(let col = 0; col < 3; col++) {
      if(newGame[row][col] === '') {
        return false;
      };
    };
  };
  return true;
}

function bestSentence(sentence) {
  const bestMoves = []; 
  let high = sentence[0].score;
  for(let i = 1; i < sentence.length; i++) {
    if(sentence[i].score > high) {
      high = sentence[i].score;
    }
  };
  for(let i = 0; i < sentence.length; i++) {
    if(sentence[i].score === high) {
      bestMoves.push(sentence[i].move);
    }
  }

  findShortestMove(bestMoves);
}

function findShortestMove(sentence) {
  let shortest = sentence[0];
  for(let i = 1; i < sentence.length; i++) {
    if(sentence[i].length < shortest.length) {
      shortest = sentence[i];
    }
  }
  move(shortest[0][0], shortest[0][1])
}