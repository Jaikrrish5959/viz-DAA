import type { AlgorithmModule, ExecutionState } from '../../types';

// B&B Knapsack
function* bnbKnapsackGenerator({ weights: wStr, values: vStr, capacity: cStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let weights: number[], values: number[], cap: number;
    try { weights = JSON.parse(wStr); values = JSON.parse(vStr); cap = parseInt(cStr, 10); } catch { weights = [2, 3, 4, 5]; values = [3, 4, 5, 6]; cap = 5; }
    const n = weights.length;

    function bound(idx: number, w: number, v: number): number {
        if (w > cap) return 0;
        let b = v, tw = w;
        for (let i = idx; i < n && tw + weights[i] <= cap; i++) { tw += weights[i]; b += values[i]; }
        if (idx < n) b += (cap - tw) * (values[idx] / weights[idx]);
        return b;
    }

    let bestVal = 0; let bestItems: number[] = [];
    const current: number[] = [];

    yield { recursion_depth: 0, action_type: 'none', array: values, message: `B&B Knapsack: ${n} items, capacity=${cap}`, metadata: { weights, values, cap, bestVal, bestItems: [], current: [], indices: [] } };

    function* solve(idx: number, w: number, v: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        if (w <= cap && v > bestVal) { bestVal = v; bestItems = [...current]; }

        if (idx >= n) return;

        const ub = bound(idx, w, v);
        yield { recursion_depth: depth, action_type: 'explore', array: values, message: `Node: item ${idx}, weight=${w}, value=${v}, bound=${ub.toFixed(1)}`, metadata: { weights, values, cap, bestVal, bestItems: [...bestItems], current: [...current], indices: [idx] } };

        if (ub <= bestVal) {
            yield { recursion_depth: depth, action_type: 'conflict', array: values, message: `Pruned! Bound ${ub.toFixed(1)} ≤ best ${bestVal}`, metadata: { weights, values, cap, bestVal, bestItems: [...bestItems], current: [...current], indices: [idx] } };
            return;
        }

        // Include item
        if (w + weights[idx] <= cap) {
            current.push(idx);
            yield { recursion_depth: depth, action_type: 'place', array: values, message: `Including item ${idx} (w=${weights[idx]}, v=${values[idx]})`, metadata: { weights, values, cap, bestVal, bestItems: [...bestItems], current: [...current], indices: [idx] } };
            yield* solve(idx + 1, w + weights[idx], v + values[idx], depth + 1);
            current.pop();
            yield { recursion_depth: depth, action_type: 'backtrack', array: values, message: `Backtrack: excluded item ${idx}`, metadata: { weights, values, cap, bestVal, bestItems: [...bestItems], current: [...current], indices: [idx] } };
        }

        // Exclude item
        yield* solve(idx + 1, w, v, depth + 1);
    }

    yield* solve(0, 0, 0, 0);

    yield { recursion_depth: 0, action_type: 'solution', array: values, message: `Best value: ${bestVal}. Items: [${bestItems.join(', ')}]`, metadata: { weights, values, cap, bestVal, bestItems, current: [], indices: [] } };
}

export const bnbKnapsackModule: AlgorithmModule = {
    id: "bnb-knapsack", name: "Knapsack (B&B)", category: "Branch and Bound",
    description: "Solve 0-1 Knapsack using Branch and Bound with upper bound pruning for faster search.",
    pseudocode: ["solve(idx, weight, value):", "  compute upper bound", "  if bound <= best: PRUNE", "  include item → recurse", "  exclude item → recurse"],
    complexity: { time: "O(2ⁿ) worst", space: "O(n)" },
    inputConfig: [
        { name: "weights", type: "json", label: "Weights", defaultValue: "[2,3,4,5]" },
        { name: "values", type: "json", label: "Values", defaultValue: "[3,4,5,6]" },
        { name: "capacity", type: "number", label: "Capacity", defaultValue: 5 }
    ],
    generateStates: bnbKnapsackGenerator
};

// TSP (Brute Force with B&B pruning)
function* tspGenerator({ distances: dStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let dist: number[][];
    try { dist = JSON.parse(dStr); } catch { dist = [[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]]; }
    const n = dist.length;
    let bestCost = Infinity; let bestPath: number[] = [];
    const path = [0]; const visited = new Set([0]);

    yield { recursion_depth: 0, action_type: 'none', array: dist[0], message: `TSP: ${n} cities`, metadata: { dist, bestCost, bestPath: [], path: [0], indices: [] } };

    function* solve(cost: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        if (path.length === n) {
            const total = cost + dist[path[path.length - 1]][0];
            yield { recursion_depth: depth, action_type: 'compare', array: dist[0], message: `Complete tour: ${path.join('→')}→0. Cost=${total}`, metadata: { dist, bestCost, bestPath: [...bestPath], path: [...path], indices: [] } };
            if (total < bestCost) {
                bestCost = total; bestPath = [...path];
                yield { recursion_depth: depth, action_type: 'update', array: dist[0], message: `New best! Cost=${total}`, metadata: { dist, bestCost, bestPath: [...bestPath], path: [...path], indices: [] } };
            }
            return;
        }

        if (cost >= bestCost) {
            yield { recursion_depth: depth, action_type: 'conflict', array: dist[0], message: `Pruned: cost ${cost} ≥ best ${bestCost}`, metadata: { dist, bestCost, bestPath: [...bestPath], path: [...path], indices: [] } };
            return;
        }

        for (let i = 0; i < n; i++) {
            if (!visited.has(i)) {
                path.push(i); visited.add(i);
                yield { recursion_depth: depth, action_type: 'try', array: dist[0], message: `Visiting city ${i}. Cost so far: ${cost + dist[path[path.length - 2]][i]}`, metadata: { dist, bestCost, bestPath: [...bestPath], path: [...path], indices: [i] } };
                yield* solve(cost + dist[path[path.length - 2]][i], depth + 1);
                path.pop(); visited.delete(i);
                yield { recursion_depth: depth, action_type: 'backtrack', array: dist[0], message: `Backtrack from city ${i}`, metadata: { dist, bestCost, bestPath: [...bestPath], path: [...path], indices: [i] } };
            }
        }
    }

    yield* solve(0, 0);
    yield { recursion_depth: 0, action_type: 'solution', array: dist[0], message: `Optimal tour: ${bestPath.join('→')}→0. Cost=${bestCost}`, metadata: { dist, bestCost, bestPath, path: [], indices: [] } };
}

export const tspModule: AlgorithmModule = {
    id: "tsp", name: "Traveling Salesman", category: "Branch and Bound",
    description: "Find the shortest route visiting all cities exactly once and returning to start. Uses Branch and Bound with cost pruning.",
    pseudocode: ["solve(path, cost):", "  if complete: check total", "  if cost >= best: PRUNE", "  for each unvisited city:", "    add to path, recurse", "    backtrack"],
    complexity: { time: "O(n!)", space: "O(n)" },
    inputConfig: [{ name: "distances", type: "json", label: "Distance Matrix", defaultValue: "[[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]" }],
    generateStates: tspGenerator
};
