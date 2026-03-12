import type { AlgorithmModule, ExecutionState } from '../../types';

function* subsetSumGenerator({ set: sStr, target: tStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let set: number[], target: number;
    try { set = JSON.parse(sStr); target = parseInt(tStr, 10); } catch { set = [3, 34, 4, 12, 5, 2]; target = 9; }
    if (isNaN(target)) target = 9;

    const solutions: number[][] = [];

    yield { board: [[]], recursion_depth: 0, action_type: 'none', message: `Subset Sum: find subsets of [${set.join(',')}] summing to ${target}`, metadata: { candidates: set, target, sum: 0, combination: [] } };

    function* solve(idx: number, current: number[], currentSum: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        if (currentSum === target) {
            solutions.push([...current]);
            yield { board: [[]], recursion_depth: depth, action_type: 'solution', message: `Found solution! [${current.join(', ')}] = ${target}`, metadata: { candidates: set, target, sum: currentSum, combination: [...current] } };
            return;
        }

        if (idx >= set.length || currentSum > target) {
            yield { board: [[]], recursion_depth: depth, action_type: 'backtrack', message: `Sum=${currentSum} ${currentSum > target ? '> target' : 'no more elements'}, backtrack`, metadata: { candidates: set, target, sum: currentSum, combination: [...current] } };
            return;
        }

        // Include set[idx]
        current.push(set[idx]);
        yield { board: [[]], recursion_depth: depth, action_type: 'place', message: `Include ${set[idx]}, sum = ${currentSum + set[idx]}`, metadata: { candidates: set, target, sum: currentSum + set[idx], combination: [...current], activeCandidateIdx: idx } };
        yield* solve(idx + 1, current, currentSum + set[idx], depth + 1);
        current.pop();

        // Exclude set[idx]
        yield { board: [[]], recursion_depth: depth, action_type: 'try', message: `Exclude ${set[idx]}, try next`, metadata: { candidates: set, target, sum: currentSum, combination: [...current], activeCandidateIdx: idx } };
        yield* solve(idx + 1, current, currentSum, depth + 1);
    }

    yield* solve(0, [], 0, 0);

    yield { board: [[]], recursion_depth: 0, action_type: 'solution', message: `Found ${solutions.length} subsets summing to ${target}`, metadata: { candidates: set, target, sum: 0, combination: [] } };
}

export const subsetSumModule: AlgorithmModule = {
    id: "subset-sum", name: "Subset Sum", category: "Backtracking",
    description: "Find all subsets of a given set that sum to a target value using backtracking. Explores include/exclude decisions for each element.",
    pseudocode: ["solve(idx, current, sum):", "  if sum == target: record solution", "  if idx >= n or sum > target: backtrack", "  include set[idx], recurse", "  exclude set[idx], recurse"],
    complexity: { time: "O(2^n)", space: "O(n)" },
    inputConfig: [
        { name: "set", type: "json", label: "Set", defaultValue: "[3,34,4,12,5,2]" },
        { name: "target", type: "number", label: "Target Sum", defaultValue: 9 }
    ],
    generateStates: subsetSumGenerator
};
