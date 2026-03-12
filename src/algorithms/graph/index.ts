import type { AlgorithmModule, ExecutionState } from '../../types';

interface GraphMeta { nodes: string[]; edges: [string, string, number][]; visited: Set<string>; distances: Map<string, number>; activeNode?: string; activeEdge?: [string, string]; parent: Map<string, string>; mstEdges?: [string, string, number][]; }

function buildMeta(m: GraphMeta) {
    return { nodes: m.nodes, edges: m.edges, visited: [...m.visited], distances: Object.fromEntries(m.distances), activeNode: m.activeNode, activeEdge: m.activeEdge, parent: Object.fromEntries(m.parent), mstEdges: m.mstEdges };
}

function parseGraph(nodesStr: string, edgesStr: string): { nodes: string[], adj: Map<string, [string, number][]>, edges: [string, string, number][] } {
    let nodes: string[], edges: [string, string, number][];
    try { nodes = JSON.parse(nodesStr); edges = JSON.parse(edgesStr); } catch { nodes = ["A", "B", "C", "D", "E"]; edges = [["A", "B", 4], ["A", "C", 2], ["B", "D", 3], ["C", "D", 1], ["C", "E", 5], ["D", "E", 2]]; }
    const adj = new Map<string, [string, number][]>();
    for (const n of nodes) adj.set(n, []);
    for (const [u, v, w] of edges) { adj.get(u)!.push([v, w]); adj.get(v)!.push([u, w]); }
    return { nodes, adj, edges };
}

// BFS
function* bfsGenerator({ nodes: nStr, edges: eStr, start: startNode }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const { nodes, adj, edges } = parseGraph(nStr, eStr);
    const s = startNode || nodes[0];
    const visited = new Set<string>();
    const parent = new Map<string, string>();
    const queue: string[] = [s];
    visited.add(s);

    yield { recursion_depth: 0, action_type: 'none', message: `BFS from ${s}`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent, activeNode: s }) };

    while (queue.length > 0) {
        const node = queue.shift()!;
        yield { recursion_depth: 0, action_type: 'explore', message: `Visiting ${node}`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent, activeNode: node }) };
        for (const [neighbor] of adj.get(node) || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                parent.set(neighbor, node);
                queue.push(neighbor);
                yield { recursion_depth: 0, action_type: 'place', message: `Discovered ${neighbor} from ${node}`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent, activeNode: neighbor, activeEdge: [node, neighbor] }) };
            }
        }
    }
    yield { recursion_depth: 0, action_type: 'solution', message: `BFS complete. Visited: [${[...visited].join(', ')}]`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent }) };
}

export const bfsModule: AlgorithmModule = {
    id: "bfs", name: "BFS", category: "Graph Algorithms",
    description: "Breadth-First Search explores all neighbors at the current depth before moving to the next level.",
    pseudocode: ["queue = [start]", "while queue not empty:", "  node = dequeue", "  for each neighbor:", "    if not visited:", "      mark visited, enqueue"],
    complexity: { time: "O(V + E)", space: "O(V)" },
    inputConfig: [
        { name: "nodes", type: "json", label: "Nodes", defaultValue: '["A","B","C","D","E"]' },
        { name: "edges", type: "json", label: "Edges [from,to,weight]", defaultValue: '[["A","B",1],["A","C",1],["B","D",1],["C","D",1],["C","E",1],["D","E",1]]' },
        { name: "start", type: "text", label: "Start Node", defaultValue: "A" }
    ],
    generateStates: bfsGenerator
};

// DFS
function* dfsGenerator({ nodes: nStr, edges: eStr, start: startNode }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const { nodes, adj, edges } = parseGraph(nStr, eStr);
    const s = startNode || nodes[0];
    const visited = new Set<string>();
    const parent = new Map<string, string>();

    yield { recursion_depth: 0, action_type: 'none', message: `DFS from ${s}`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent, activeNode: s }) };

    function* dfs(node: string, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        visited.add(node);
        yield { recursion_depth: depth, action_type: 'explore', message: `Visiting ${node}`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent, activeNode: node }) };
        for (const [neighbor] of adj.get(node) || []) {
            if (!visited.has(neighbor)) {
                parent.set(neighbor, node);
                yield { recursion_depth: depth, action_type: 'place', message: `Exploring edge ${node}→${neighbor}`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent, activeNode: neighbor, activeEdge: [node, neighbor] }) };
                yield* dfs(neighbor, depth + 1);
                yield { recursion_depth: depth, action_type: 'backtrack', message: `Backtracking from ${neighbor} to ${node}`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent, activeNode: node }) };
            }
        }
    }
    yield* dfs(s, 0);
    yield { recursion_depth: 0, action_type: 'solution', message: `DFS complete. Order: [${[...visited].join(', ')}]`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent }) };
}

export const dfsModule: AlgorithmModule = {
    id: "dfs", name: "DFS", category: "Graph Algorithms",
    description: "Depth-First Search explores as far as possible along each branch before backtracking.",
    pseudocode: ["dfs(node):", "  mark visited", "  for each neighbor:", "    if not visited:", "      dfs(neighbor)"],
    complexity: { time: "O(V + E)", space: "O(V)" },
    inputConfig: [
        { name: "nodes", type: "json", label: "Nodes", defaultValue: '["A","B","C","D","E"]' },
        { name: "edges", type: "json", label: "Edges [from,to,weight]", defaultValue: '[["A","B",1],["A","C",1],["B","D",1],["C","D",1],["C","E",1],["D","E",1]]' },
        { name: "start", type: "text", label: "Start Node", defaultValue: "A" }
    ],
    generateStates: dfsGenerator
};

// Dijkstra
function* dijkstraGenerator({ nodes: nStr, edges: eStr, start: startNode }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const { nodes, adj, edges } = parseGraph(nStr, eStr);
    const s = startNode || nodes[0];
    const dist = new Map<string, number>(); const visited = new Set<string>(); const parent = new Map<string, string>();
    for (const n of nodes) dist.set(n, Infinity);
    dist.set(s, 0);

    yield { recursion_depth: 0, action_type: 'none', message: `Dijkstra from ${s}`, metadata: buildMeta({ nodes, edges, visited, distances: dist, parent, activeNode: s }) };

    for (let i = 0; i < nodes.length; i++) {
        let u = ''; let minD = Infinity;
        for (const n of nodes) { if (!visited.has(n) && dist.get(n)! < minD) { minD = dist.get(n)!; u = n; } }
        if (!u) break;

        visited.add(u);
        yield { recursion_depth: 0, action_type: 'explore', message: `Selected ${u} with distance ${minD}`, metadata: buildMeta({ nodes, edges, visited, distances: dist, parent, activeNode: u }) };

        for (const [v, w] of adj.get(u) || []) {
            if (!visited.has(v)) {
                const newDist = dist.get(u)! + w;
                yield { recursion_depth: 0, action_type: 'compare', message: `Relax ${u}→${v}: ${newDist} vs ${dist.get(v)}`, metadata: buildMeta({ nodes, edges, visited, distances: dist, parent, activeNode: v, activeEdge: [u, v] }) };
                if (newDist < dist.get(v)!) {
                    dist.set(v, newDist); parent.set(v, u);
                    yield { recursion_depth: 0, action_type: 'update', message: `Updated dist[${v}] = ${newDist}`, metadata: buildMeta({ nodes, edges, visited, distances: dist, parent, activeNode: v, activeEdge: [u, v] }) };
                }
            }
        }
    }
    yield { recursion_depth: 0, action_type: 'solution', message: `Shortest paths from ${s}: ${nodes.map(n => `${n}=${dist.get(n)}`).join(', ')}`, metadata: buildMeta({ nodes, edges, visited, distances: dist, parent }) };
}

export const dijkstraModule: AlgorithmModule = {
    id: "dijkstra", name: "Dijkstra", category: "Graph Algorithms",
    description: "Find the shortest path from a source to all vertices using a greedy approach with non-negative edge weights.",
    pseudocode: ["dist[start] = 0", "while unvisited:", "  u = min dist unvisited", "  for each neighbor v:", "    if dist[u]+w < dist[v]:", "      update dist[v]"],
    complexity: { time: "O(V²)", space: "O(V)" },
    inputConfig: [
        { name: "nodes", type: "json", label: "Nodes", defaultValue: '["A","B","C","D","E"]' },
        { name: "edges", type: "json", label: "Edges [from,to,weight]", defaultValue: '[["A","B",4],["A","C",2],["B","D",3],["C","D",1],["C","E",5],["D","E",2]]' },
        { name: "start", type: "text", label: "Start Node", defaultValue: "A" }
    ],
    generateStates: dijkstraGenerator
};

// Bellman-Ford
function* bellmanFordGenerator({ nodes: nStr, edges: eStr, start: startNode }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const { nodes, edges } = parseGraph(nStr, eStr);
    const s = startNode || nodes[0];
    const dist = new Map<string, number>(); const parent = new Map<string, string>();
    for (const n of nodes) dist.set(n, Infinity);
    dist.set(s, 0);
    const visited = new Set<string>();

    yield { recursion_depth: 0, action_type: 'none', message: `Bellman-Ford from ${s}`, metadata: buildMeta({ nodes, edges, visited, distances: dist, parent }) };

    for (let i = 0; i < nodes.length - 1; i++) {
        yield { recursion_depth: 0, action_type: 'explore', message: `Iteration ${i + 1}/${nodes.length - 1}`, metadata: buildMeta({ nodes, edges, visited, distances: dist, parent }) };
        for (const [u, v, w] of edges) {
            if (dist.get(u)! !== Infinity && dist.get(u)! + w < dist.get(v)!) {
                dist.set(v, dist.get(u)! + w); parent.set(v, u); visited.add(v);
                yield { recursion_depth: 0, action_type: 'update', message: `Relaxed ${u}→${v}: dist[${v}] = ${dist.get(v)}`, metadata: buildMeta({ nodes, edges, visited, distances: dist, parent, activeEdge: [u, v], activeNode: v }) };
            }
            // Also check reverse for undirected
            if (dist.get(v)! !== Infinity && dist.get(v)! + w < dist.get(u)!) {
                dist.set(u, dist.get(v)! + w); parent.set(u, v); visited.add(u);
                yield { recursion_depth: 0, action_type: 'update', message: `Relaxed ${v}→${u}: dist[${u}] = ${dist.get(u)}`, metadata: buildMeta({ nodes, edges, visited, distances: dist, parent, activeEdge: [v, u], activeNode: u }) };
            }
        }
    }
    yield { recursion_depth: 0, action_type: 'solution', message: `Shortest paths: ${nodes.map(n => `${n}=${dist.get(n)}`).join(', ')}`, metadata: buildMeta({ nodes, edges, visited, distances: dist, parent }) };
}

export const bellmanFordModule: AlgorithmModule = {
    id: "bellman-ford", name: "Bellman-Ford", category: "Graph Algorithms",
    description: "Find shortest paths from source to all vertices, handling negative weights. Relaxes all edges V-1 times.",
    pseudocode: ["dist[start] = 0", "for i from 1 to V-1:", "  for each edge (u,v,w):", "    if dist[u]+w < dist[v]:", "      dist[v] = dist[u]+w"],
    complexity: { time: "O(V × E)", space: "O(V)" },
    inputConfig: [
        { name: "nodes", type: "json", label: "Nodes", defaultValue: '["A","B","C","D","E"]' },
        { name: "edges", type: "json", label: "Edges [from,to,weight]", defaultValue: '[["A","B",4],["A","C",2],["B","D",3],["C","D",1],["C","E",5],["D","E",2]]' },
        { name: "start", type: "text", label: "Start Node", defaultValue: "A" }
    ],
    generateStates: bellmanFordGenerator
};

// Prim's MST
function* primGenerator({ nodes: nStr, edges: eStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const { nodes, adj, edges } = parseGraph(nStr, eStr);
    const inMST = new Set<string>();
    const key = new Map<string, number>(); const parent = new Map<string, string>();
    const mstEdges: [string, string, number][] = [];
    for (const n of nodes) key.set(n, Infinity);
    key.set(nodes[0], 0);

    yield { recursion_depth: 0, action_type: 'none', message: `Prim's MST starting from ${nodes[0]}`, metadata: buildMeta({ nodes, edges, visited: inMST, distances: key, parent, mstEdges }) };

    for (let i = 0; i < nodes.length; i++) {
        let u = ''; let minK = Infinity;
        for (const n of nodes) { if (!inMST.has(n) && key.get(n)! < minK) { minK = key.get(n)!; u = n; } }
        if (!u) break;

        inMST.add(u);
        if (parent.has(u)) mstEdges.push([parent.get(u)!, u, minK]);

        yield { recursion_depth: 0, action_type: 'place', message: `Added ${u} to MST${parent.has(u) ? ` via edge ${parent.get(u)}→${u} (weight ${minK})` : ''}`, metadata: buildMeta({ nodes, edges, visited: inMST, distances: key, parent, activeNode: u, mstEdges }) };

        for (const [v, w] of adj.get(u) || []) {
            if (!inMST.has(v) && w < key.get(v)!) {
                key.set(v, w); parent.set(v, u);
                yield { recursion_depth: 0, action_type: 'update', message: `Updated key[${v}] = ${w} via ${u}`, metadata: buildMeta({ nodes, edges, visited: inMST, distances: key, parent, activeNode: v, activeEdge: [u, v], mstEdges }) };
            }
        }
    }
    const totalW = mstEdges.reduce((s, e) => s + e[2], 0);
    yield { recursion_depth: 0, action_type: 'solution', message: `MST weight: ${totalW}. Edges: ${mstEdges.map(e => `${e[0]}-${e[1]}(${e[2]})`).join(', ')}`, metadata: buildMeta({ nodes, edges, visited: inMST, distances: key, parent, mstEdges }) };
}

export const primModule: AlgorithmModule = {
    id: "prim", name: "Prim's MST", category: "Graph Algorithms",
    description: "Build a minimum spanning tree by greedily adding the cheapest edge connecting the MST to a new vertex.",
    pseudocode: ["key[start] = 0", "while not all in MST:", "  u = min key not in MST", "  add u to MST", "  for each neighbor v:", "    if w < key[v]: update"],
    complexity: { time: "O(V²)", space: "O(V)" },
    inputConfig: [
        { name: "nodes", type: "json", label: "Nodes", defaultValue: '["A","B","C","D","E"]' },
        { name: "edges", type: "json", label: "Edges [from,to,weight]", defaultValue: '[["A","B",4],["A","C",2],["B","D",3],["C","D",1],["C","E",5],["D","E",2]]' }
    ],
    generateStates: primGenerator
};

// Kruskal's MST
function* kruskalGenerator({ nodes: nStr, edges: eStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const { nodes, edges } = parseGraph(nStr, eStr);
    const sorted = [...edges].sort((a, b) => a[2] - b[2]);
    const parentUF = new Map<string, string>(); const rank = new Map<string, number>();
    for (const n of nodes) { parentUF.set(n, n); rank.set(n, 0); }
    const mstEdges: [string, string, number][] = [];
    const visited = new Set<string>();

    function find(x: string): string { if (parentUF.get(x) !== x) parentUF.set(x, find(parentUF.get(x)!)); return parentUF.get(x)!; }
    function union(a: string, b: string): boolean {
        const ra = find(a), rb = find(b);
        if (ra === rb) return false;
        if (rank.get(ra)! < rank.get(rb)!) parentUF.set(ra, rb);
        else if (rank.get(ra)! > rank.get(rb)!) parentUF.set(rb, ra);
        else { parentUF.set(rb, ra); rank.set(ra, rank.get(ra)! + 1); }
        return true;
    }

    yield { recursion_depth: 0, action_type: 'none', message: `Kruskal's MST: ${sorted.length} edges sorted by weight`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent: parentUF, mstEdges }) };

    for (const [u, v, w] of sorted) {
        yield { recursion_depth: 0, action_type: 'compare', message: `Considering edge ${u}-${v} (weight ${w})`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent: parentUF, activeEdge: [u, v], mstEdges }) };
        if (union(u, v)) {
            mstEdges.push([u, v, w]); visited.add(u); visited.add(v);
            yield { recursion_depth: 0, action_type: 'place', message: `Added edge ${u}-${v} (${w}) to MST`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent: parentUF, activeEdge: [u, v], mstEdges }) };
        } else {
            yield { recursion_depth: 0, action_type: 'conflict', message: `Edge ${u}-${v} forms cycle — skipped`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent: parentUF, activeEdge: [u, v], mstEdges }) };
        }
    }
    const totalW = mstEdges.reduce((s, e) => s + e[2], 0);
    yield { recursion_depth: 0, action_type: 'solution', message: `MST weight: ${totalW}`, metadata: buildMeta({ nodes, edges, visited, distances: new Map(), parent: parentUF, mstEdges }) };
}

export const kruskalModule: AlgorithmModule = {
    id: "kruskal", name: "Kruskal's MST", category: "Graph Algorithms",
    description: "Build MST by sorting all edges by weight and adding them if they don't form a cycle (Union-Find).",
    pseudocode: ["sort edges by weight", "for each edge (u,v,w):", "  if find(u) != find(v):", "    union(u, v)", "    add to MST"],
    complexity: { time: "O(E log E)", space: "O(V)" },
    inputConfig: [
        { name: "nodes", type: "json", label: "Nodes", defaultValue: '["A","B","C","D","E"]' },
        { name: "edges", type: "json", label: "Edges [from,to,weight]", defaultValue: '[["A","B",4],["A","C",2],["B","D",3],["C","D",1],["C","E",5],["D","E",2]]' }
    ],
    generateStates: kruskalGenerator
};

// Topological Sort (Kahn's)
function* topoSortGenerator({ nodes: nStr, edges: eStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let nodes: string[], dirEdges: [string, string, number][];
    try { nodes = JSON.parse(nStr); dirEdges = JSON.parse(eStr); } catch { nodes = ["A", "B", "C", "D", "E", "F"]; dirEdges = [["A", "B", 1], ["A", "C", 1], ["B", "D", 1], ["C", "D", 1], ["D", "E", 1], ["E", "F", 1]]; }

    const adj = new Map<string, string[]>();
    const inDeg = new Map<string, number>();
    for (const n of nodes) { adj.set(n, []); inDeg.set(n, 0); }
    for (const [u, v] of dirEdges) { adj.get(u)!.push(v); inDeg.set(v, inDeg.get(v)! + 1); }

    const queue: string[] = []; const result: string[] = [];
    const visited = new Set<string>();
    for (const n of nodes) if (inDeg.get(n) === 0) queue.push(n);

    yield { recursion_depth: 0, action_type: 'none', message: `Topological Sort (Kahn's). Initial zero in-degree: [${queue.join(', ')}]`, metadata: buildMeta({ nodes, edges: dirEdges, visited, distances: inDeg as any, parent: new Map() }) };

    while (queue.length > 0) {
        const u = queue.shift()!;
        result.push(u); visited.add(u);
        yield { recursion_depth: 0, action_type: 'place', message: `Added ${u} to order. Current: [${result.join(', ')}]`, metadata: buildMeta({ nodes, edges: dirEdges, visited, distances: inDeg as any, parent: new Map(), activeNode: u }) };
        for (const v of adj.get(u) || []) {
            inDeg.set(v, inDeg.get(v)! - 1);
            if (inDeg.get(v) === 0) {
                queue.push(v);
                yield { recursion_depth: 0, action_type: 'update', message: `${v} in-degree → 0, added to queue`, metadata: buildMeta({ nodes, edges: dirEdges, visited, distances: inDeg as any, parent: new Map(), activeNode: v, activeEdge: [u, v] }) };
            }
        }
    }
    yield { recursion_depth: 0, action_type: 'solution', message: `Topological Order: [${result.join(', ')}]`, metadata: buildMeta({ nodes, edges: dirEdges, visited, distances: inDeg as any, parent: new Map() }) };
}

export const topoSortModule: AlgorithmModule = {
    id: "topo-sort", name: "Topological Sort", category: "Graph Algorithms",
    description: "Order vertices in a DAG such that for every directed edge u→v, u comes before v. Uses Kahn's algorithm (BFS-based).",
    pseudocode: ["compute in-degrees", "queue = vertices with in-degree 0", "while queue:", "  u = dequeue", "  add to result", "  for v in adj[u]: decrement in-degree"],
    complexity: { time: "O(V + E)", space: "O(V)" },
    inputConfig: [
        { name: "nodes", type: "json", label: "Nodes", defaultValue: '["A","B","C","D","E","F"]' },
        { name: "edges", type: "json", label: "Directed Edges [from,to,w]", defaultValue: '[["A","B",1],["A","C",1],["B","D",1],["C","D",1],["D","E",1],["E","F",1]]' }
    ],
    generateStates: topoSortGenerator
};

// Floyd-Warshall (APSP)
function* floydWarshallGenerator({ nodes: nStr, edges: eStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let nodes: string[], dirEdges: [string, string, number][];
    try { nodes = JSON.parse(nStr); dirEdges = JSON.parse(eStr); } catch { nodes = ["A", "B", "C", "D"]; dirEdges = [["A", "B", 3], ["A", "C", 8], ["B", "C", 2], ["B", "D", 5], ["C", "D", 1]]; }
    const n = nodes.length;
    const INF = 99999;
    const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(INF));
    for (let i = 0; i < n; i++) dist[i][i] = 0;
    for (const [u, v, w] of dirEdges) { const ui = nodes.indexOf(u), vi = nodes.indexOf(v); if (ui >= 0 && vi >= 0) { dist[ui][vi] = w; dist[vi][ui] = w; } }

    yield { recursion_depth: 0, action_type: 'none', message: `Floyd-Warshall: ${n} nodes`, metadata: { dpTable: dist.map(r => [...r]), row: -1, col: -1, itemIndex: -1, weight: -1, value: -1, weights: nodes, values: nodes, capacity: n } };

    for (let k = 0; k < n; k++) {
        yield { recursion_depth: 0, action_type: 'explore', message: `Intermediate vertex: ${nodes[k]}`, metadata: { dpTable: dist.map(r => [...r]), row: k, col: -1, itemIndex: k, weight: -1, value: -1, weights: nodes, values: nodes, capacity: n } };
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    yield { recursion_depth: 0, action_type: 'compare', message: `dist[${nodes[i]}][${nodes[j]}]=${dist[i][j]} > dist[${nodes[i]}][${nodes[k]}]+dist[${nodes[k]}][${nodes[j]}]=${dist[i][k] + dist[k][j]}`, metadata: { dpTable: dist.map(r => [...r]), row: i, col: j, itemIndex: k, weight: -1, value: -1, weights: nodes, values: nodes, capacity: n } };
                    dist[i][j] = dist[i][k] + dist[k][j];
                    yield { recursion_depth: 0, action_type: 'update', message: `Updated dist[${nodes[i]}][${nodes[j]}] = ${dist[i][j]}`, metadata: { dpTable: dist.map(r => [...r]), row: i, col: j, itemIndex: k, weight: -1, value: -1, weights: nodes, values: nodes, capacity: n } };
                }
            }
        }
    }

    yield { recursion_depth: 0, action_type: 'solution', message: `All-pairs shortest paths computed`, metadata: { dpTable: dist.map(r => [...r]), row: -1, col: -1, itemIndex: -1, weight: -1, value: -1, weights: nodes, values: nodes, capacity: n } };
}

export const floydWarshallModule: AlgorithmModule = {
    id: "floyd-warshall", name: "Floyd-Warshall", category: "Graph Algorithms",
    description: "All-Pairs Shortest Path using dynamic programming. Updates dist[i][j] through each intermediate vertex k.",
    pseudocode: ["for k from 0 to V-1:", "  for i from 0 to V-1:", "    for j from 0 to V-1:", "      dist[i][j] = min(dist[i][j],", "        dist[i][k]+dist[k][j])"],
    complexity: { time: "O(V³)", space: "O(V²)" },
    inputConfig: [
        { name: "nodes", type: "json", label: "Nodes", defaultValue: '["A","B","C","D"]' },
        { name: "edges", type: "json", label: "Edges [from,to,weight]", defaultValue: '[["A","B",3],["A","C",8],["B","C",2],["B","D",5],["C","D",1]]' }
    ],
    generateStates: floydWarshallGenerator
};

// Ford-Fulkerson (Edmonds-Karp)
function* fordFulkersonGenerator({ nodes: nStr, edges: eStr, source: srcStr, sink: sinkStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let nodes: string[], dirEdges: [string, string, number][];
    try { nodes = JSON.parse(nStr); dirEdges = JSON.parse(eStr); } catch { nodes = ["S", "A", "B", "C", "D", "T"]; dirEdges = [["S", "A", 10], ["S", "B", 8], ["A", "B", 5], ["A", "C", 7], ["B", "D", 10], ["C", "T", 8], ["D", "T", 10], ["C", "D", 3]]; }
    const source = srcStr || nodes[0], sink = sinkStr || nodes[nodes.length - 1];

    // Build capacity matrix
    const cap = new Map<string, Map<string, number>>();
    for (const n of nodes) cap.set(n, new Map());
    for (const [u, v, w] of dirEdges) { cap.get(u)!.set(v, (cap.get(u)!.get(v) || 0) + w); if (!cap.get(v)!.has(u)) cap.get(v)!.set(u, 0); }

    const allEdges = dirEdges.map(([u, v, w]) => [u, v, w] as [string, string, number]);

    yield { recursion_depth: 0, action_type: 'none', message: `Ford-Fulkerson (Edmonds-Karp): source=${source}, sink=${sink}`, metadata: buildMeta({ nodes, edges: allEdges, visited: new Set(), distances: new Map(), parent: new Map() }) };

    let maxFlow = 0;

    while (true) {
        // BFS to find augmenting path
        const parent = new Map<string, string>();
        const visited = new Set<string>([source]);
        const queue = [source];
        let found = false;

        while (queue.length > 0 && !found) {
            const u = queue.shift()!;
            for (const [v, c] of cap.get(u)!.entries()) {
                if (!visited.has(v) && c > 0) {
                    visited.add(v); parent.set(v, u); queue.push(v);
                    yield { recursion_depth: 0, action_type: 'explore', message: `BFS: ${u}→${v} (residual cap ${c})`, metadata: buildMeta({ nodes, edges: allEdges, visited, distances: new Map(), parent, activeNode: v, activeEdge: [u, v] }) };
                    if (v === sink) { found = true; break; }
                }
            }
        }

        if (!found) break;

        // Find bottleneck
        let pathFlow = Infinity;
        let v = sink;
        const path: string[] = [sink];
        while (v !== source) { const u = parent.get(v)!; pathFlow = Math.min(pathFlow, cap.get(u)!.get(v)!); v = u; path.unshift(u); }

        yield { recursion_depth: 0, action_type: 'update', message: `Augmenting path: ${path.join('→')}, flow = ${pathFlow}`, metadata: buildMeta({ nodes, edges: allEdges, visited, distances: new Map(), parent, mstEdges: path.slice(0, -1).map((u, i) => [u, path[i + 1], pathFlow] as [string, string, number]) }) };

        // Update residual capacities
        v = sink;
        while (v !== source) { const u = parent.get(v)!; cap.get(u)!.set(v, cap.get(u)!.get(v)! - pathFlow); cap.get(v)!.set(u, (cap.get(v)!.get(u) || 0) + pathFlow); v = u; }
        maxFlow += pathFlow;

        yield { recursion_depth: 0, action_type: 'update', message: `Total flow so far: ${maxFlow}`, metadata: buildMeta({ nodes, edges: allEdges, visited, distances: new Map(), parent }) };
    }

    yield { recursion_depth: 0, action_type: 'solution', message: `Maximum flow: ${maxFlow}`, metadata: buildMeta({ nodes, edges: allEdges, visited: new Set(nodes), distances: new Map(), parent: new Map() }) };
}

export const fordFulkersonModule: AlgorithmModule = {
    id: "ford-fulkerson", name: "Ford-Fulkerson (Max Flow)", category: "Graph Algorithms",
    description: "Find the maximum flow in a flow network using Edmonds-Karp (BFS augmenting paths). Iteratively finds augmenting paths and pushes flow.",
    pseudocode: ["while BFS finds augmenting path:", "  pathFlow = bottleneck along path", "  for each edge in path:", "    decrease forward capacity", "    increase backward capacity", "  maxFlow += pathFlow"],
    complexity: { time: "O(V × E²)", space: "O(V²)" },
    inputConfig: [
        { name: "nodes", type: "json", label: "Nodes", defaultValue: '["S","A","B","C","D","T"]' },
        { name: "edges", type: "json", label: "Directed Edges [from,to,cap]", defaultValue: '[["S","A",10],["S","B",8],["A","B",5],["A","C",7],["B","D",10],["C","T",8],["D","T",10],["C","D",3]]' },
        { name: "source", type: "text", label: "Source", defaultValue: "S" },
        { name: "sink", type: "text", label: "Sink", defaultValue: "T" }
    ],
    generateStates: fordFulkersonGenerator
};

// Bipartite Matching
function* bipartiteMatchingGenerator({ left: lStr, right: rStr, edges: eStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let leftNodes: string[], rightNodes: string[], biEdges: [string, string][];
    try { leftNodes = JSON.parse(lStr); rightNodes = JSON.parse(rStr); biEdges = JSON.parse(eStr); } catch { leftNodes = ["A1", "A2", "A3"]; rightNodes = ["J1", "J2", "J3"]; biEdges = [["A1", "J1"], ["A1", "J2"], ["A2", "J1"], ["A2", "J3"], ["A3", "J2"]]; }

    const nodes = [...leftNodes, ...rightNodes];
    const graphEdges: [string, string, number][] = biEdges.map(([u, v]) => [u, v, 1]);
    const adj = new Map<string, string[]>();
    for (const n of leftNodes) adj.set(n, []);
    for (const [u, v] of biEdges) adj.get(u)!.push(v);

    const matchL = new Map<string, string>();
    const matchR = new Map<string, string>();

    yield { recursion_depth: 0, action_type: 'none', message: `Bipartite Matching: ${leftNodes.length} left, ${rightNodes.length} right, ${biEdges.length} edges`, metadata: buildMeta({ nodes, edges: graphEdges, visited: new Set(), distances: new Map(), parent: new Map() }) };

    function* augment(u: string, visited: Set<string>, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, boolean, unknown> {
        for (const v of adj.get(u) || []) {
            if (visited.has(v)) continue;
            visited.add(v);

            yield { recursion_depth: depth, action_type: 'explore', message: `Try matching ${u} → ${v}`, metadata: buildMeta({ nodes, edges: graphEdges, visited, distances: new Map(), parent: new Map(), activeNode: u, activeEdge: [u, v] }) };

            if (!matchR.has(v) || (yield* augment(matchR.get(v)!, visited, depth + 1))) {
                matchL.set(u, v); matchR.set(v, u);
                yield { recursion_depth: depth, action_type: 'place', message: `Matched ${u} ↔ ${v}`, metadata: buildMeta({ nodes, edges: graphEdges, visited, distances: new Map(), parent: new Map(), activeEdge: [u, v], mstEdges: [...matchL.entries()].map(([a, b]) => [a, b, 1] as [string, string, number]) }) };
                return true;
            }
        }
        yield { recursion_depth: depth, action_type: 'backtrack', message: `No augmenting path from ${u}`, metadata: buildMeta({ nodes, edges: graphEdges, visited, distances: new Map(), parent: new Map(), activeNode: u }) };
        return false;
    }

    let totalMatching = 0;
    for (const u of leftNodes) {
        const visited = new Set<string>();
        yield { recursion_depth: 0, action_type: 'explore', message: `Finding match for ${u}`, metadata: buildMeta({ nodes, edges: graphEdges, visited: new Set(), distances: new Map(), parent: new Map(), activeNode: u }) };
        if (yield* augment(u, visited, 0)) totalMatching++;
    }

    const matchEdges: [string, string, number][] = [...matchL.entries()].map(([a, b]) => [a, b, 1]);
    yield { recursion_depth: 0, action_type: 'solution', message: `Maximum matching: ${totalMatching}. Pairs: ${[...matchL.entries()].map(([a, b]) => `${a}↔${b}`).join(', ')}`, metadata: buildMeta({ nodes, edges: graphEdges, visited: new Set(nodes), distances: new Map(), parent: new Map(), mstEdges: matchEdges }) };
}

export const bipartiteMatchingModule: AlgorithmModule = {
    id: "bipartite-matching", name: "Bipartite Matching", category: "Graph Algorithms",
    description: "Find maximum matching in a bipartite graph using augmenting paths. Each node in the left set is matched to at most one node in the right set.",
    pseudocode: ["for each left node u:", "  try to find augmenting path:", "    for each neighbor v of u:", "      if v unmatched or can re-route:", "        match u ↔ v"],
    complexity: { time: "O(V × E)", space: "O(V)" },
    inputConfig: [
        { name: "left", type: "json", label: "Left Nodes", defaultValue: '["A1","A2","A3"]' },
        { name: "right", type: "json", label: "Right Nodes", defaultValue: '["J1","J2","J3"]' },
        { name: "edges", type: "json", label: "Edges [left,right]", defaultValue: '[["A1","J1"],["A1","J2"],["A2","J1"],["A2","J3"],["A3","J2"]]' }
    ],
    generateStates: bipartiteMatchingGenerator
};

// Kosaraju's SCC
function* kosarajuGenerator({ nodes: nStr, edges: eStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let nodes: string[], dirEdges: [string, string, number][];
    try { nodes = JSON.parse(nStr); dirEdges = JSON.parse(eStr); } catch { nodes = ["A", "B", "C", "D", "E", "F", "G", "H"]; dirEdges = [["A", "B", 1], ["B", "C", 1], ["C", "A", 1], ["B", "D", 1], ["D", "E", 1], ["E", "F", 1], ["F", "D", 1], ["G", "F", 1], ["G", "H", 1], ["H", "G", 1]]; }

    const adj = new Map<string, string[]>();
    const radj = new Map<string, string[]>();
    for (const n of nodes) { adj.set(n, []); radj.set(n, []); }
    for (const [u, v] of dirEdges) { adj.get(u)!.push(v); radj.get(v)!.push(u); }

    yield { recursion_depth: 0, action_type: 'none', message: `Kosaraju's SCC on ${nodes.length} nodes`, metadata: buildMeta({ nodes, edges: dirEdges, visited: new Set(), distances: new Map(), parent: new Map() }) };

    // Pass 1: DFS to get finish order
    const visited = new Set<string>();
    const stack: string[] = [];

    function* dfs1(node: string, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        visited.add(node);
        for (const neighbor of adj.get(node) || []) {
            if (!visited.has(neighbor)) {
                yield { recursion_depth: depth, action_type: 'explore', message: `Pass 1: DFS ${node}→${neighbor}`, metadata: buildMeta({ nodes, edges: dirEdges, visited, distances: new Map(), parent: new Map(), activeNode: neighbor, activeEdge: [node, neighbor] }) };
                yield* dfs1(neighbor, depth + 1);
            }
        }
        stack.push(node);
    }

    for (const n of nodes) {
        if (!visited.has(n)) yield* dfs1(n, 0);
    }

    yield { recursion_depth: 0, action_type: 'update', message: `Pass 1 finish order: [${[...stack].reverse().join(', ')}]`, metadata: buildMeta({ nodes, edges: dirEdges, visited, distances: new Map(), parent: new Map() }) };

    // Pass 2: DFS on transpose in reverse finish order
    visited.clear();
    const sccs: string[][] = [];

    function* dfs2(node: string, component: string[], depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        visited.add(node);
        component.push(node);
        for (const neighbor of radj.get(node) || []) {
            if (!visited.has(neighbor)) {
                yield { recursion_depth: depth, action_type: 'explore', message: `Pass 2: ${node}→${neighbor} (transpose)`, metadata: buildMeta({ nodes, edges: dirEdges, visited, distances: new Map(), parent: new Map(), activeNode: neighbor, activeEdge: [node, neighbor] }) };
                yield* dfs2(neighbor, component, depth + 1);
            }
        }
    }

    while (stack.length > 0) {
        const n = stack.pop()!;
        if (!visited.has(n)) {
            const component: string[] = [];
            yield { recursion_depth: 0, action_type: 'explore', message: `Pass 2: new SCC from ${n}`, metadata: buildMeta({ nodes, edges: dirEdges, visited, distances: new Map(), parent: new Map(), activeNode: n }) };
            yield* dfs2(n, component, 0);
            sccs.push(component);
            yield { recursion_depth: 0, action_type: 'place', message: `SCC #${sccs.length}: {${component.join(', ')}}`, metadata: buildMeta({ nodes, edges: dirEdges, visited, distances: new Map(), parent: new Map() }) };
        }
    }

    yield { recursion_depth: 0, action_type: 'solution', message: `Found ${sccs.length} SCCs: ${sccs.map(c => `{${c.join(',')}}`).join(', ')}`, metadata: buildMeta({ nodes, edges: dirEdges, visited: new Set(nodes), distances: new Map(), parent: new Map() }) };
}

export const kosarajuModule: AlgorithmModule = {
    id: "kosaraju", name: "Kosaraju's SCC", category: "Graph Algorithms",
    description: "Find Strongly Connected Components using two DFS passes: first on the original graph to get finish order, then on the transpose graph in reverse finish order.",
    pseudocode: ["Pass 1: DFS on graph → finish stack", "Transpose the graph", "Pass 2: DFS on transpose in", "  reverse finish order", "Each DFS tree = one SCC"],
    complexity: { time: "O(V + E)", space: "O(V)" },
    inputConfig: [
        { name: "nodes", type: "json", label: "Nodes", defaultValue: '["A","B","C","D","E","F","G","H"]' },
        { name: "edges", type: "json", label: "Directed Edges [from,to,w]", defaultValue: '[["A","B",1],["B","C",1],["C","A",1],["B","D",1],["D","E",1],["E","F",1],["F","D",1],["G","F",1],["G","H",1],["H","G",1]]' }
    ],
    generateStates: kosarajuGenerator
};
