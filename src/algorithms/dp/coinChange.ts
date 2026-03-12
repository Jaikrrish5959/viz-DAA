import type { AlgorithmModule, ExecutionState } from '../../types';

function* coinChangeGenerator({ coins: cStr, amount: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let coins: number[] = [];
    let amount = 11;
    try {
        coins = JSON.parse(cStr);
        amount = parseInt(aStr, 10);
        if (isNaN(amount)) throw new Error();
    } catch {
        coins = [1, 5, 6, 9];
        amount = 11;
    }

    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    const parent = new Array(amount + 1).fill(-1); // Track which coin was used

    function cloneDp() { return [...dp]; }

    yield {
        recursion_depth: 0,
        action_type: 'none',
        message: `Initialized DP array of size ${amount + 1}. dp[0] = 0, rest = Infinity. Coins: [${coins.join(', ')}]`,
        metadata: { dpTable: [cloneDp()], coins, amount, row: -1, col: -1 }
    };

    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            yield {
                recursion_depth: 0,
                action_type: 'explore',
                message: `Evaluating amount ${i} with coin ${coin}`,
                metadata: { dpTable: [cloneDp()], coins, amount, row: 0, col: i, activeCoin: coin }
            };

            if (coin <= i && dp[i - coin] + 1 < dp[i]) {
                dp[i] = dp[i - coin] + 1;
                parent[i] = coin;
                yield {
                    recursion_depth: 0,
                    action_type: 'update',
                    message: `Updated dp[${i}] = ${dp[i]} using coin ${coin} (from dp[${i - coin}] + 1)`,
                    metadata: { dpTable: [cloneDp()], coins, amount, row: 0, col: i, activeCoin: coin }
                };
            } else if (coin > i) {
                yield {
                    recursion_depth: 0,
                    action_type: 'skip',
                    message: `Coin ${coin} > amount ${i}. Skipping.`,
                    metadata: { dpTable: [cloneDp()], coins, amount, row: 0, col: i, activeCoin: coin }
                };
            }
        }
    }

    // Reconstruct
    const selectedCoins: number[] = [];
    let rem = amount;
    while (rem > 0 && parent[rem] !== -1) {
        selectedCoins.push(parent[rem]);
        rem -= parent[rem];
    }

    yield {
        recursion_depth: 0,
        action_type: 'solution',
        message: dp[amount] === Infinity
            ? `No solution possible for amount ${amount} with coins [${coins.join(', ')}]`
            : `Minimum coins: ${dp[amount]}. Coins used: [${selectedCoins.join(', ')}]`,
        metadata: {
            dpTable: [cloneDp()],
            coins, amount,
            row: -1, col: -1,
            maxValue: dp[amount] === Infinity ? -1 : dp[amount],
            selectedItems: selectedCoins
        }
    };
}

export const coinChangeModule: AlgorithmModule = {
    id: "coin-change",
    name: "Coin Change",
    category: "Dynamic Programming",
    description: "Find the minimum number of coins needed to make up a given amount. Each coin denomination can be used unlimited times.",
    pseudocode: [
        "dp[0] = 0",
        "for i from 1 to amount:",
        "  for each coin in coins:",
        "    if coin <= i and dp[i-coin]+1 < dp[i]:",
        "      dp[i] = dp[i-coin] + 1",
        "return dp[amount]"
    ],
    complexity: { time: "O(amount × n)", space: "O(amount)" },
    inputConfig: [
        { name: "coins", type: "json", label: "Coins Array", defaultValue: "[1,5,6,9]" },
        { name: "amount", type: "number", label: "Target Amount", defaultValue: 11, min: 1, max: 100 }
    ],
    generateStates: coinChangeGenerator
};
