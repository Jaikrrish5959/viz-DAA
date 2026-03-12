import type { AlgorithmModule, ExecutionState } from '../../types';

function* closestPairGenerator({ points: pStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let points: [number, number][];
    try { points = JSON.parse(pStr); } catch { points = [[2, 3], [12, 30], [40, 50], [5, 1], [12, 10], [3, 4]]; }

    const dist = (a: [number, number], b: [number, number]) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
    const nodes = points.map((p, i) => `P${i}(${p[0]},${p[1]})`);
    const edges: [string, string, number][] = [];

    yield {
        recursion_depth: 0, action_type: 'none', message: `Finding closest pair among ${points.length} points`,
        metadata: { nodes, edges, visited: [], distances: {}, activeNode: '', activeEdge: null, parent: {} }
    };

    let minDist = Infinity, bestA = 0, bestB = 1;

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const d = dist(points[i], points[j]);
            const nA = nodes[i], nB = nodes[j];

            yield {
                recursion_depth: 0, action_type: 'compare',
                message: `Distance(${nA}, ${nB}) = ${d.toFixed(2)}`,
                metadata: { nodes, edges: [...edges], visited: [nA, nB], distances: {}, activeNode: nA, activeEdge: [nA, nB], parent: {} }
            };

            if (d < minDist) {
                minDist = d;
                bestA = i; bestB = j;
                yield {
                    recursion_depth: 0, action_type: 'update',
                    message: `New minimum! ${d.toFixed(2)} between ${nA} and ${nB}`,
                    metadata: { nodes, edges: [[nA, nB, Math.round(d * 100) / 100]], visited: [nA, nB], distances: {}, activeNode: nA, activeEdge: [nA, nB], parent: {}, mstEdges: [[nA, nB, Math.round(d * 100) / 100]] }
                };
            }
        }
    }

    yield {
        recursion_depth: 0, action_type: 'solution',
        message: `Closest pair: ${nodes[bestA]} and ${nodes[bestB]}, distance = ${minDist.toFixed(2)}`,
        metadata: { nodes, edges: [[nodes[bestA], nodes[bestB], Math.round(minDist * 100) / 100]], visited: [nodes[bestA], nodes[bestB]], distances: {}, activeNode: nodes[bestA], activeEdge: [nodes[bestA], nodes[bestB]], parent: {}, mstEdges: [[nodes[bestA], nodes[bestB], Math.round(minDist * 100) / 100]] }
    };
}

export const closestPairModule: AlgorithmModule = {
    id: "closest-pair", name: "Closest Pair of Points", category: "Divide and Conquer",
    description: "Find the pair of points with the minimum Euclidean distance. The brute-force approach checks all pairs; divide and conquer improves this to O(n log n).",
    pseudocode: ["for each pair (i, j):", "  d = distance(P[i], P[j])", "  if d < minDist:", "    minDist = d", "    bestPair = (i, j)", "return bestPair"],
    complexity: { time: "O(n log n)", space: "O(n)" },
    inputConfig: [{ name: "points", type: "json", label: "Points [[x,y],...]", defaultValue: "[[2,3],[12,30],[40,50],[5,1],[12,10],[3,4]]" }],
    generateStates: closestPairGenerator
};
