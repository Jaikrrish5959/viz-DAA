import type { AlgorithmModule, ExecutionState } from '../../types';

function* convexHullGenerator({ points: pStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let pts: [number, number][];
    try { pts = JSON.parse(pStr); } catch { pts = [[0, 3], [1, 1], [2, 2], [4, 4], [0, 0], [1, 2], [3, 1], [3, 3]]; }

    const nodes = pts.map((p, i) => `P${i}(${p[0]},${p[1]})`);

    yield { recursion_depth: 0, action_type: 'none', message: `Convex Hull (Graham Scan) for ${pts.length} points`, metadata: { nodes, edges: [], visited: [], distances: {}, activeNode: '', activeEdge: null, parent: {} } };

    // Find lowest y point (leftmost if tie)
    let lowest = 0;
    for (let i = 1; i < pts.length; i++) {
        if (pts[i][1] < pts[lowest][1] || (pts[i][1] === pts[lowest][1] && pts[i][0] < pts[lowest][0])) lowest = i;
    }
    [pts[0], pts[lowest]] = [pts[lowest], pts[0]];
    const newNodes = pts.map((p, i) => `P${i}(${p[0]},${p[1]})`);

    yield { recursion_depth: 0, action_type: 'explore', message: `Anchor point: (${pts[0][0]},${pts[0][1]})`, metadata: { nodes: newNodes, edges: [], visited: [newNodes[0]], distances: {}, activeNode: newNodes[0], activeEdge: null, parent: {} } };

    const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
        (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

    const anchor = pts[0];
    const sorted = pts.slice(1).sort((a, b) => {
        const angle = Math.atan2(a[1] - anchor[1], a[0] - anchor[0]) - Math.atan2(b[1] - anchor[1], b[0] - anchor[0]);
        return angle !== 0 ? angle : Math.hypot(a[0] - anchor[0], a[1] - anchor[1]) - Math.hypot(b[0] - anchor[0], b[1] - anchor[1]);
    });
    pts = [anchor, ...sorted];
    const sortedNodes = pts.map((p, i) => `P${i}(${p[0]},${p[1]})`);

    yield { recursion_depth: 0, action_type: 'explore', message: `Points sorted by polar angle`, metadata: { nodes: sortedNodes, edges: [], visited: sortedNodes, distances: {}, activeNode: '', activeEdge: null, parent: {} } };

    const stack: number[] = [0, 1];
    const hullEdges = (): [string, string, number][] => {
        const e: [string, string, number][] = [];
        for (let i = 0; i < stack.length - 1; i++) e.push([sortedNodes[stack[i]], sortedNodes[stack[i + 1]], 1]);
        if (stack.length > 2) e.push([sortedNodes[stack[stack.length - 1]], sortedNodes[stack[0]], 1]);
        return e;
    };

    for (let i = 2; i < pts.length; i++) {
        yield { recursion_depth: 0, action_type: 'compare', message: `Processing ${sortedNodes[i]}`, metadata: { nodes: sortedNodes, edges: hullEdges(), visited: stack.map(s => sortedNodes[s]), distances: {}, activeNode: sortedNodes[i], activeEdge: null, parent: {}, mstEdges: hullEdges() } };

        while (stack.length > 1 && cross(pts[stack[stack.length - 2]], pts[stack[stack.length - 1]], pts[i]) <= 0) {
            const removed = stack.pop()!;
            yield { recursion_depth: 0, action_type: 'backtrack', message: `Removed ${sortedNodes[removed]} (clockwise turn)`, metadata: { nodes: sortedNodes, edges: hullEdges(), visited: stack.map(s => sortedNodes[s]), distances: {}, activeNode: sortedNodes[i], activeEdge: null, parent: {}, mstEdges: hullEdges() } };
        }
        stack.push(i);
        yield { recursion_depth: 0, action_type: 'update', message: `Added ${sortedNodes[i]} to hull`, metadata: { nodes: sortedNodes, edges: hullEdges(), visited: stack.map(s => sortedNodes[s]), distances: {}, activeNode: sortedNodes[i], activeEdge: null, parent: {}, mstEdges: hullEdges() } };
    }

    yield { recursion_depth: 0, action_type: 'solution', message: `Convex Hull: ${stack.map(s => sortedNodes[s]).join(' → ')}`, metadata: { nodes: sortedNodes, edges: hullEdges(), visited: stack.map(s => sortedNodes[s]), distances: {}, activeNode: '', activeEdge: null, parent: {}, mstEdges: hullEdges() } };
}

export const convexHullModule: AlgorithmModule = {
    id: "convex-hull", name: "Convex Hull (Graham Scan)", category: "Divide and Conquer",
    description: "Find the convex hull of a set of 2D points using Graham Scan. Sort points by polar angle from anchor, then process using a stack to eliminate clockwise turns.",
    pseudocode: ["Find lowest y-point (anchor)", "Sort by polar angle from anchor", "Push first 2 points to stack", "for each remaining point:", "  while clockwise turn: pop", "  push point"],
    complexity: { time: "O(n log n)", space: "O(n)" },
    inputConfig: [{ name: "points", type: "json", label: "Points [[x,y],...]", defaultValue: "[[0,3],[1,1],[2,2],[4,4],[0,0],[1,2],[3,1],[3,3]]" }],
    generateStates: convexHullGenerator
};
