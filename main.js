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
      setTimeout(() => {
        alert(`Player ${currentPlayer} wins!`);
      }, 50); 
      gameOver = true;
    } else if(checkDraw(game)) {
      setTimeout(() => {
        alert('It\'s a draw!');
      }, 50); 
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

  let result = minimax(game, 0, 'O');
  move(result.move[0], result.move[1]);
}

function minimax(game, depth, player) {
  let bestScore = (player === 'O') ? -1 : 1;
  let move = null;

  if(checkWin('X', game)) return { score: -10, move: null };
  if(checkWin('O', game)) return { score: 10, move: null };
  if(checkDraw(game)) return { score: 0, move: null };

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (game[row][col] === '') {
        game[row][col] = player;
        let result = minimax(game, depth + 1, (player === 'O') ? 'X' : 'O');
        game[row][col] = '';

        if ((player === 'O' && result.score > bestScore) || (player === 'X' && result.score < bestScore)) {
          bestScore = result.score;
          move = [row, col];
        }
      }
    }
  }

  return { score: bestScore, move: move };
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