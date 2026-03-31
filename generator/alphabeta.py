from typing import Optional
import math

X = 1
O = -1

LINES = [
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
]


class Node:
    def __init__(self, etat=[0] * 9, tour=X):  # X commence
        self.etat = etat  # 0 = vide, 1 = X, -1 = O
        self.tour = tour
        self.best: Optional[Node] = None

    def play(self, position: int):
        self.etat[position] = self.tour
        self.tour = -self.tour

    def clone(self) -> "Node":
        return Node(self.etat[:], tour=self.tour)

    def get_succ(self) -> list["Node"]:
        """Retourne tous les successeurs possibles."""
        successeurs = []
        for i in range(9):
            if self.etat[i] == 0:
                fils = self.clone()
                fils.play(i)
                successeurs.append(fils)
        return successeurs

    def eval_heuristique(self, joueur: int) -> int:
        """
        Retourne +100 si 'joueur' gagne, -100 s'il perd, 0 sinon.
        """
        lignes = [
            # Horizontales
            (0, 1, 2),
            (3, 4, 5),
            (6, 7, 8),
            # Verticales
            (0, 3, 6),
            (1, 4, 7),
            (2, 5, 8),
            # Diagonales
            (0, 4, 8),
            (2, 4, 6),
        ]
        for a, b, c in lignes:
            if self.etat[a] == self.etat[b] == self.etat[c] != 0:
                return self.etat[a] * joueur * 100
        return 0

    def is_full(self) -> bool:
        return all(c != 0 for c in self.etat)

    def is_terminal(self) -> bool:
        return self.eval_heuristique(1) != 0 or self.is_full()

    def minmax(
        self,
        prof: int,
        joueur: int,
        alpha: int = -math.inf,
        beta: int = math.inf,
    ) -> int:
        if prof == 0 or self.is_terminal():
            return self.eval_heuristique(joueur)

        successeurs = self.get_succ()
        self.best = None

        if self.tour == joueur:  # Maximisant
            best_val = -math.inf
            for fils in successeurs:
                val = fils.minmax(prof - 1, joueur, alpha, beta)
                if val > best_val:
                    best_val = val
                    self.best = fils
                alpha = max(alpha, best_val)
                if alpha >= beta:
                    break  # Coupure beta
            return best_val
        else:  # Minimisant
            best_val = math.inf
            for fils in successeurs:
                val = fils.minmax(prof - 1, joueur, alpha, beta)
                if val < best_val:
                    best_val = val
                    self.best = fils
                beta = min(beta, best_val)
                if alpha >= beta:
                    break  # Coupure alpha
            return best_val

    def is_legal(self) -> bool:
        nx = self.etat.count(X)
        no = self.etat.count(O)
        if not (nx == no or nx == no + 1):
            return False

        def winner(p):
            return any(
                self.etat[a] == self.etat[b] == self.etat[c] == p for a, b, c in LINES
            )

        # Les deux joueurs ne peuvent pas avoir gagné simultanément
        if winner(X) and winner(O):
            return False
        # Si O a gagné, #O doit être == #X (X a joué en dernier avant O)
        if winner(O) and nx != no:
            return False
        # Si X a gagné, #X doit être == #O + 1
        if winner(X) and nx != no + 1:
            return False
        return True
