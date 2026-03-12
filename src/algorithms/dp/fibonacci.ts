import type { AlgorithmModule, ExecutionState } from '../../types';

function* fibonacciGenerator({ n: nStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let n: number;
    try { n = parseInt(nStr, 10); } catch { n = 10; }
    if (isNaN(n) || n < 2) n = 10;
    if (n > 30) n = 30;

    const dp: number[][] = [Array(n + 1).fill(0)];
    dp[0][0] = 0; dp[0][1] = 1;

    yield { recursion_depth: 0, action_type: 'none', message: `Computing Fibonacci(0..${n}) using tabulation`, metadata: { dpTable: dp.map(r => [...r]), row: 0, col: 0, itemIndex: -1, weight: -1, value: -1, weights: [], values: [], capacity: n } };

    for (let i = 2; i <= n; i++) {
        yield { recursion_depth: 0, action_type: 'compare', message: `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[0][i - 1]} + ${dp[0][i - 2]}`, metadata: { dpTable: dp.map(r => [...r]), row: 0, col: i, itemIndex: -1, weight: -1, value: -1, weights: [], values: [], capacity: n } };

        dp[0][i] = dp[0][i - 1] + dp[0][i - 2];

        yield { recursion_depth: 0, action_type: 'update', message: `F(${i}) = ${dp[0][i]}`, metadata: { dpTable: dp.map(r => [...r]), row: 0, col: i, itemIndex: -1, weight: -1, value: -1, weights: [], values: [], capacity: n } };
    }

    yield { recursion_depth: 0, action_type: 'solution', message: `Fibonacci(${n}) = ${dp[0][n]}. Sequence: ${dp[0].slice(0, n + 1).join(', ')}`, metadata: { dpTable: dp.map(r => [...r]), row: 0, col: n, itemIndex: -1, weight: -1, value: -1, weights: [], values: [], capacity: n } };
}

export const fibonacciModule: AlgorithmModule = {
    id: "fibonacci", name: "Fibonacci (DP)", category: "Dynamic Programming",
    description: "Compute Fibonacci numbers using dynamic programming tabulation. Classic DP introductory problem showing how memoization eliminates exponential redundant computation.",
    pseudocode: ["dp[0] = 0, dp[1] = 1", "for i from 2 to n:", "  dp[i] = dp[i-1] + dp[i-2]", "return dp[n]"],
    complexity: { time: "O(n)", space: "O(n)" },
    inputConfig: [{ name: "n", type: "number", label: "Compute F(n)", defaultValue: 10, min: 2, max: 30 }],
    generateStates: fibonacciGenerator
};
