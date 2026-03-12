import type { AlgorithmModule, ExecutionState } from '../../types';

function* knapsackGenerator({ weights: wStr, values: vStr, capacity: cStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let weights: number[] = [];
    let values: number[] = [];
    let capacity = 5;

    try {
        weights = JSON.parse(wStr);
        values = JSON.parse(vStr);
        capacity = parseInt(cStr, 10);
        if (weights.length !== values.length) throw new Error("Mismatched lengths");
        if (isNaN(capacity)) throw new Error();
    } catch {
        weights = [2, 3, 4, 5];
        values = [3, 4, 5, 6];
        capacity = 5;
    }

    const n = weights.length;
    // DP table: (n + 1) x (capacity + 1)
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    function cloneDp() {
        return dp.map(row => [...row]);
    }

    // Initialize DP table message
    yield {
        recursion_depth: 0,
        action_type: 'none',
        message: `Initialized DP table size (${n + 1}x${capacity + 1}) with 0s.`,
        metadata: {
            row: -1,
            col: -1,
            itemIndex: -1,
            weight: -1,
            value: -1,
            dpTable: cloneDp(),
            weights,
            values,
            capacity
        }
    };

    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            const currentItemWeight = weights[i - 1];
            const currentItemValue = values[i - 1];

            // Explore
            yield {
                recursion_depth: 0,
                action_type: 'explore',
                message: `Evaluating item ${i} (weight: ${currentItemWeight}, value: ${currentItemValue}) at capacity ${w}`,
                metadata: {
                    row: i,
                    col: w,
                    itemIndex: i - 1,
                    weight: currentItemWeight,
                    value: currentItemValue,
                    dpTable: cloneDp(),
                    weights,
                    values,
                    capacity
                }
            };

            if (currentItemWeight > w) {
                // Skip
                dp[i][w] = dp[i - 1][w];
                yield {
                    recursion_depth: 0,
                    action_type: 'skip',
                    message: `Item ${i} weight (${currentItemWeight}) > current capacity (${w}). Excluding item.`,
                    metadata: {
                        row: i,
                        col: w,
                        itemIndex: i - 1,
                        weight: currentItemWeight,
                        value: currentItemValue,
                        dpTable: cloneDp(),
                        weights,
                        values,
                        capacity
                    }
                };
            } else {
                // Compare
                const includeValue = currentItemValue + dp[i - 1][w - currentItemWeight];
                const excludeValue = dp[i - 1][w];
                yield {
                    recursion_depth: 0,
                    action_type: 'compare',
                    message: `Comparing include value (${includeValue}) vs exclude value (${excludeValue})`,
                    metadata: {
                        row: i,
                        col: w,
                        itemIndex: i - 1,
                        weight: currentItemWeight,
                        value: currentItemValue,
                        dpTable: cloneDp(),
                        compareInclude: { row: i - 1, col: w - currentItemWeight, val: includeValue },
                        compareExclude: { row: i - 1, col: w, val: excludeValue },
                        weights,
                        values,
                        capacity
                    }
                };

                // Update
                dp[i][w] = Math.max(includeValue, excludeValue);
                yield {
                    recursion_depth: 0,
                    action_type: 'update',
                    message: `Updated dp[${i}][${w}] to max(${includeValue}, ${excludeValue}) = ${dp[i][w]}`,
                    metadata: {
                        row: i,
                        col: w,
                        itemIndex: i - 1,
                        weight: currentItemWeight,
                        value: currentItemValue,
                        dpTable: cloneDp(),
                        weights,
                        values,
                        capacity
                    }
                };
            }
        }
    }

    // Reconstruction
    let w = capacity;
    const selectedItems: number[] = [];
    for (let i = n; i > 0 && w > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selectedItems.push(i - 1);
            w -= weights[i - 1];
        }
    }

    selectedItems.reverse();

    yield {
        recursion_depth: 0,
        action_type: 'solution',
        message: `Maximum value is ${dp[n][capacity]}. Selected items: [${selectedItems.join(', ')}]`,
        metadata: {
            row: -1,
            col: -1,
            itemIndex: -1,
            weight: -1,
            value: -1,
            dpTable: cloneDp(),
            weights,
            values,
            capacity,
            maxValue: dp[n][capacity],
            selectedItems
        }
    };
}

export const knapsack01Module: AlgorithmModule = {
    id: "knapsack01",
    name: "0-1 Knapsack",
    category: "Dynamic Programming",
    description: "Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack.",
    pseudocode: [
        "for i from 1 to n:",
        "  for w from 1 to capacity:",
        "    if weight[i-1] <= w:",
        "      dp[i][w] = max(dp[i-1][w], value[i-1] + dp[i-1][w-weight[i-1]])",
        "    else:",
        "      dp[i][w] = dp[i-1][w]"
    ],
    complexity: {
        time: "O(n * W)",
        space: "O(n * W)"
    },
    inputConfig: [
        {
            name: "weights",
            type: "json",
            label: "Weights Array",
            defaultValue: "[2,3,4,5]"
        },
        {
            name: "values",
            type: "json",
            label: "Values Array",
            defaultValue: "[3,4,5,6]"
        },
        {
            name: "capacity",
            type: "number",
            label: "Knapsack Capacity",
            defaultValue: 5
        }
    ],
    generateStates: knapsackGenerator
};
