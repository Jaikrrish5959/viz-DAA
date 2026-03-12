import type { AlgorithmModule, ExecutionState } from '../../types';

function* insertionSortGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [12, 11, 13, 5, 6]; }
    const n = arr.length;

    yield {
        recursion_depth: 0, action_type: 'none', array: [...arr],
        message: `Starting Insertion Sort on [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: -1 }
    };

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        yield {
            recursion_depth: 0, action_type: 'explore', array: [...arr],
            message: `Key = arr[${i}] = ${key}. Inserting into sorted region [0..${i - 1}].`,
            metadata: { indices: [i], sortedFrom: -1, pivotIndex: i }
        };

        while (j >= 0 && arr[j] > key) {
            yield {
                recursion_depth: 0, action_type: 'compare', array: [...arr],
                message: `arr[${j}]=${arr[j]} > key=${key}. Shifting arr[${j}] right.`,
                metadata: { indices: [j, j + 1], sortedFrom: -1 }
            };
            arr[j + 1] = arr[j];
            j--;
            yield {
                recursion_depth: 0, action_type: 'overwrite', array: [...arr],
                message: `Shifted. Array: [${arr.join(', ')}]`,
                metadata: { indices: [j + 1, j + 2], sortedFrom: -1 }
            };
        }

        arr[j + 1] = key;
        yield {
            recursion_depth: 0, action_type: 'place', array: [...arr],
            message: `Inserted key ${key} at index ${j + 1}`,
            metadata: { indices: [j + 1], sortedFrom: -1 }
        };
    }

    yield {
        recursion_depth: 0, action_type: 'solution', array: [...arr],
        message: `Array sorted: [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: 0 }
    };
}

export const insertionSortModule: AlgorithmModule = {
    id: "insertion-sort", name: "Insertion Sort", category: "Sorting",
    description: "Builds the final sorted array one item at a time. Takes each element and inserts it into the correct position in the already-sorted portion.",
    pseudocode: [
        "for i from 1 to n-1:",
        "  key = arr[i]",
        "  j = i - 1",
        "  while j >= 0 and arr[j] > key:",
        "    arr[j+1] = arr[j]",
        "    j--",
        "  arr[j+1] = key"
    ],
    complexity: { time: "O(n²)", space: "O(1)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[12,11,13,5,6]" }],
    generateStates: insertionSortGenerator
};
