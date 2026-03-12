import type { AlgorithmModule, ExecutionState } from '../../types';

function* matrixChainGenerator({ dimensions: dStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let dims: number[] = [];
    try {
        dims = JSON.parse(dStr);
        if (dims.length < 2) throw new Error();
    } catch {
        dims = [10, 30, 5, 60];
    }

    const n = dims.length - 1; // number of matrices
    const dp: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const split: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    function cloneDp() { return dp.map(r => [...r]); }

    yield {
        recursion_depth: 0, action_type: 'none',
        message: `Matrix Chain Multiplication: ${n} matrices with dimensions [${dims.join(', ')}]`,
        metadata: { dpTable: cloneDp(), dims, row: -1, col: -1, weights: dims.slice(0, -1).map((_, i) => `M${i + 1}`), values: dims, capacity: n - 1 }
    };

    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;

            yield {
                recursion_depth: 0, action_type: 'explore',
                message: `Computing optimal cost for multiplying M${i + 1}..M${j + 1} (chain length ${len})`,
                metadata: { dpTable: cloneDp(), dims, row: i, col: j, weights: dims.slice(0, -1).map((_, k) => `M${k + 1}`), values: dims, capacity: n - 1 }
            };

            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];

                yield {
                    recursion_depth: 0, action_type: 'compare',
                    message: `Split at k=${k + 1}: cost = dp[${i}][${k}](${dp[i][k]}) + dp[${k + 1}][${j}](${dp[k + 1][j]}) + ${dims[i]}×${dims[k + 1]}×${dims[j + 1]} = ${cost}`,
                    metadata: {
                        dpTable: cloneDp(), dims, row: i, col: j,
                        compareInclude: { row: i, col: k, val: dp[i][k] },
                        compareExclude: { row: k + 1, col: j, val: dp[k + 1][j] },
                        weights: dims.slice(0, -1).map((_, k2) => `M${k2 + 1}`), values: dims, capacity: n - 1
                    }
                };

                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                    split[i][j] = k;

                    yield {
                        recursion_depth: 0, action_type: 'update',
                        message: `Updated dp[${i}][${j}] = ${cost} (split at k=${k + 1})`,
                        metadata: { dpTable: cloneDp(), dims, row: i, col: j, weights: dims.slice(0, -1).map((_, k2) => `M${k2 + 1}`), values: dims, capacity: n - 1 }
                    };
                }
            }
        }
    }

    // Build optimal parenthesization
    function buildParens(i: number, j: number): string {
        if (i === j) return `M${i + 1}`;
        return `(${buildParens(i, split[i][j])} × ${buildParens(split[i][j] + 1, j)})`;
    }

    yield {
        recursion_depth: 0, action_type: 'solution',
        message: `Minimum multiplications: ${dp[0][n - 1]}. Optimal: ${buildParens(0, n - 1)}`,
        metadata: {
            dpTable: cloneDp(), dims, row: -1, col: -1,
            maxValue: dp[0][n - 1], selectedItems: [],
            weights: dims.slice(0, -1).map((_, k) => `M${k + 1}`), values: dims, capacity: n - 1
        }
    };
}

export const matrixChainModule: AlgorithmModule = {
    id: "matrix-chain",
    name: "Matrix Chain Multiplication",
    category: "Dynamic Programming",
    description: "Determine the most efficient way to multiply a given sequence of matrices. The problem is to find the optimal parenthesization that minimizes scalar multiplications.",
    pseudocode: [
        "for len from 2 to n:",
        "  for i from 0 to n-len:",
        "    j = i + len - 1",
        "    dp[i][j] = INF",
        "    for k from i to j-1:",
        "      cost = dp[i][k] + dp[k+1][j] + d[i]*d[k+1]*d[j+1]",
        "      if cost < dp[i][j]: dp[i][j] = cost"
    ],
    complexity: { time: "O(n³)", space: "O(n²)" },
    inputConfig: [
        { name: "dimensions", type: "json", label: "Dimensions Array", defaultValue: "[10,30,5,60]" }
    ],
    generateStates: matrixChainGenerator
};
