import type { AlgorithmModule, ExecutionState } from '../../types';

function* mergeSortGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [38, 27, 43, 3, 9, 82, 10]; }

    yield {
        recursion_depth: 0, action_type: 'none', array: [...arr],
        message: `Starting Merge Sort on [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: -1 }
    };

    function* mergeSort(left: number, right: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);

        yield {
            recursion_depth: depth, action_type: 'explore', array: [...arr],
            message: `Dividing [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}]`,
            metadata: { indices: Array.from({ length: right - left + 1 }, (_, i) => left + i), sortedFrom: -1 }
        };

        yield* mergeSort(left, mid, depth + 1);
        yield* mergeSort(mid + 1, right, depth + 1);

        // Merge
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            yield {
                recursion_depth: depth, action_type: 'compare', array: [...arr],
                message: `Merging: comparing ${leftArr[i]} with ${rightArr[j]}`,
                metadata: { indices: [left + i, mid + 1 + j], sortedFrom: -1 }
            };

            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }

            yield {
                recursion_depth: depth, action_type: 'overwrite', array: [...arr],
                message: `Placed ${arr[k]} at index ${k}`,
                metadata: { indices: [k], sortedFrom: -1 }
            };
            k++;
        }

        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            yield {
                recursion_depth: depth, action_type: 'overwrite', array: [...arr],
                message: `Copied remaining ${arr[k]} at index ${k}`,
                metadata: { indices: [k], sortedFrom: -1 }
            };
            i++; k++;
        }

        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            yield {
                recursion_depth: depth, action_type: 'overwrite', array: [...arr],
                message: `Copied remaining ${arr[k]} at index ${k}`,
                metadata: { indices: [k], sortedFrom: -1 }
            };
            j++; k++;
        }

        yield {
            recursion_depth: depth, action_type: 'sorted', array: [...arr],
            message: `Merged region [${left}..${right}]: [${arr.slice(left, right + 1).join(', ')}]`,
            metadata: { indices: Array.from({ length: right - left + 1 }, (_, i) => left + i), sortedFrom: -1 }
        };
    }

    yield* mergeSort(0, arr.length - 1, 0);

    yield {
        recursion_depth: 0, action_type: 'solution', array: [...arr],
        message: `Array sorted: [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: 0 }
    };
}

export const mergeSortModule: AlgorithmModule = {
    id: "merge-sort", name: "Merge Sort", category: "Sorting",
    description: "A divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves back together.",
    pseudocode: [
        "mergeSort(arr, left, right):",
        "  if left >= right: return",
        "  mid = (left + right) / 2",
        "  mergeSort(arr, left, mid)",
        "  mergeSort(arr, mid+1, right)",
        "  merge(arr, left, mid, right)"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[38,27,43,3,9,82,10]" }],
    generateStates: mergeSortGenerator
};
