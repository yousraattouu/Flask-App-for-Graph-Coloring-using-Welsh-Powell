from flask import Flask, render_template, request, jsonify
from collections import defaultdict

app = Flask(__name__)

def welsh_powell(graph):
    # Trier les sommets par degré décroissant
    sorted_vertices = sorted(graph.keys(), key=lambda x: len(graph[x]), reverse=True)
    colors = {}
    color_groups = defaultdict(list)

    for vertex in sorted_vertices:
        used_colors = set(colors.get(neighbor) for neighbor in graph[vertex] if neighbor in colors)
        available_colors = set(range(len(graph))) - used_colors
        if available_colors:
            color = min(available_colors)
        else:
            color = len(color_groups)
        colors[vertex] = color
        color_groups[color].append(vertex)

    num_colors = len(set(colors.values()))
    return colors, color_groups, num_colors

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/colorize', methods=['POST'])
def colorize():
    data = request.json
    graph = data['graph']
    colors, color_groups, num_colors = welsh_powell(graph)
    return jsonify({'colors': colors, 'color_groups': color_groups, 'num_colors': num_colors})

if __name__ == '__main__':
    app.run(debug=True)
