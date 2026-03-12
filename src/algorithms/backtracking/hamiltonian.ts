import type { AlgorithmModule, ExecutionState } from '../../types';

function* hamiltonianGenerator({ numVertices: nStr, edges: eStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let nv = 5;
    let edges: number[][] = [];
    try {
        nv = parseInt(nStr, 10);
        edges = JSON.parse(eStr);
    } catch {
        nv = 5; edges = [[0, 1], [0, 3], [1, 2], [1, 3], [1, 4], [2, 4], [3, 4]];
    }

    const adj: boolean[][] = Array.from({ length: nv }, () => Array(nv).fill(false));
    for (const [u, v] of edges) { adj[u][v] = true; adj[v][u] = true; }

    const path = [0];
    const visited = new Array(nv).fill(false);
    visited[0] = true;

    const board = () => [path.map(p => p)];

    yield {
        board: board(), recursion_depth: 0, action_type: 'none',
        message: `Finding Hamiltonian Path in graph with ${nv} vertices`,
        metadata: { path: [...path], nv, edges }
    };

    function* solve(depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, boolean, unknown> {
        if (path.length === nv) {
            yield {
                board: board(), recursion_depth: depth, action_type: 'solution',
                message: `Hamiltonian Path found: ${path.join(' → ')}`,
                metadata: { path: [...path], nv, edges }
            };
            return true;
        }

        const last = path[path.length - 1];
        for (let v = 0; v < nv; v++) {
            if (adj[last][v] && !visited[v]) {
                yield {
                    board: board(), recursion_depth: depth, action_type: 'try',
                    message: `Trying vertex ${v} from ${last}`,
                    metadata: { path: [...path], nv, edges, activeVertex: v }
                };

                path.push(v);
                visited[v] = true;

                yield {
                    board: board(), recursion_depth: depth, action_type: 'place',
                    message: `Added vertex ${v} to path`,
                    metadata: { path: [...path], nv, edges, activeVertex: v }
                };

                if (yield* solve(depth + 1)) return true;

                path.pop();
                visited[v] = false;
                yield {
                    board: board(), recursion_depth: depth, action_type: 'backtrack',
                    message: `Removed vertex ${v} from path`,
                    metadata: { path: [...path], nv, edges, activeVertex: v }
                };
            }
        }
        return false;
    }

    const found: boolean = yield* solve(0);
    if (!found) {
        yield {
            board: board(), recursion_depth: 0, action_type: 'conflict',
            message: 'No Hamiltonian Path exists',
            metadata: { path: [...path], nv, edges }
        };
    }
}

export const hamiltonianModule: AlgorithmModule = {
    id: "hamiltonian", name: "Hamiltonian Path", category: "Backtracking",
    description: "Find a path that visits every vertex exactly once in an undirected graph using backtracking.",
    pseudocode: [
        "solve(path):",
        "  if path.length == n: solution",
        "  for each neighbor v of last vertex:",
        "    if not visited[v]:",
        "      add v to path",
        "      solve(path)",
        "      backtrack"
    ],
    complexity: { time: "O(n!)", space: "O(n)" },
    inputConfig: [
        { name: "numVertices", type: "number", label: "Vertices", defaultValue: 5, min: 3, max: 8 },
        { name: "edges", type: "json", label: "Edges", defaultValue: "[[0,1],[0,3],[1,2],[1,3],[1,4],[2,4],[3,4]]" }
    ],
    generateStates: hamiltonianGenerator
};
