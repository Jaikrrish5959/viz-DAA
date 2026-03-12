import type { AlgorithmModule, ExecutionState } from '../../types';

function* kadaneGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]; }

    yield { recursion_depth: 0, action_type: 'none', array: [...arr], message: `Kadane's Algorithm on [${arr.join(', ')}]`, metadata: { indices: [], sortedFrom: -1 } };

    let maxSoFar = arr[0], maxEndingHere = arr[0], startIdx = 0, endIdx = 0, tempStart = 0;

    for (let i = 1; i < arr.length; i++) {
        yield { recursion_depth: 0, action_type: 'compare', array: [...arr], message: `i=${i}: maxEndingHere(${maxEndingHere}) + arr[${i}](${arr[i]}) = ${maxEndingHere + arr[i]} vs arr[${i}](${arr[i]})`, metadata: { indices: [i], sortedFrom: -1, maxSoFar, maxEndingHere } };

        if (arr[i] > maxEndingHere + arr[i]) {
            maxEndingHere = arr[i];
            tempStart = i;
            yield { recursion_depth: 0, action_type: 'explore', array: [...arr], message: `Start new subarray at index ${i}, maxEndingHere = ${arr[i]}`, metadata: { indices: Array.from({ length: 1 }, () => i), sortedFrom: -1, maxSoFar, maxEndingHere } };
        } else {
            maxEndingHere += arr[i];
            yield { recursion_depth: 0, action_type: 'explore', array: [...arr], message: `Extend subarray, maxEndingHere = ${maxEndingHere}`, metadata: { indices: Array.from({ length: i - tempStart + 1 }, (_, j) => tempStart + j), sortedFrom: -1, maxSoFar, maxEndingHere } };
        }

        if (maxEndingHere > maxSoFar) {
            maxSoFar = maxEndingHere;
            startIdx = tempStart;
            endIdx = i;
            yield { recursion_depth: 0, action_type: 'update', array: [...arr], message: `New max! maxSoFar = ${maxSoFar}, subarray [${startIdx}..${endIdx}]`, metadata: { indices: Array.from({ length: endIdx - startIdx + 1 }, (_, j) => startIdx + j), sortedFrom: -1, maxSoFar, maxEndingHere } };
        }
    }

    yield { recursion_depth: 0, action_type: 'solution', array: [...arr], message: `Maximum subarray sum = ${maxSoFar}, subarray [${arr.slice(startIdx, endIdx + 1).join(', ')}]`, metadata: { indices: Array.from({ length: endIdx - startIdx + 1 }, (_, j) => startIdx + j), sortedFrom: 0, maxSoFar } };
}

export const kadaneModule: AlgorithmModule = {
    id: "kadane", name: "Maximum Subarray (Kadane)", category: "Divide and Conquer",
    description: "Find the contiguous subarray with the maximum sum using Kadane's algorithm. Tracks maxEndingHere and maxSoFar while scanning left to right.",
    pseudocode: ["maxEndingHere = maxSoFar = arr[0]", "for i from 1 to n-1:", "  maxEndingHere = max(arr[i], maxEndingHere + arr[i])", "  maxSoFar = max(maxSoFar, maxEndingHere)", "return maxSoFar"],
    complexity: { time: "O(n)", space: "O(1)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[-2,1,-3,4,-1,2,1,-5,4]" }],
    generateStates: kadaneGenerator
};
