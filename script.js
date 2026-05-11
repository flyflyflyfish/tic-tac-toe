const SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let currentPlayer = BLACK;
let gameOver = false;
let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

function renderBoard() {
  boardEl.innerHTML = "";

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", () => handleMove(row, col));

      if (board[row][col] !== EMPTY) {
        const stone = document.createElement("span");
        stone.className = `stone ${board[row][col] === BLACK ? "black" : "white"}`;
        cell.appendChild(stone);
      }

      boardEl.appendChild(cell);
    }
  }
}

function handleMove(row, col) {
  if (gameOver || board[row][col] !== EMPTY) {
    return;
  }

  board[row][col] = currentPlayer;

  if (isWinner(row, col, currentPlayer)) {
    gameOver = true;
    statusEl.textContent = `胜者：${currentPlayer === BLACK ? "黑棋 ●" : "白棋 ○"}`;
    renderBoard();
    return;
  }

  if (isBoardFull()) {
    gameOver = true;
    statusEl.textContent = "平局";
    renderBoard();
    return;
  }

  currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
  statusEl.textContent = `当前回合：${currentPlayer === BLACK ? "黑棋 ●" : "白棋 ○"}`;
  renderBoard();
}

function isBoardFull() {
  return board.every((row) => row.every((cell) => cell !== EMPTY));
}

function isWinner(row, col, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  return directions.some(([dr, dc]) => {
    const count =
      1 + countDirection(row, col, dr, dc, player) + countDirection(row, col, -dr, -dc, player);
    return count >= 5;
  });
}

function countDirection(row, col, dr, dc, player) {
  let r = row + dr;
  let c = col + dc;
  let count = 0;

  while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === player) {
    count++;
    r += dr;
    c += dc;
  }

  return count;
}

function resetGame() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  currentPlayer = BLACK;
  gameOver = false;
  statusEl.textContent = "当前回合：黑棋 ●";
  renderBoard();
}

resetBtn.addEventListener("click", resetGame);
renderBoard();
