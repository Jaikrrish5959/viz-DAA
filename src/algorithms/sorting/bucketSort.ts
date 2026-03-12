import type { AlgorithmModule, ExecutionState } from '../../types';

function* bucketSortGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51]; }

    yield { recursion_depth: 0, action_type: 'none', array: [...arr], message: `Bucket Sort on [${arr.join(', ')}]`, metadata: { indices: [], sortedFrom: -1 } };

    const n = arr.length;
    const minVal = Math.min(...arr);
    const maxVal = Math.max(...arr);
    const range = maxVal - minVal || 1;
    const buckets: number[][] = Array.from({ length: n }, () => []);

    // Distribute into buckets
    for (let i = 0; i < n; i++) {
        const bIdx = Math.min(Math.floor(((arr[i] - minVal) / range) * (n - 1)), n - 1);
        buckets[bIdx].push(arr[i]);
        yield { recursion_depth: 0, action_type: 'explore', array: [...arr], message: `Place ${arr[i]} into bucket ${bIdx}`, metadata: { indices: [i], sortedFrom: -1, bucketIndex: bIdx } };
    }

    // Sort each bucket and concatenate
    const result: number[] = [];
    for (let b = 0; b < n; b++) {
        if (buckets[b].length > 0) {
            buckets[b].sort((a, c) => a - c);
            yield { recursion_depth: 0, action_type: 'update', array: [...buckets[b]], message: `Sorted bucket ${b}: [${buckets[b].join(', ')}]`, metadata: { indices: Array.from({ length: buckets[b].length }, (_, i) => i), sortedFrom: -1 } };
            result.push(...buckets[b]);
        }
    }

    yield { recursion_depth: 0, action_type: 'solution', array: [...result], message: `Sorted: [${result.join(', ')}]`, metadata: { indices: [], sortedFrom: 0 } };
}

export const bucketSortModule: AlgorithmModule = {
    id: "bucket-sort", name: "Bucket Sort", category: "Sorting",
    description: "Distribute elements into buckets based on value range, sort each bucket individually, then concatenate. Efficient when input is uniformly distributed.",
    pseudocode: ["Create n empty buckets", "for each element:", "  place in bucket[floor(n*elem/range)]", "Sort each bucket individually", "Concatenate all buckets"],
    complexity: { time: "O(n + k)", space: "O(n + k)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[0.42,0.32,0.23,0.52,0.25,0.47,0.51]" }],
    generateStates: bucketSortGenerator
};
