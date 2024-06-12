import os
import networkx as nx
import matplotlib.pyplot as plt

# Sample data
edges = [("user1", "user2"), ("user3", "user2"), ("user4", "user1"), ("user5", "user3")]

def draw_graph(edges, directed=False, reverse=False, pos=None, filepath='./undirected_graph.png'):
    # Create a graph
    if directed:
        G = nx.DiGraph()
    else:
        G = nx.Graph()

    if reverse:
        reversed_edges = [(edge[1], edge[0]) for edge in edges]
        G.add_edges_from(reversed_edges)
    else:
        G.add_edges_from(edges)
    
    plt.figure(figsize=(8, 6))

    if pos is None:
        # Use spring layout if positions are not provided
        pos = nx.spring_layout(G)
    
    # Draw the graph with fixed node positions
    if directed:
        nx.draw(G, pos, with_labels=True, node_size=3000, node_color="skyblue", font_size=14, arrows=True)
    else:
        nx.draw(G, pos, with_labels=True, node_size=3000, node_color="skyblue", font_size=14)

    plt.savefig(filepath)
    plt.close()

# Generate a fixed layout for consistency
G = nx.Graph()
G.add_edges_from(edges)

# Define fixed node positions (manually or programmatically)
fixed_pos = {'user1': (0, 0), 'user2': (1, 1), 'user3': (0, 1), 'user4': (-1, 1), 'user5': (-1, 0)}

script_dir = os.path.dirname(__file__)
save_dir = os.path.join(script_dir, 'graphs')
os.makedirs(save_dir, exist_ok=True)

# Draw graph without directed edges
print("Undirected Graph:")
draw_graph(edges, directed=False, pos=fixed_pos, filepath=os.path.join(save_dir, 'undirected_graph.png'))

""""
# Draw graph with directed edges reversed
print("Directed Graph - Follower Relation")
draw_graph(edges, directed=True, reverse=True, pos=pos)

# Draw graph with directed edges as provided
print("Directed Graph - Follow Relation")
draw_graph(edges, directed=True, reverse=False, pos=pos)
"""
