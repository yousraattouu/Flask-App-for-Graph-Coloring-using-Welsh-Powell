#Description



Cette application Flask implémente l'algorithme de Welsh-Powell pour la coloration de graphes. L'algorithme de Welsh-Powell est une méthode heuristique utilisée pour colorer les sommets d'un graphe de manière à ce que deux sommets adjacents n'aient pas la même couleur, tout en utilisant un nombre minimal de couleurs.

#Fonctionnalités


Implémentation de l'algorithme de Welsh-Powell
Interface web pour entrer les données du graphe
Visualisation du graphe coloré
Affichage du nombre de couleurs utilisées


##Comment fonctionne l'algorithme de Welsh-Powell


Trie les sommets par ordre décroissant de degré
Attribue la première couleur au premier sommet
Parcourt la liste triée et attribue cette couleur à tout sommet non adjacent aux sommets déjà colorés
Répète les étapes 2-3 avec une nouvelle couleur jusqu'à ce que tous les sommets soient colorés
