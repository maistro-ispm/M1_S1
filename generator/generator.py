import csv
import random
import math
import itertools
from alphabeta import X, O, Node

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
        return any(etat[a] == etat[b] == etat[c] == p for a, b, c in LINES)

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


def collect_all_states() -> list["Node"]:
    initial = Node()
    stack = [initial]

    initial_str = "".join(map(str, initial.etat))
    visited = {initial_str}

    result = [initial]

    while len(stack) > 0:
        current = stack.pop()

        for child in current.get_succ():
            child_str = "".join(map(str, child.etat))

            if child_str not in visited:
                visited.add(child_str)

                if is_legal(child.etat):
                    stack.append(child)
                    result.append(child)

    return result


def build_features(node: "Node") -> dict:
    """
    Construit un vecteur de features à partir d'un état.

    Features brutes (9) + features dérivées :
      - x_wins  : X a déjà 3 en ligne
    """
    _score = node.alphabeta(prof=9, joueur=node.tour)
    best = node.best

    f = {f"c{i}_x": 1 if node.etat[i] == 1 else 0 for i in range(9)}
    f.update({f"c{i}_o": 1 if node.etat[i] == -1 else 0 for i in range(9)})

    if best is None:
        f["x_wins"] = 0
        f["is_draw"] = 1

        return f

    x_wins = 0
    o_wins = 0

    for a, b, c in LINES:
        line = [best.etat[a], best.etat[b], best.etat[c]]
        sx, so = line.count(X), line.count(O)
        if sx == 3:
            x_wins = 1
        if so == 3:
            o_wins = 1

    f["x_wins"] = x_wins
    f["is_draw"] = 1 if (x_wins == 0 and o_wins == 0) else 0

    return f


def generate_dataset(output_path: str = "tictactoe_dataset.csv"):
    print("Collecte de tous les états légaux…")
    all_states = collect_all_states()
    print(f"   → {len(all_states)} états trouvés")

    print("Calcul des labels alpha-beta…")
    rows = []
    for i, node in enumerate(all_states):
        if i % 500 == 0:
            print(f"   {i}/{len(all_states)}", end="\r")
        features = build_features(node)
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
