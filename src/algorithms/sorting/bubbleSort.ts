import type { AlgorithmModule, ExecutionState } from '../../types';

function* bubbleSortGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [5, 3, 8, 4, 2]; }
    const n = arr.length;

    yield {
        recursion_depth: 0, action_type: 'none', array: [...arr],
        message: `Starting Bubble Sort on [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: n }
    };

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            yield {
                recursion_depth: 0, action_type: 'compare', array: [...arr],
                message: `Comparing arr[${j}]=${arr[j]} with arr[${j + 1}]=${arr[j + 1]}`,
                metadata: { indices: [j, j + 1], sortedFrom: n - i }
            };

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                yield {
                    recursion_depth: 0, action_type: 'swap', array: [...arr],
                    message: `Swapped arr[${j}] and arr[${j + 1}]`,
                    metadata: { indices: [j, j + 1], sortedFrom: n - i }
                };
            }
        }
        yield {
            recursion_depth: 0, action_type: 'sorted', array: [...arr],
            message: `Element ${arr[n - i - 1]} is now in its final position at index ${n - i - 1}`,
            metadata: { indices: [n - i - 1], sortedFrom: n - i - 1 }
        };
    }

    yield {
        recursion_depth: 0, action_type: 'solution', array: [...arr],
        message: `Array sorted: [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: 0 }
    };
}

export const bubbleSortModule: AlgorithmModule = {
    id: "bubble-sort", name: "Bubble Sort", category: "Sorting",
    description: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
    pseudocode: [
        "for i from 0 to n-1:",
        "  for j from 0 to n-i-2:",
        "    if arr[j] > arr[j+1]:",
        "      swap(arr[j], arr[j+1])"
    ],
    complexity: { time: "O(n²)", space: "O(1)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[5,3,8,4,2]" }],
    generateStates: bubbleSortGenerator
};
