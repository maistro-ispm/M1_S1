// html elements
let cells = document.querySelectorAll(".ttt-cell")
const turnDiv = document.querySelector("#turn")
const messageDiv = document.querySelector("#message")
const resetBtn = document.querySelector("#reset")
const winLineEl = document.querySelector("#win-line")

let canPlay = true

function getChar() {
  return turn === X ? "X" : "O"
}

let state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const X = 1
const O = -1
let turn = X
turnDiv.innerHTML = getChar(turn)


function evalState(player) {

  // Horizontal
  if (state[0] == state[1] && state[1] == state[2] && state[0] != 0) {
    return state[0] * player * 100;
  }

  if (state[3] == state[4] && state[4] == state[5] && state[3] != 0) {
    return state[3] * player * 100;
  }

  if (state[6] == state[7] && state[7] == state[8] && state[6] != 0)
    return state[6] * player * 100;


  // Vertical
  if (state[0] == state[3] && state[3] == state[6] && state[0] != 0)
    return state[0] * player * 100;

  if (state[1] == state[4] && state[4] == state[7] && state[1] != 0)
    return state[0] * player * 100;

  if (state[2] == state[5] && state[5] == state[8] && state[2] != 0)
    return state[0] * player * 100;

  // Diagonal
  if (state[0] == state[4] && state[4] == state[8] && state[0] != 0)
    return state[0] * player * 100;
  if (state[2] == state[4] && state[4] == state[6] && state[2] != 0)
    return state[2] * player * 100;

  return 0;
}

function isFull() {
  for (let i = 0; i < state.length; i++) {
    if (state[i] == 0) {
      return false
    }
  }
  return true
}

function isTerminal(player) {
  return isFull() || evalState(player) != 0
}

function reset() {
  canPlay = true
  messageDiv.innerHTML = ""

  state = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  cells.forEach(cell => {
    cell.innerHTML = ""
    cell.classList.remove("ttt-X")
    cell.classList.remove("ttt-O")
  })

  if (winLineEl) {
    winLineEl.className = "win-line"
    winLineEl.style.display = "none"
  }
}

function play(position) {
  console.log(position);
  
  if (state[position] != 0) {
    console.log("Can't play this position")
    return
  }

  state[position] = turn

  const cellElement = document.getElementById(position)

  cellElement.classList.add("ttt-"+getChar())

  cellElement.innerHTML = getChar()

  if (isFull()) {
    let evaluation = evalState()

    if (evaluation == 0) {
      messageDiv.innerHTML = "Match null"
    } else {
      messageDiv.innerHTML = ' a gagnée'
    }
  }

  let evaluation = evalState()

  if (evaluation != 0) {
    messageDiv.innerHTML = ' a gagnée'
    canPlay = false
  }

  // Affiche la ligne gagnante si besoin
  const winData = checkWinner(state)
  if (winData && winLineEl) {
    winLineEl.className = `win-line ${winData.line}`
    winLineEl.style.display = "block"
  } else if (winLineEl) {
    winLineEl.className = "win-line"
    winLineEl.style.display = "none"
  }

  turn = -turn

  if (canPlay) {
    turnDiv.innerHTML = getChar(turn)
  }
}

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
};

cells.forEach(cell => {
  cell.addEventListener("click", (e) => {
    if (canPlay) {
      play(e.currentTarget.id)
    }
  })
})

resetBtn.addEventListener("click", () => {
  reset()
})

// état initial
if (winLineEl) {
  winLineEl.style.display = "none"
}
