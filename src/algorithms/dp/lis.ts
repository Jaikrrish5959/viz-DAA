import type { AlgorithmModule, ExecutionState } from '../../types';

function* lisGenerator({ sequence: sStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let seq: number[] = [];
    try {
        seq = JSON.parse(sStr);
        if (seq.length === 0) throw new Error();
    } catch {
        seq = [10, 22, 9, 33, 21, 50, 41, 60];
    }

    const n = seq.length;
    const dp = new Array(n).fill(1);
    const parent = new Array(n).fill(-1);

    function cloneDp() { return [[...dp]]; } // Wrap as 2D for DpTableBoard compatibility

    yield {
        recursion_depth: 0, action_type: 'none',
        message: `Initialized LIS dp array. Sequence: [${seq.join(', ')}]`,
        metadata: { dpTable: cloneDp(), sequence: seq, row: 0, col: -1, weights: seq.map((_, i) => `${i}`), values: seq, capacity: n - 1 }
    };

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            yield {
                recursion_depth: 0, action_type: 'explore',
                message: `Comparing seq[${j}]=${seq[j]} with seq[${i}]=${seq[i]}`,
                metadata: { dpTable: cloneDp(), sequence: seq, row: 0, col: i, weights: seq.map((_, k) => `${k}`), values: seq, capacity: n - 1, compareInclude: { row: 0, col: j, val: dp[j] } }
            };

            if (seq[j] < seq[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                parent[i] = j;
                yield {
                    recursion_depth: 0, action_type: 'update',
                    message: `Updated dp[${i}] = ${dp[i]} (extends subsequence ending at index ${j})`,
                    metadata: { dpTable: cloneDp(), sequence: seq, row: 0, col: i, weights: seq.map((_, k) => `${k}`), values: seq, capacity: n - 1 }
                };
            }
        }
    }

    // Reconstruct
    let maxLen = 0, maxIdx = 0;
    for (let i = 0; i < n; i++) { if (dp[i] > maxLen) { maxLen = dp[i]; maxIdx = i; } }
    const lisSeq: number[] = [];
    let cur = maxIdx;
    while (cur !== -1) { lisSeq.push(seq[cur]); cur = parent[cur]; }
    lisSeq.reverse();

    yield {
        recursion_depth: 0, action_type: 'solution',
        message: `LIS length = ${maxLen}. Subsequence: [${lisSeq.join(', ')}]`,
        metadata: { dpTable: cloneDp(), sequence: seq, row: -1, col: -1, maxValue: maxLen, selectedItems: lisSeq, weights: seq.map((_, k) => `${k}`), values: seq, capacity: n - 1 }
    };
}

export const lisModule: AlgorithmModule = {
    id: "lis",
    name: "Longest Increasing Subsequence",
    category: "Dynamic Programming",
    description: "Find the length of the longest strictly increasing subsequence within a given sequence of numbers.",
    pseudocode: [
        "dp[0..n-1] = 1",
        "for i from 1 to n-1:",
        "  for j from 0 to i-1:",
        "    if seq[j] < seq[i] and dp[j]+1 > dp[i]:",
        "      dp[i] = dp[j] + 1",
        "return max(dp)"
    ],
    complexity: { time: "O(n²)", space: "O(n)" },
    inputConfig: [
        { name: "sequence", type: "json", label: "Number Sequence", defaultValue: "[10,22,9,33,21,50,41,60]" }
    ],
    generateStates: lisGenerator
};
