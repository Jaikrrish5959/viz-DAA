import type { AlgorithmModule, ExecutionState } from '../../types';

function* subsetsGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [1, 2, 3]; }

    const current: number[] = [];

    yield {
        recursion_depth: 0, action_type: 'none', array: [...arr],
        message: `Generating all subsets of [${arr.join(', ')}]`,
        metadata: { combination: [], candidates: arr, target: arr.length, sum: 0, startIdx: 0 }
    };

    function* backtrack(start: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        yield {
            recursion_depth: depth, action_type: 'solution', array: [...arr],
            message: `Subset: [${current.join(', ')}]`,
            metadata: { combination: [...current], candidates: arr, target: arr.length, sum: current.length, startIdx: start }
        };

        for (let i = start; i < arr.length; i++) {
            yield {
                recursion_depth: depth, action_type: 'try', array: [...arr],
                message: `Including arr[${i}] = ${arr[i]}`,
                metadata: { combination: [...current, arr[i]], candidates: arr, target: arr.length, sum: current.length + 1, startIdx: i }
            };

            current.push(arr[i]);

            yield* backtrack(i + 1, depth + 1);

            current.pop();
            yield {
                recursion_depth: depth, action_type: 'backtrack', array: [...arr],
                message: `Excluding arr[${i}] = ${arr[i]}`,
                metadata: { combination: [...current], candidates: arr, target: arr.length, sum: current.length, startIdx: i }
            };
        }
    }

    yield* backtrack(0, 0);
}

export const subsetsModule: AlgorithmModule = {
    id: "subsets", name: "Subsets", category: "Backtracking",
    description: "Generate all possible subsets (power set) of a given set using backtracking.",
    pseudocode: [
        "backtrack(start):",
        "  add current subset to results",
        "  for i from start to n-1:",
        "    include arr[i]",
        "    backtrack(i + 1)",
        "    exclude arr[i]"
    ],
    complexity: { time: "O(2ⁿ)", space: "O(n)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[1,2,3]" }],
    generateStates: subsetsGenerator
};
