import type { AlgorithmModule, ExecutionState } from '../../types';

function* lcsGenerator({ str1, str2 }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const a: string = str1 || "ABCBDAB";
    const b: string = str2 || "BDCAB";
    const m = a.length;
    const n = b.length;

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    function cloneDp() { return dp.map(r => [...r]); }

    yield {
        recursion_depth: 0, action_type: 'none',
        message: `Initialized ${m + 1}x${n + 1} DP table for LCS("${a}", "${b}").`,
        metadata: { dpTable: cloneDp(), str1: a, str2: b, row: -1, col: -1, weights: [...a], values: [...b], capacity: n }
    };

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            yield {
                recursion_depth: 0, action_type: 'explore',
                message: `Comparing "${a[i - 1]}" (str1[${i - 1}]) with "${b[j - 1]}" (str2[${j - 1}])`,
                metadata: { dpTable: cloneDp(), str1: a, str2: b, row: i, col: j, weights: [...a], values: [...b], capacity: n }
            };

            if (a[i - 1] === b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                yield {
                    recursion_depth: 0, action_type: 'update',
                    message: `Match! "${a[i - 1]}" == "${b[j - 1]}". dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
                    metadata: {
                        dpTable: cloneDp(), str1: a, str2: b, row: i, col: j,
                        compareInclude: { row: i - 1, col: j - 1, val: dp[i - 1][j - 1] },
                        weights: [...a], values: [...b], capacity: n
                    }
                };
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                yield {
                    recursion_depth: 0, action_type: 'compare',
                    message: `No match. dp[${i}][${j}] = max(dp[${i - 1}][${j}]=${dp[i - 1][j]}, dp[${i}][${j - 1}]=${dp[i][j - 1]}) = ${dp[i][j]}`,
                    metadata: {
                        dpTable: cloneDp(), str1: a, str2: b, row: i, col: j,
                        compareInclude: { row: i - 1, col: j, val: dp[i - 1][j] },
                        compareExclude: { row: i, col: j - 1, val: dp[i][j - 1] },
                        weights: [...a], values: [...b], capacity: n
                    }
                };
            }
        }
    }

    // Backtrack LCS string
    let lcs = "";
    let i2 = m, j2 = n;
    while (i2 > 0 && j2 > 0) {
        if (a[i2 - 1] === b[j2 - 1]) { lcs = a[i2 - 1] + lcs; i2--; j2--; }
        else if (dp[i2 - 1][j2] > dp[i2][j2 - 1]) { i2--; }
        else { j2--; }
    }

    yield {
        recursion_depth: 0, action_type: 'solution',
        message: `LCS length = ${dp[m][n]}. LCS = "${lcs}"`,
        metadata: {
            dpTable: cloneDp(), str1: a, str2: b, row: -1, col: -1,
            maxValue: dp[m][n], selectedItems: [...lcs],
            weights: [...a], values: [...b], capacity: n
        }
    };
}

export const lcsModule: AlgorithmModule = {
    id: "lcs",
    name: "Longest Common Subsequence",
    category: "Dynamic Programming",
    description: "Find the longest subsequence common to two sequences. Characters need not be contiguous but must appear in order.",
    pseudocode: [
        "for i from 1 to m:",
        "  for j from 1 to n:",
        "    if str1[i-1] == str2[j-1]:",
        "      dp[i][j] = dp[i-1][j-1] + 1",
        "    else:",
        "      dp[i][j] = max(dp[i-1][j], dp[i][j-1])"
    ],
    complexity: { time: "O(m × n)", space: "O(m × n)" },
    inputConfig: [
        { name: "str1", type: "text", label: "String 1", defaultValue: "ABCBDAB" },
        { name: "str2", type: "text", label: "String 2", defaultValue: "BDCAB" }
    ],
    generateStates: lcsGenerator
};
