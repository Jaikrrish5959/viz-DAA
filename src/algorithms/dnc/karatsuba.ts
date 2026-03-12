import type { AlgorithmModule, ExecutionState } from '../../types';

function* karatsubaGenerator({ numA: aStr, numB: bStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let a: number, b: number;
    try { a = parseInt(aStr, 10); b = parseInt(bStr, 10); } catch { a = 1234; b = 5678; }
    if (isNaN(a)) a = 1234;
    if (isNaN(b)) b = 5678;

    function* multiply(x: number, y: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, number, unknown> {
        if (x < 10 || y < 10) {
            const result = x * y;
            yield { recursion_depth: depth, action_type: 'solution', array: [x, y, result], message: `Base case: ${x} × ${y} = ${result}`, metadata: { indices: [], sortedFrom: -1 } };
            return result;
        }

        const sx = String(x), sy = String(y);
        const n = Math.max(sx.length, sy.length);
        const half = Math.floor(n / 2);
        const power = 10 ** half;

        const high1 = Math.floor(x / power), low1 = x % power;
        const high2 = Math.floor(y / power), low2 = y % power;

        yield { recursion_depth: depth, action_type: 'explore', array: [x, y], message: `Split: ${x} → (${high1}, ${low1}), ${y} → (${high2}, ${low2}), half=${half}`, metadata: { indices: [], sortedFrom: -1 } };

        yield { recursion_depth: depth, action_type: 'explore', array: [], message: `Computing z0 = ${low1} × ${low2}`, metadata: { indices: [], sortedFrom: -1 } };
        const z0: number = yield* multiply(low1, low2, depth + 1);

        yield { recursion_depth: depth, action_type: 'explore', array: [], message: `Computing z2 = ${high1} × ${high2}`, metadata: { indices: [], sortedFrom: -1 } };
        const z2: number = yield* multiply(high1, high2, depth + 1);

        yield { recursion_depth: depth, action_type: 'explore', array: [], message: `Computing z1 = (${high1}+${low1}) × (${high2}+${low2}) - z2 - z0`, metadata: { indices: [], sortedFrom: -1 } };
        const z1sum: number = yield* multiply(high1 + low1, high2 + low2, depth + 1);
        const z1 = z1sum - z2 - z0;

        const result = z2 * (power * power) + z1 * power + z0;

        yield { recursion_depth: depth, action_type: 'update', array: [z0, z1, z2, result], message: `z0=${z0}, z1=${z1}, z2=${z2} → result = ${z2}×${power * power} + ${z1}×${power} + ${z0} = ${result}`, metadata: { indices: [], sortedFrom: -1 } };

        return result;
    }

    yield { recursion_depth: 0, action_type: 'none', array: [a, b], message: `Karatsuba Multiplication: ${a} × ${b}`, metadata: { indices: [], sortedFrom: -1 } };

    const result: number = yield* multiply(a, b, 0);

    yield { recursion_depth: 0, action_type: 'solution', array: [a, b, result], message: `Final result: ${a} × ${b} = ${result}`, metadata: { indices: [], sortedFrom: 0 } };
}

export const karatsubaModule: AlgorithmModule = {
    id: "karatsuba", name: "Karatsuba Multiplication", category: "Divide and Conquer",
    description: "Multiply large integers using divide and conquer. Splits each number in half and uses 3 multiplications instead of 4, achieving O(n^1.585) complexity.",
    pseudocode: ["karatsuba(x, y):", "  if x<10 or y<10: return x*y", "  split x→(high1,low1), y→(high2,low2)", "  z0 = karatsuba(low1, low2)", "  z2 = karatsuba(high1, high2)", "  z1 = karatsuba(high1+low1, high2+low2)-z2-z0", "  return z2*10^2m + z1*10^m + z0"],
    complexity: { time: "O(n^1.585)", space: "O(n)" },
    inputConfig: [
        { name: "numA", type: "number", label: "Number A", defaultValue: 1234 },
        { name: "numB", type: "number", label: "Number B", defaultValue: 5678 }
    ],
    generateStates: karatsubaGenerator
};
