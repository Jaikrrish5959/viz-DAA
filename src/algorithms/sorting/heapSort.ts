import type { AlgorithmModule, ExecutionState } from '../../types';

function* heapSortGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [12, 11, 13, 5, 6, 7]; }
    const n = arr.length;

    yield {
        recursion_depth: 0, action_type: 'none', array: [...arr],
        message: `Starting Heap Sort on [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: n }
    };

    function* heapify(size: number, root: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;

        if (left < size) {
            yield {
                recursion_depth: 0, action_type: 'compare', array: [...arr],
                message: `Comparing arr[${left}]=${arr[left]} with arr[${largest}]=${arr[largest]}`,
                metadata: { indices: [left, largest], sortedFrom: size }
            };
            if (arr[left] > arr[largest]) largest = left;
        }

        if (right < size) {
            yield {
                recursion_depth: 0, action_type: 'compare', array: [...arr],
                message: `Comparing arr[${right}]=${arr[right]} with arr[${largest}]=${arr[largest]}`,
                metadata: { indices: [right, largest], sortedFrom: size }
            };
            if (arr[right] > arr[largest]) largest = right;
        }

        if (largest !== root) {
            [arr[root], arr[largest]] = [arr[largest], arr[root]];
            yield {
                recursion_depth: 0, action_type: 'swap', array: [...arr],
                message: `Swapped arr[${root}] and arr[${largest}]`,
                metadata: { indices: [root, largest], sortedFrom: size }
            };
            yield* heapify(size, largest);
        }
    }

    // Build max heap
    yield {
        recursion_depth: 0, action_type: 'explore', array: [...arr],
        message: `Building max heap...`,
        metadata: { indices: [], sortedFrom: n }
    };

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(n, i);
    }

    yield {
        recursion_depth: 0, action_type: 'sorted', array: [...arr],
        message: `Max heap built: [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: n }
    };

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        yield {
            recursion_depth: 0, action_type: 'swap', array: [...arr],
            message: `Extracted max ${arr[i]}. Swapped root with arr[${i}].`,
            metadata: { indices: [0, i], sortedFrom: i }
        };
        yield* heapify(i, 0);
    }

    yield {
        recursion_depth: 0, action_type: 'solution', array: [...arr],
        message: `Array sorted: [${arr.join(', ')}]`,
        metadata: { indices: [], sortedFrom: 0 }
    };
}

export const heapSortModule: AlgorithmModule = {
    id: "heap-sort", name: "Heap Sort", category: "Sorting",
    description: "Builds a max-heap from the array, then repeatedly extracts the maximum element and places it at the end. Uses the heap property to maintain order during extraction.",
    pseudocode: [
        "buildMaxHeap(arr)",
        "for i from n-1 downto 1:",
        "  swap(arr[0], arr[i])",
        "  heapify(arr, i, 0)",
        "heapify(size, root):",
        "  largest = max(root, left, right)",
        "  if largest != root:",
        "    swap and heapify(largest)"
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[12,11,13,5,6,7]" }],
    generateStates: heapSortGenerator
};
