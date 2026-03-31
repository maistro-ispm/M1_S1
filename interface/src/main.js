// html elements
let cells = document.querySelectorAll(".cell")
const turnDiv = document.querySelector("#turn")
const messageDiv = document.querySelector("#message")
const resetBtn = document.querySelector("#reset")

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
    cell.classList.remove("X")
    cell.classList.remove("O")
  })
}

function play(position) {
  if (state[position] != 0) {
    console.log("Can't play this position")
    return
  }

  state[position] = turn

  const cellElement = document.getElementById(position)

  cellElement.classList.add(getChar())

  cellElement.innerHTML = getChar()

  if (isFull()) {
    let evaluation = evalState()

    if (evaluation == 0) {
      messageDiv.innerHTML = "Match null"
    } else {
      messageDiv.innerHTML = getChar(-turn) + ' a gagnée'
    }
  }

  let evaluation = evalState()

  if (evaluation != 0) {
    messageDiv.innerHTML = getChar(-turn) + ' a gagnée'
    canPlay = false
  }

  turn = -turn

  if (canPlay) {
    turnDiv.innerHTML = getChar(turn)
  }
}

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
