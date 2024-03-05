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

    if(checkWin(currentPlayer, game)) {
      alert(`Player ${currentPlayer} wins!`);
      gameOver = true;
    } else if(checkDraw(game)) {
      alert('It\'s a draw!');
      gameOver = true;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }


    if(currentPlayer === 'O' && !gameOver) {
      aiMove();
    };
  };
};

function checkWin(player, gameBoard) {
  for(let row = 0; row < 3; row++) {
    if(gameBoard[row][0] === player && gameBoard[row][1] === player && gameBoard[row][2] === player) {
      return true;
    };
  };
  for(let col = 0; col < 3; col++) {
    if(gameBoard[0][col] === player && gameBoard[1][col] === player && gameBoard[2][col] === player) {
      return true;
    };
  };
  if(gameBoard[0][0] === player && gameBoard[1][1] === player && gameBoard[2][2] === player) {
    return true;
  };
  if(gameBoard[0][2] === player && gameBoard[1][1] === player && gameBoard[2][0] === player) {
    return true;
  };
  return false;
};

function checkDraw(gameBoard) {
  for(let row = 0; row < 3; row++) {
    for(let col = 0; col < 3; col++) {
      if(gameBoard[row][col] === '') {
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

function aiMove() {
  const listMove = [];
  let oneMove = canWinInOneMove('O', game);
  if(oneMove) {
    move(oneMove[0], oneMove[1]);
    return;
  }

  oneMove = canWinInOneMove('X', game);
  if(oneMove) {
    move(oneMove[0], oneMove[1]);
    return;
  }
  for(let i = 0; i<10000; i++) {
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
      if(checkWin(tempPlayer, testGame)) {
        listMove[i].score = tempPlayer === currentPlayer ? 2 : -2;
        break;
      } else {
        if(checkDraw(testGame)) {
          listMove[i].score = 1;
          break;
        }
      }
      tempPlayer = tempPlayer === 'X' ? 'O' : 'X';
    }
  }
  bestSentence(listMove);
}

function bestSentence(sentence) {
  const bestMoves = findBestMoves(sentence, 'score');
  findRepetition(bestMoves);
}

function findRepetition(sentence){
  const repetition = [];
  for(let i = 0; i < sentence.length; i++) {
    let score = sentence[i].score;
    const temp = sentence[i];
    for(let j = i + 1; j < sentence.length; j++) {
      if(JSON.stringify(temp.move[0]) === JSON.stringify(sentence[j].move[0])) {
        score += sentence[j].score;
      }
    }
    repetition.push({score, move: temp.move});
  }
  bestRepetition(repetition);
}

function bestRepetition(sentence){
  const bestMoves = findBestMoves(sentence, 'score');
  findShortestMove(bestMoves.map(s => s.move));
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


// Algo for AI

function canWinInOneMove(player, gameBoard) {
  for(let row = 0; row < 3; row++) {
    for(let col = 0; col < 3; col++) {
      if(gameBoard[row][col] === '') {
        gameBoard[row][col] = player;
        if(checkWin(player, gameBoard)) {
          gameBoard[row][col] = '';
          return [row, col];
        }
        gameBoard[row][col] = '';
      }
    }
  }
  return null;
}

function findBestMoves(sentence, scoreProperty) {
  const bestMoves = []; 
  let high = sentence[0][scoreProperty];
  for(let i = 1; i < sentence.length; i++) {
    if(sentence[i][scoreProperty] > high) {
      high = sentence[i][scoreProperty];
    }
  };
  for(let i = 0; i < sentence.length; i++) {
    if(sentence[i][scoreProperty] === high) {
      bestMoves.push(sentence[i]);
    }
  }
  return bestMoves;
}