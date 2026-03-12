import type { AlgorithmModule, ExecutionState } from '../../types';

function* selectionSortGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [64, 25, 12, 22, 11]; }
    const n = arr.length;

    yield {
        recursion_depth: 0, action_type: 'none', array: [...arr],
        message: `Starting Selection Sort on [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: -1 }
    };

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;

        yield {
            recursion_depth: 0, action_type: 'explore', array: [...arr],
            message: `Finding minimum in unsorted region [${i}..${n - 1}]. Current min: arr[${minIdx}]=${arr[minIdx]}`,
            metadata: { indices: [minIdx], sortedFrom: i }
        };

        for (let j = i + 1; j < n; j++) {
            yield {
                recursion_depth: 0, action_type: 'compare', array: [...arr],
                message: `Comparing arr[${j}]=${arr[j]} with current min arr[${minIdx}]=${arr[minIdx]}`,
                metadata: { indices: [j, minIdx], sortedFrom: i }
            };
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            yield {
                recursion_depth: 0, action_type: 'swap', array: [...arr],
                message: `Swapped arr[${i}] and arr[${minIdx}]. Placed ${arr[i]} at index ${i}.`,
                metadata: { indices: [i, minIdx], sortedFrom: i }
            };
        }

        yield {
            recursion_depth: 0, action_type: 'sorted', array: [...arr],
            message: `Index ${i} is sorted: ${arr[i]}`,
            metadata: { indices: [i], sortedFrom: i + 1 }
        };
    }

    yield {
        recursion_depth: 0, action_type: 'solution', array: [...arr],
        message: `Array sorted: [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: 0 }
    };
}

export const selectionSortModule: AlgorithmModule = {
    id: "selection-sort", name: "Selection Sort", category: "Sorting",
    description: "Repeatedly finds the minimum element from the unsorted part and places it at the beginning. Divides into sorted and unsorted sub-arrays.",
    pseudocode: [
        "for i from 0 to n-1:",
        "  minIdx = i",
        "  for j from i+1 to n-1:",
        "    if arr[j] < arr[minIdx]:",
        "      minIdx = j",
        "  swap(arr[i], arr[minIdx])"
    ],
    complexity: { time: "O(n²)", space: "O(1)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[64,25,12,22,11]" }],
    generateStates: selectionSortGenerator
};
