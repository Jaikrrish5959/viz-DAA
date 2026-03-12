import type { AlgorithmModule, ExecutionState } from '../../types';

function* quickSortGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [10, 7, 8, 9, 1, 5]; }

    yield {
        recursion_depth: 0, action_type: 'none', array: [...arr],
        message: `Starting Quick Sort on [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: -1 }
    };

    function* partition(low: number, high: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, number, unknown> {
        const pivotVal = arr[high];
        let i = low - 1;

        yield {
            recursion_depth: depth, action_type: 'pivot', array: [...arr],
            message: `Pivot selected: arr[${high}] = ${pivotVal}`,
            metadata: { indices: [high], sortedFrom: -1, pivotIndex: high }
        };

        for (let j = low; j < high; j++) {
            yield {
                recursion_depth: depth, action_type: 'compare', array: [...arr],
                message: `Comparing arr[${j}]=${arr[j]} with pivot ${pivotVal}`,
                metadata: { indices: [j, high], sortedFrom: -1, pivotIndex: high }
            };

            if (arr[j] < pivotVal) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                yield {
                    recursion_depth: depth, action_type: 'swap', array: [...arr],
                    message: `Swapped arr[${i}] and arr[${j}]`,
                    metadata: { indices: [i, j], sortedFrom: -1, pivotIndex: high }
                };
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        yield {
            recursion_depth: depth, action_type: 'sorted', array: [...arr],
            message: `Pivot ${pivotVal} placed at final position index ${i + 1}`,
            metadata: { indices: [i + 1], sortedFrom: -1, pivotIndex: i + 1 }
        };

        return i + 1;
    }

    function* quickSort(low: number, high: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        if (low < high) {
            yield {
                recursion_depth: depth, action_type: 'explore', array: [...arr],
                message: `Partitioning subarray [${low}..${high}]`,
                metadata: { indices: Array.from({ length: high - low + 1 }, (_, i) => low + i), sortedFrom: -1 }
            };

            const pi: number = yield* partition(low, high, depth);
            yield* quickSort(low, pi - 1, depth + 1);
            yield* quickSort(pi + 1, high, depth + 1);
        }
    }

    yield* quickSort(0, arr.length - 1, 0);

    yield {
        recursion_depth: 0, action_type: 'solution', array: [...arr],
        message: `Array sorted: [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: 0 }
    };
}

export const quickSortModule: AlgorithmModule = {
    id: "quick-sort", name: "Quick Sort", category: "Sorting",
    description: "A divide-and-conquer algorithm that picks a pivot element and partitions the array around it, placing smaller elements before and larger elements after the pivot.",
    pseudocode: [
        "quickSort(arr, low, high):",
        "  if low < high:",
        "    pi = partition(arr, low, high)",
        "    quickSort(arr, low, pi-1)",
        "    quickSort(arr, pi+1, high)",
        "partition: pivot = arr[high]",
        "  for j from low to high-1:",
        "    if arr[j] < pivot: swap"
    ],
    complexity: { time: "O(n log n) avg", space: "O(log n)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[10,7,8,9,1,5]" }],
    generateStates: quickSortGenerator
};
