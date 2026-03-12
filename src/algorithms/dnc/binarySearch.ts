import type { AlgorithmModule, ExecutionState } from '../../types';

function* binarySearchGenerator({ array: aStr, target: tStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    let target: number;
    try { arr = JSON.parse(aStr); target = parseInt(tStr, 10); } catch { arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]; target = 7; }
    arr.sort((a, b) => a - b);

    yield { recursion_depth: 0, action_type: 'none', array: [...arr], message: `Binary search for ${target} in [${arr.join(', ')}]`, metadata: { indices: [], sortedFrom: -1 } };

    let low = 0, high = arr.length - 1, depth = 0, found = false;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        yield { recursion_depth: depth, action_type: 'compare', array: [...arr], message: `Checking mid index ${mid}: arr[${mid}] = ${arr[mid]}`, metadata: { indices: [mid, low, high], sortedFrom: -1, low, high, mid } };

        if (arr[mid] === target) {
            yield { recursion_depth: depth, action_type: 'solution', array: [...arr], message: `Found ${target} at index ${mid}!`, metadata: { indices: [mid], sortedFrom: -1, low, high, mid } };
            found = true;
            break;
        } else if (arr[mid] < target) {
            yield { recursion_depth: depth, action_type: 'explore', array: [...arr], message: `${arr[mid]} < ${target}, search right half [${mid + 1}..${high}]`, metadata: { indices: [mid], sortedFrom: -1, low: mid + 1, high, mid } };
            low = mid + 1;
        } else {
            yield { recursion_depth: depth, action_type: 'explore', array: [...arr], message: `${arr[mid]} > ${target}, search left half [${low}..${mid - 1}]`, metadata: { indices: [mid], sortedFrom: -1, low, high: mid - 1, mid } };
            high = mid - 1;
        }
        depth++;
    }

    if (!found) {
        yield { recursion_depth: depth, action_type: 'solution', array: [...arr], message: `${target} not found in array`, metadata: { indices: [], sortedFrom: -1 } };
    }
}

export const binarySearchModule: AlgorithmModule = {
    id: "binary-search", name: "Binary Search", category: "Divide and Conquer",
    description: "Search a sorted array by repeatedly dividing the search interval in half. Compares the target to the middle element to eliminate half the remaining elements each step.",
    pseudocode: ["binarySearch(arr, target):", "  low = 0, high = n-1", "  while low <= high:", "    mid = (low + high) / 2", "    if arr[mid] == target: return mid", "    if arr[mid] < target: low = mid+1", "    else: high = mid-1"],
    complexity: { time: "O(log n)", space: "O(1)" },
    inputConfig: [
        { name: "array", type: "json", label: "Sorted Array", defaultValue: "[1,3,5,7,9,11,13,15,17,19]" },
        { name: "target", type: "number", label: "Target", defaultValue: 7 }
    ],
    generateStates: binarySearchGenerator
};
