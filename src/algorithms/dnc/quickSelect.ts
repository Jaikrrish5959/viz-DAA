import type { AlgorithmModule, ExecutionState } from '../../types';

function* quickSelectGenerator({ array: aStr, k: kStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    let k: number;
    try { arr = JSON.parse(aStr); k = parseInt(kStr, 10); } catch { arr = [7, 2, 5, 1, 9, 3, 8]; k = 3; }
    if (k < 1 || k > arr.length) k = 1;

    yield { recursion_depth: 0, action_type: 'none', array: [...arr], message: `Quick Select: find ${k}-th smallest in [${arr.join(', ')}]`, metadata: { indices: [], sortedFrom: -1 } };

    function* partition(low: number, high: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, number, unknown> {
        const pivot = arr[high];
        yield { recursion_depth: depth, action_type: 'pivot', array: [...arr], message: `Pivot = arr[${high}] = ${pivot}`, metadata: { indices: [high], sortedFrom: -1, pivotIndex: high } };
        let i = low - 1;
        for (let j = low; j < high; j++) {
            yield { recursion_depth: depth, action_type: 'compare', array: [...arr], message: `Compare arr[${j}]=${arr[j]} with pivot ${pivot}`, metadata: { indices: [j, high], sortedFrom: -1, pivotIndex: high } };
            if (arr[j] <= pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                if (i !== j) yield { recursion_depth: depth, action_type: 'swap', array: [...arr], message: `Swap arr[${i}] and arr[${j}]`, metadata: { indices: [i, j], sortedFrom: -1, pivotIndex: high } };
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        yield { recursion_depth: depth, action_type: 'sorted', array: [...arr], message: `Pivot placed at index ${i + 1}`, metadata: { indices: [i + 1], sortedFrom: -1, pivotIndex: i + 1 } };
        return i + 1;
    }

    function* select(low: number, high: number, kIdx: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        if (low === high) {
            yield { recursion_depth: depth, action_type: 'solution', array: [...arr], message: `Found! ${k}-th smallest = ${arr[low]}`, metadata: { indices: [low], sortedFrom: -1 } };
            return;
        }
        const pi: number = yield* partition(low, high, depth);
        if (kIdx === pi) {
            yield { recursion_depth: depth, action_type: 'solution', array: [...arr], message: `Found! ${k}-th smallest = ${arr[pi]}`, metadata: { indices: [pi], sortedFrom: -1 } };
        } else if (kIdx < pi) {
            yield { recursion_depth: depth, action_type: 'explore', array: [...arr], message: `Target index ${kIdx} < pivot ${pi}, search left`, metadata: { indices: [], sortedFrom: -1 } };
            yield* select(low, pi - 1, kIdx, depth + 1);
        } else {
            yield { recursion_depth: depth, action_type: 'explore', array: [...arr], message: `Target index ${kIdx} > pivot ${pi}, search right`, metadata: { indices: [], sortedFrom: -1 } };
            yield* select(pi + 1, high, kIdx, depth + 1);
        }
    }

    yield* select(0, arr.length - 1, k - 1, 0);
}

export const quickSelectModule: AlgorithmModule = {
    id: "quick-select", name: "Quick Select", category: "Divide and Conquer",
    description: "Find the k-th smallest element using partitioning. On average runs in O(n) time by only recursing into one side after partitioning.",
    pseudocode: ["quickSelect(arr, low, high, k):", "  pi = partition(arr, low, high)", "  if pi == k: return arr[pi]", "  if k < pi: recurse left", "  else: recurse right"],
    complexity: { time: "O(n) avg", space: "O(log n)" },
    inputConfig: [
        { name: "array", type: "json", label: "Input Array", defaultValue: "[7,2,5,1,9,3,8]" },
        { name: "k", type: "number", label: "k-th smallest", defaultValue: 3, min: 1 }
    ],
    generateStates: quickSelectGenerator
};
