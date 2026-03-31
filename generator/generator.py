import pandas as pd
import random
import math
import itertools

from alphabeta import X, O, LINES, Node


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

                if child.is_legal():
                    stack.append(child)
                    result.append(child)

    return result


def build_features(node: "Node") -> dict:
    _score = node.minmax(prof=9, joueur=node.tour)  # score est inutilisé
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
    print("Collecte de tous les états...")
    all_states = collect_all_states()
    print(f"   → {len(all_states)} états trouvés")

    print("Construction des features...")
    rows = []
    for i, node in enumerate(all_states):
        if i % 500 == 0:
            print(f"   {i}/{len(all_states)}", end="\r")
        features = build_features(node)
        rows.append(features)

    df = pd.DataFrame(rows)

    # Mélanger avant de sauvegarder
    df = df.sample(frac=1).reset_index(drop=True)

    print(f"\n Sauvegarde dans '{output_path}'…")

    df.to_csv(output_path, index=False)


if __name__ == "__main__":
    generate_dataset("./ressources/dataset.csv")
