from typing import Optional
import math

X = 1
O = -1

class Noeud:
    def __init__(self):
        self.etat = [0] * 9   # 0 = vide, 1 = X, -1 = O
        self.tour = X          # X commence
        self.best: Optional['Noeud'] = None

    def play(self, position: int):
        """Joue sur la case 'position' pour le joueur courant."""
        self.etat[position] = self.tour
        self.tour = -self.tour

    def copier(self) -> 'Noeud':
        copie = Noeud()
        copie.etat = self.etat[:]
        copie.tour = self.tour
        return copie

    def get_succ(self) -> list['Noeud']:
        """Retourne tous les successeurs possibles."""
        successeurs = []
        for i in range(9):
            if self.etat[i] == 0:
                fils = self.copier()
                fils.play(i)
                successeurs.append(fils)
        return successeurs

    def eval_heuristique(self, joueur: int) -> int:
        """
        Retourne +100 si 'joueur' gagne, -100 s'il perd, 0 sinon.
        """
        lignes = [
            # Horizontales
            (0, 1, 2), (3, 4, 5), (6, 7, 8),
            # Verticales
            (0, 3, 6), (1, 4, 7), (2, 5, 8),
            # Diagonales
            (0, 4, 8), (2, 4, 6),
        ]
        for a, b, c in lignes:
            if self.etat[a] == self.etat[b] == self.etat[c] != 0:
                return self.etat[a] * joueur * 100
        return 0

    def is_full(self) -> bool:
        return all(c != 0 for c in self.etat)

    def is_terminal(self) -> bool:
        return self.eval_heuristique(1) != 0 or self.is_full()

    @staticmethod
    def alphabeta(nd: 'Noeud', prof: int, joueur: int,
                  alpha: int = -math.inf, beta: int = math.inf) -> int:
        if prof == 0 or nd.is_terminal():
            return nd.eval_heuristique(joueur)

        successeurs = nd.get_succ()
        nd.best = None

        if nd.tour == joueur:   # Maximisant
            best_val = -math.inf
            for fils in successeurs:
                val = Noeud.alphabeta(fils, prof - 1, joueur, alpha, beta)
                if val > best_val:
                    best_val = val
                    nd.best = fils
                alpha = max(alpha, best_val)
                if alpha >= beta:
                    break   # Coupure beta
            return best_val
        else:                   # Minimisant
            best_val = math.inf
            for fils in successeurs:
                val = Noeud.alphabeta(fils, prof - 1, joueur, alpha, beta)
                if val < best_val:
                    best_val = val
                    nd.best = fils
                beta = min(beta, best_val)
                if alpha >= beta:
                    break   # Coupure alpha
            return best_val
