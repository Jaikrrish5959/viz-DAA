import type { AlgorithmModule, ExecutionState } from '../../types';

function* graphColoringGenerator({ numVertices: nStr, edges: eStr, numColors: cStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let nv = 4, edges: number[][] = [], numColors = 3;
    try {
        nv = parseInt(nStr, 10);
        edges = JSON.parse(eStr);
        numColors = parseInt(cStr, 10);
    } catch {
        nv = 4; edges = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3]]; numColors = 3;
    }

    // Build adjacency
    const adj: boolean[][] = Array.from({ length: nv }, () => Array(nv).fill(false));
    for (const [u, v] of edges) { adj[u][v] = true; adj[v][u] = true; }

    const colors = new Array(nv).fill(0);
    const board = () => [colors.map(c => c)];

    yield {
        board: board(), recursion_depth: 0, action_type: 'none',
        message: `Graph Coloring: ${nv} vertices, ${numColors} colors`,
        metadata: { colors: [...colors], nv, numColors, edges }
    };

    function isSafe(v: number, c: number): boolean {
        for (let i = 0; i < nv; i++) if (adj[v][i] && colors[i] === c) return false;
        return true;
    }

    function* solve(v: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, boolean, unknown> {
        if (v === nv) {
            yield {
                board: board(), recursion_depth: depth, action_type: 'solution',
                message: `All vertices colored: [${colors.join(', ')}]`,
                metadata: { colors: [...colors], nv, numColors, edges }
            };
            return true;
        }

        for (let c = 1; c <= numColors; c++) {
            yield {
                board: board(), recursion_depth: depth, action_type: 'try',
                message: `Trying color ${c} on vertex ${v}`,
                metadata: { colors: [...colors], nv, numColors, edges, activeVertex: v }
            };

            if (isSafe(v, c)) {
                colors[v] = c;
                yield {
                    board: board(), recursion_depth: depth, action_type: 'place',
                    message: `Assigned color ${c} to vertex ${v}`,
                    metadata: { colors: [...colors], nv, numColors, edges, activeVertex: v }
                };

                if (yield* solve(v + 1, depth + 1)) return true;

                colors[v] = 0;
                yield {
                    board: board(), recursion_depth: depth, action_type: 'backtrack',
                    message: `Removed color from vertex ${v}`,
                    metadata: { colors: [...colors], nv, numColors, edges, activeVertex: v }
                };
            } else {
                yield {
                    board: board(), recursion_depth: depth, action_type: 'conflict',
                    message: `Color ${c} conflicts on vertex ${v}`,
                    metadata: { colors: [...colors], nv, numColors, edges, activeVertex: v }
                };
            }
        }
        return false;
    }

    yield* solve(0, 0);
}

export const graphColoringModule: AlgorithmModule = {
    id: "graph-coloring", name: "Graph Coloring", category: "Backtracking",
    description: "Assign colors to vertices of a graph such that no two adjacent vertices share the same color, using the minimum number of colors.",
    pseudocode: [
        "solve(vertex):",
        "  if vertex == n: solution found",
        "  for color 1 to m:",
        "    if isSafe(vertex, color):",
        "      assign color",
        "      solve(vertex + 1)",
        "      backtrack"
    ],
    complexity: { time: "O(m^n)", space: "O(n)" },
    inputConfig: [
        { name: "numVertices", type: "number", label: "Number of Vertices", defaultValue: 4, min: 2, max: 10 },
        { name: "edges", type: "json", label: "Edges Array", defaultValue: "[[0,1],[0,2],[1,2],[1,3],[2,3]]" },
        { name: "numColors", type: "number", label: "Number of Colors", defaultValue: 3, min: 1, max: 6 }
    ],
    generateStates: graphColoringGenerator
};
