import type { AlgorithmModule, ExecutionState } from '../../types';

function* editDistanceGenerator({ str1, str2 }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const a: string = str1 || "sunday";
    const b: string = str2 || "saturday";
    const m = a.length;
    const n = b.length;

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    function cloneDp() { return dp.map(r => [...r]); }

    // Base cases
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    yield {
        recursion_depth: 0, action_type: 'none',
        message: `Edit Distance: "${a}" → "${b}". Base cases initialized.`,
        metadata: { dpTable: cloneDp(), str1: a, str2: b, row: -1, col: -1, weights: [' ', ...a], values: [' ', ...b], capacity: n }
    };

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            yield {
                recursion_depth: 0, action_type: 'explore',
                message: `Comparing "${a[i - 1]}" (pos ${i}) with "${b[j - 1]}" (pos ${j})`,
                metadata: { dpTable: cloneDp(), str1: a, str2: b, row: i, col: j, weights: [' ', ...a], values: [' ', ...b], capacity: n }
            };

            if (a[i - 1] === b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
                yield {
                    recursion_depth: 0, action_type: 'update',
                    message: `Match! "${a[i - 1]}" == "${b[j - 1]}". dp[${i}][${j}] = ${dp[i][j]}`,
                    metadata: {
                        dpTable: cloneDp(), str1: a, str2: b, row: i, col: j,
                        compareInclude: { row: i - 1, col: j - 1, val: dp[i - 1][j - 1] },
                        weights: [' ', ...a], values: [' ', ...b], capacity: n
                    }
                };
            } else {
                const insert = dp[i][j - 1] + 1;
                const remove = dp[i - 1][j] + 1;
                const replace = dp[i - 1][j - 1] + 1;
                dp[i][j] = Math.min(insert, remove, replace);

                yield {
                    recursion_depth: 0, action_type: 'compare',
                    message: `No match. min(insert=${insert}, remove=${remove}, replace=${replace}) = ${dp[i][j]}`,
                    metadata: {
                        dpTable: cloneDp(), str1: a, str2: b, row: i, col: j,
                        compareInclude: { row: i - 1, col: j - 1, val: replace },
                        compareExclude: { row: i - 1, col: j, val: remove },
                        weights: [' ', ...a], values: [' ', ...b], capacity: n
                    }
                };
            }
        }
    }

    yield {
        recursion_depth: 0, action_type: 'solution',
        message: `Edit Distance from "${a}" to "${b}" = ${dp[m][n]}`,
        metadata: {
            dpTable: cloneDp(), str1: a, str2: b, row: -1, col: -1,
            maxValue: dp[m][n], selectedItems: [],
            weights: [' ', ...a], values: [' ', ...b], capacity: n
        }
    };
}

export const editDistanceModule: AlgorithmModule = {
    id: "edit-distance",
    name: "Edit Distance",
    category: "Dynamic Programming",
    description: "Find the minimum number of operations (insert, delete, replace) required to convert one string into another.",
    pseudocode: [
        "dp[i][0] = i, dp[0][j] = j",
        "for i from 1 to m:",
        "  for j from 1 to n:",
        "    if str1[i-1] == str2[j-1]:",
        "      dp[i][j] = dp[i-1][j-1]",
        "    else:",
        "      dp[i][j] = 1 + min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1])"
    ],
    complexity: { time: "O(m × n)", space: "O(m × n)" },
    inputConfig: [
        { name: "str1", type: "text", label: "String 1", defaultValue: "sunday" },
        { name: "str2", type: "text", label: "String 2", defaultValue: "saturday" }
    ],
    generateStates: editDistanceGenerator
};
