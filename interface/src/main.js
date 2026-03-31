const cells = document.querySelectorAll(".cell");
const turnDiv = document.querySelector("#turn");
const messageDiv = document.querySelector("#message");
const resetBtn = document.querySelector("#reset");
const startBtn = document.querySelector("#startGame");
const menu = document.querySelector(".menu");
const settingBtn = document.querySelector("#settings")

const X = 1;
const O = -1;
let state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let turn = X;
let canPlay = false; // Bloqué tant qu'on n'a pas cliqué sur "Commencer"
let vsAI = false;

function getChar(p = turn) {
  return p === X ? "X" : "O";
}

function evalState() {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
    [0, 4, 8], [2, 4, 6]             // Diagonales
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (state[a] !== 0 && state[a] === state[b] && state[a] === state[c]) {
      return state[a];
    }
  }
  return 0;
}

function isFull() {
  return !state.includes(0);
}

function play(position) {
  if (state[position] !== 0 || !canPlay) return;

  state[position] = turn;
  const cellElement = document.getElementById(position);
  cellElement.classList.add(getChar());
  cellElement.innerText = getChar();

  const winner = evalState();
  if (winner !== 0) {
    messageDiv.innerText = `${getChar()} a gagné !`;
    canPlay = false;
    return;
  }

  if (isFull()) {
    messageDiv.innerText = "Match nul !";
    canPlay = false;
    return;
  }

  // Changer de tour
  turn = -turn;
  turnDiv.innerText = getChar();

  // Si c'est au tour de l'IA
  if (vsAI && turn === O && canPlay) {
    setTimeout(aiPlay, 500); // Petit délai pour le réalisme
  }
}

function aiPlay() {
  // IA très simple : joue au hasard dans les cases vides
  const emptyCells = state.map((s, i) => s === 0 ? i : null).filter(i => i !== null);
  if (emptyCells.length > 0) {
    const randomPos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    play(randomPos);
  }
}

// --- Événements ---

cells.forEach(cell => {
  cell.addEventListener("click", (e) => play(parseInt(e.target.id)));
});

startBtn.addEventListener("click", () => {
  vsAI = document.querySelector('input[name="opponent"]:checked').value === "ai";
  menu.style.display = "none";
  canPlay = true;
  reset();
});

function reset() {
  state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  turn = X;
  canPlay = true;
  messageDiv.innerText = "";
  turnDiv.innerText = getChar();
  cells.forEach(c => {
    c.innerText = "";
    c.classList.remove("X", "O");
  });
}

settingBtn.addEventListener("click", () => {
  menu.style.display = "block";
  canPlay = false;
});

resetBtn.addEventListener("click", ()=> {
  reset()
})

const game = new AlphaBeta()

game.play(0)
game.play(1)

console.log("AlphaBeta", game.execAlphaBeta(5, game, 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), game.best)
