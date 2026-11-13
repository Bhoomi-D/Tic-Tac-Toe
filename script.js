const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const board = Array(9).fill("");
const scores = { X: 0, O: 0, draws: 0 };
const cells = [...document.querySelectorAll(".cell")];
const status = document.querySelector("#game-status");
const turnMark = document.querySelector("#turn-mark");
const roundNumber = document.querySelector("#round-number");
let currentPlayer = "X";
let startingPlayer = "X";
let round = 1;
let gameOver = false;

function renderTurn() {
  turnMark.textContent = currentPlayer;
  turnMark.classList.toggle("mark-o", currentPlayer === "O");
  status.textContent = `Player ${currentPlayer}, it's your turn`;
}

function findWinningLine() {
  return winningLines.find(([first, second, third]) =>
    board[first] && board[first] === board[second] && board[first] === board[third],
  );
}

function playMove(index) {
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer === "X" ? "mark-x" : "mark-o");
  cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, ${currentPlayer}`);

  const winningLine = findWinningLine();
  if (winningLine) {
    gameOver = true;
    scores[currentPlayer] += 1;
    winningLine.forEach((winningIndex) => cells[winningIndex].classList.add("winning-cell"));
    status.textContent = `Player ${currentPlayer} wins the round!`;
    turnMark.textContent = "★";
    turnMark.classList.toggle("mark-o", currentPlayer === "O");
    updateScores();
    return;
  }

  if (board.every(Boolean)) {
    gameOver = true;
    scores.draws += 1;
    status.textContent = "It's a draw! Good game.";
    turnMark.textContent = "=";
    updateScores();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  renderTurn();
}

function updateScores() {
  document.querySelector("#score-x").textContent = scores.X;
  document.querySelector("#score-o").textContent = scores.O;
  document.querySelector("#score-draws").textContent = scores.draws;
}

function clearBoard() {
  board.fill("");
  gameOver = false;
  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.classList.remove("mark-x", "mark-o", "winning-cell");
    cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, empty`);
  });
}

function startNewRound() {
  startingPlayer = startingPlayer === "X" ? "O" : "X";
  currentPlayer = startingPlayer;
  round += 1;
  roundNumber.textContent = String(round).padStart(2, "0");
  clearBoard();
  renderTurn();
  cells[0].focus();
}

function resetMatch() {
  scores.X = 0;
  scores.O = 0;
  scores.draws = 0;
  startingPlayer = "X";
  currentPlayer = "X";
  round = 1;
  roundNumber.textContent = "01";
  clearBoard();
  renderTurn();
  updateScores();
  cells[0].focus();
}

document.querySelector("#board").addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (cell) playMove(Number(cell.dataset.index));
});

document.querySelector("#new-round").addEventListener("click", startNewRound);
document.querySelector("#reset-match").addEventListener("click", resetMatch);
