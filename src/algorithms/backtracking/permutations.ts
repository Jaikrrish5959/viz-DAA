import type { AlgorithmModule, ExecutionState } from '../../types';

function* permutationsGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [1, 2, 3]; }
    const n = arr.length;

    yield {
        recursion_depth: 0, action_type: 'none', array: [...arr],
        message: `Generating permutations of [${arr.join(', ')}]`,
        metadata: { combination: [], candidates: arr, target: n, sum: 0, startIdx: 0 }
    };

    function* permute(start: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        if (start === n) {
            yield {
                recursion_depth: depth, action_type: 'solution', array: [...arr],
                message: `Permutation found: [${arr.join(', ')}]`,
                metadata: { combination: [...arr], candidates: arr, target: n, sum: n, startIdx: start }
            };
            return;
        }

        for (let i = start; i < n; i++) {
            yield {
                recursion_depth: depth, action_type: 'try', array: [...arr],
                message: `Swapping index ${start} with ${i}: swap(${arr[start]}, ${arr[i]})`,
                metadata: { combination: arr.slice(0, start + 1), candidates: arr, target: n, sum: start + 1, startIdx: start }
            };

            [arr[start], arr[i]] = [arr[i], arr[start]];

            yield {
                recursion_depth: depth, action_type: 'place', array: [...arr],
                message: `Fixed position ${start} = ${arr[start]}`,
                metadata: { combination: arr.slice(0, start + 1), candidates: arr, target: n, sum: start + 1, startIdx: start }
            };

            yield* permute(start + 1, depth + 1);

            [arr[start], arr[i]] = [arr[i], arr[start]];
            yield {
                recursion_depth: depth, action_type: 'backtrack', array: [...arr],
                message: `Backtrack: restored swap(${arr[start]}, ${arr[i]})`,
                metadata: { combination: arr.slice(0, start), candidates: arr, target: n, sum: start, startIdx: start }
            };
        }
    }

    yield* permute(0, 0);
}

export const permutationsModule: AlgorithmModule = {
    id: "permutations", name: "Permutations", category: "Backtracking",
    description: "Generate all permutations of a given array using backtracking with swaps.",
    pseudocode: [
        "permute(start):",
        "  if start == n: save permutation",
        "  for i from start to n-1:",
        "    swap(arr[start], arr[i])",
        "    permute(start + 1)",
        "    swap back"
    ],
    complexity: { time: "O(n × n!)", space: "O(n)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[1,2,3]" }],
    generateStates: permutationsGenerator
};
