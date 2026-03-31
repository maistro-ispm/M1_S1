class AlphaBeta {
  state;
  static X = 1;
  static O = -1;

  best = null;
  turn = AlphaBeta.X;

  constructor (state) {
    this.state = state
  }

  getChar() {
    return this.turn === AlphaBeta.X ? "X" : "O";
  }

  isFull() {
    return !this.state.includes(0);
  }

  // Évaluation : 100 si X gagne, -100 si O gagne
  evalState(player) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let [a, b, c] of lines) {
      if (this.state[a] !== 0 && this.state[a] === this.state[b] && this.state[a] === this.state[c]) {
        return this.state[a] * player * 100;
      }
    }
    return 0;
  }

  play(position) {
    if (this.state[position] !== 0) return false;
    this.state[position] = this.turn; // Assigner AVANT d'inverser le tour
    this.turn = -this.turn;
    return true;
  }

  copy() {
    let out = new AlphaBeta([...this.state]);
    out.turn = this.turn;
    return out;
  }

  getSucc() {
    let succs = [];
    for (let i = 0; i < this.state.length; i++) {
      if (this.state[i] === 0) {
        const child = this.copy();
        child.play(i);
        child.lastMove = i; // pour savoir quel coup a été joué
        succs.push(child);
      }
    }
    return succs;
  }

  isTerminal(player) {
    return this.evalState(player) !== 0 || this.isFull();
  }

  execAlphaBeta(depth, node, player, alpha, beta) {
    if (depth === 0 || node.isTerminal(player)) {
      return node.evalState(player); // Passer player pour éviter NaN
    }

    let succs = node.getSucc();

    if (node.turn === player) { // Maximiseur
      let bestValue = -Infinity;
      for (const child of succs) {
        let value = this.execAlphaBeta(depth - 1, child, player, alpha, beta);
        if (value > bestValue) {
          bestValue = value;
          node.best = child;
        }
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break;
      }
      return bestValue;
    } else { // Minimiseur
      let bestValue = Infinity;
      for (const child of succs) {
        let value = this.execAlphaBeta(depth - 1, child, player, alpha, beta);
        if (value < bestValue) {
          bestValue = value;
          node.best = child;
        }
        beta = Math.min(beta, value);
        if (alpha >= beta) break;
      }
      return bestValue;
    }
  }
}
