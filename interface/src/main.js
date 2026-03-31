// --- Sélecteurs DOM ---
const cells = document.querySelectorAll(".ttt-cell"); // Corrigé pour correspondre au HTML
const turnDiv = document.querySelector("#turn");
const messageDiv = document.querySelector("#message");
const resetBtn = document.querySelector("#reset");
const winLineEl = document.querySelector("#win-line");
const startBtn = document.querySelector("#startGame");
const menu = document.querySelector(".menu");
const settingBtn = document.querySelector("#settings");

// --- Variables d'état ---
const X = 1;
const O = -1;
let state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let turn = X;
let canPlay = false; // Bloqué tant qu'on n'a pas cliqué sur "Commencer"
let vsAI = false;

// --- Fonctions utilitaires ---
function getChar(p = turn) {
  return p === X ? "X" : "O";
}

function isFull() {
  return !state.includes(0);
}

// Vérifie le gagnant et retourne les infos pour tracer la ligne CSS
function checkWinner(board) {
  const lines = [
    { indices: [0, 1, 2], type: "h-1" },
    { indices: [3, 4, 5], type: "h-2" },
    { indices: [6, 7, 8], type: "h-3" },
    { indices: [0, 3, 6], type: "v-1" },
    { indices: [1, 4, 7], type: "v-2" },
    { indices: [2, 5, 8], type: "v-3" },
    { indices: [0, 4, 8], type: "d-1" },
    { indices: [2, 4, 6], type: "d-2" },
  ];

  for (const line of lines) {
    const [a, b, c] = line.indices;
    if (board[a] !== 0 && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a], line: line.type };
    }
  }
  return null;
}

// --- Logique de jeu ---
function reset() {
  state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  turn = X;
  canPlay = true;

  messageDiv.innerHTML = "";
  turnDiv.innerHTML = getChar();

  cells.forEach(cell => {
    cell.innerHTML = "";
    cell.classList.remove("ttt-X", "ttt-O");
  });

  if (winLineEl) {
    winLineEl.className = "win-line";
    winLineEl.style.display = "none";
  }
}

function play(position) {
  if (state[position] !== 0 || !canPlay) return;

  // Mise à jour de l'état
  state[position] = turn;

  // Mise à jour de l'UI
  const cellElement = document.getElementById(position);
  cellElement.classList.add("ttt-" + getChar());
  cellElement.innerHTML = getChar();

  // Vérification de victoire
  const winData = checkWinner(state);

  if (winData) {
    messageDiv.innerHTML = `${getChar()} a gagné !`;
    canPlay = false;

    // Affiche la ligne gagnante
    if (winLineEl) {
      winLineEl.className = `win-line ${winData.line}`;
      winLineEl.style.display = "block";
    }
    return;
  }

  // Vérification de match nul
  if (isFull()) {
    messageDiv.innerHTML = "Match nul !";
    canPlay = false;
    return;
  }

  // Changer de tour
  turn = -turn;
  turnDiv.innerHTML = getChar();

  // Si c'est au tour de l'IA
  if (vsAI && turn === O && canPlay) {
    setTimeout(aiPlay, 500); // Petit délai pour le réalisme
  }
}

function aiPlay() {
  const alphabeta = new AlphaBeta([...state]);
  alphabeta.turn = turn; // Initialiser avec le bon tour (O = -1)

  alphabeta.execAlphaBeta(9, alphabeta, turn, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);

  const bestMove = alphabeta.best.lastMove; // Récupérer le coup, pas le score
  console.log("Meilleur coup IA :", bestMove);
  play(bestMove);
}

// --- Événements ---
cells.forEach(cell => {
  cell.addEventListener("click", (e) => play(parseInt(e.target.id)));
});

startBtn.addEventListener("click", () => {
  vsAI = document.querySelector('input[name="opponent"]:checked').value === "ai";
  menu.style.display = "none";
  reset();
});

settingBtn.addEventListener("click", () => {
  menu.style.display = "block";
  canPlay = false; // Met le jeu en pause pendant qu'on est dans le menu
});

resetBtn.addEventListener("click", () => {
  reset();
});

// État initial au chargement
if (winLineEl) {
  winLineEl.style.display = "none";
}
