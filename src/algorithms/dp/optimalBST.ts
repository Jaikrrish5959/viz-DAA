import type { AlgorithmModule, ExecutionState } from '../../types';

function* optimalBSTGenerator({ keys: kStr, freq: fStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let keys: number[], freq: number[];
    try { keys = JSON.parse(kStr); freq = JSON.parse(fStr); } catch { keys = [10, 12, 20]; freq = [34, 8, 50]; }
    if (keys.length !== freq.length) { keys = [10, 12, 20]; freq = [34, 8, 50]; }

    const n = keys.length;
    const cost: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const sumFreq: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    // Base: single keys
    for (let i = 0; i < n; i++) { cost[i][i] = freq[i]; sumFreq[i][i] = freq[i]; }

    yield { recursion_depth: 0, action_type: 'none', message: `Optimal BST for keys [${keys.join(', ')}] with frequencies [${freq.join(', ')}]`, metadata: { dpTable: cost.map(r => [...r]), row: 0, col: 0, itemIndex: -1, weight: -1, value: -1, weights: keys, values: freq, capacity: n } };

    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            sumFreq[i][j] = sumFreq[i][j - 1] + freq[j];
            cost[i][j] = Infinity;

            yield { recursion_depth: 0, action_type: 'explore', message: `Computing cost[${i}][${j}] for keys ${keys.slice(i, j + 1).join(',')}`, metadata: { dpTable: cost.map(r => r.map(v => v === Infinity ? -1 : v)), row: i, col: j, itemIndex: -1, weight: -1, value: -1, weights: keys, values: freq, capacity: n } };

            for (let r = i; r <= j; r++) {
                const leftCost = r > i ? cost[i][r - 1] : 0;
                const rightCost = r < j ? cost[r + 1][j] : 0;
                const c = leftCost + rightCost + sumFreq[i][j];

                yield { recursion_depth: 0, action_type: 'compare', message: `Root=${keys[r]}: left=${leftCost} + right=${rightCost} + sum=${sumFreq[i][j]} = ${c}`, metadata: { dpTable: cost.map(r2 => r2.map(v => v === Infinity ? -1 : v)), row: i, col: j, itemIndex: r, weight: -1, value: -1, weights: keys, values: freq, capacity: n } };

                if (c < cost[i][j]) {
                    cost[i][j] = c;
                    yield { recursion_depth: 0, action_type: 'update', message: `Best root for [${i}..${j}] = ${keys[r]}, cost = ${c}`, metadata: { dpTable: cost.map(r2 => [...r2]), row: i, col: j, itemIndex: r, weight: -1, value: -1, weights: keys, values: freq, capacity: n } };
                }
            }
        }
    }

    yield { recursion_depth: 0, action_type: 'solution', message: `Minimum search cost = ${cost[0][n - 1]}`, metadata: { dpTable: cost.map(r => [...r]), row: 0, col: n - 1, itemIndex: -1, weight: -1, value: -1, weights: keys, values: freq, capacity: n } };
}

export const optimalBSTModule: AlgorithmModule = {
    id: "optimal-bst", name: "Optimal BST", category: "Dynamic Programming",
    description: "Find the optimal binary search tree that minimizes total search cost given key frequencies. Uses DP to try every possible root for each subrange.",
    pseudocode: ["for length from 2 to n:", "  for i from 0 to n-length:", "    j = i + length - 1", "    for each root r in [i..j]:", "      cost[i][j] = min(left + right + sum_freq)"],
    complexity: { time: "O(n³)", space: "O(n²)" },
    inputConfig: [
        { name: "keys", type: "json", label: "Keys", defaultValue: "[10,12,20]" },
        { name: "freq", type: "json", label: "Frequencies", defaultValue: "[34,8,50]" }
    ],
    generateStates: optimalBSTGenerator
};
