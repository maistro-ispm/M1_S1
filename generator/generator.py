import csv
import random
import math
import itertools
from alphabeta import X, O

LINES = [(0,1,2),(3,4,5),(6,7,8),
         (0,3,6),(1,4,7),(2,5,8),
         (0,4,8),(2,4,6)]

def is_legal(etat: list[int]) -> bool:
    """
    Un état est légal si :
      - le nombre de X et de O est cohérent (|#X - #O| <= 1, X commence)
      - au plus un vainqueur
    """
    nx = etat.count(X)
    no = etat.count(O)
    if not (nx == no or nx == no + 1):
        return False

    def winner(p):
        return any(etat[a]==etat[b]==etat[c]==p for a,b,c in LINES)

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


def collect_all_states() -> list[list[int]]:
    """Énumère tous les états légaux du morpion (5 478 au total)."""
    states = []
    for combo in itertools.product([-1, 0, 1], repeat=9):
        state = list(combo)
        if is_legal(state):
            states.append(state)
    return states

def build_features(etat: list[int]) -> dict:
    """
    Construit un vecteur de features à partir d'un état.

    Features brutes (9) + features dérivées :
      - x_wins  : X a déjà 3 en ligne
    """
    f = {f"c{i}_x": 1 if etat[i] == 1 else 0 for i in range(9)}
    f.update({f"c{i}_o": 1 if etat[i] == -1 else 0 for i in range(9)})

    x_wins = o_wins = 0
    x_two = o_two = x_one = o_one = 0

    for a, b, c in LINES:
        line = [etat[a], etat[b], etat[c]]
        sx, so = line.count(X), line.count(O)
        if sx == 3: x_wins += 1
        if so == 3: o_wins += 1
        if sx == 2 and so == 0: x_two += 1
        if so == 2 and sx == 0: o_two += 1
        if sx == 1 and so == 0: x_one += 1
        if so == 1 and sx == 0: o_one += 1

    f["x_wins"]  = x_wins
    f["is_draw"] = 1 if (x_wins == 0 and o_wins == 0 and sum(etat) == 0) else 0

    return f

def generate_dataset(output_path: str = "tictactoe_dataset.csv"):
    print("Collecte de tous les états légaux…")
    all_states = collect_all_states()
    print(f"   → {len(all_states)} états trouvés")

    print("Calcul des labels alpha-beta…")
    rows = [] 
    for i, etat in enumerate(all_states):
        if i % 500 == 0:
            print(f"   {i}/{len(all_states)}", end="\r")
        features = build_features(etat)
        rows.append(features)

    # Mélanger avant de sauvegarder
    random.shuffle(rows)

    print(f"\n Sauvegarde dans '{output_path}'…")
    fieldnames = list(rows[0].keys())
    with open(output_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    return output_path


if __name__ == "__main__":
    generate_dataset("./ressources/dataset.csv")
