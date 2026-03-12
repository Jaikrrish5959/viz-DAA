import type { AlgorithmModule, ExecutionState } from '../../types';

function* solveCombinationSum(candidatesStr: string, targetStr: string): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let candidates: number[] = [];
    let target = 7;
    try {
        candidates = candidatesStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        target = parseInt(targetStr, 10);
        if (isNaN(target)) target = 7;
        if (candidates.length === 0) throw new Error();
    } catch {
        candidates = [2, 3, 6, 7];
        target = 7;
    }

    // Sort to make the backtracking tree nicer and easier to prune
    candidates.sort((a, b) => a - b);

    const combination: number[] = [];

    function* backtrack(start: number, currentSum: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        if (currentSum === target) {
            yield {
                board: [[]], // Not using a 2D board directly for this visualizer, we use metadata
                recursion_depth: combination.length,
                action_type: 'solution',
                message: `Solution found! [${combination.join(', ')}] sums to ${target}.`,
                metadata: {
                    candidates,
                    target,
                    sum: currentSum,
                    combination: [...combination],
                    startIdx: start
                }
            };
            return;
        }

        if (currentSum > target) {
            yield {
                board: [[]],
                recursion_depth: combination.length,
                action_type: 'conflict',
                message: `Sum ${currentSum} exceeds target ${target}. Pruning branch.`,
                metadata: {
                    candidates,
                    target,
                    sum: currentSum,
                    combination: [...combination],
                    startIdx: start
                }
            };
            return;
        }

        for (let i = start; i < candidates.length; i++) {
            const num = candidates[i];

            yield {
                board: [[]],
                recursion_depth: combination.length + 1,
                action_type: 'try',
                message: `Trying candidate ${num}`,
                metadata: {
                    candidates,
                    target,
                    sum: currentSum,
                    combination: [...combination],
                    activeCandidateIdx: i,
                    startIdx: start
                }
            };

            combination.push(num);

            yield {
                board: [[]],
                recursion_depth: combination.length,
                action_type: 'place',
                message: `Added ${num}. Current sum: ${currentSum + num}`,
                metadata: {
                    candidates,
                    target,
                    sum: currentSum + num,
                    combination: [...combination],
                    activeCandidateIdx: i,
                    startIdx: start
                }
            };

            yield* backtrack(i, currentSum + num);

            combination.pop();

            yield {
                board: [[]],
                recursion_depth: combination.length,
                action_type: 'backtrack',
                message: `Backtracking, removed ${num}`,
                metadata: {
                    candidates,
                    target,
                    sum: currentSum,
                    combination: [...combination],
                    activeCandidateIdx: i,
                    startIdx: start
                }
            };
        }
    }

    yield {
        board: [[]],
        recursion_depth: 0,
        action_type: 'none',
        message: `Starting Combination Sum. Target: ${target}, Candidates: [${candidates.join(', ')}]`,
        metadata: {
            candidates,
            target,
            sum: 0,
            combination: [],
            startIdx: 0
        }
    };

    yield* backtrack(0, 0);
}

export const combinationSumModule: AlgorithmModule = {
    name: "Combination Sum",
    id: "combination-sum",
    category: "Backtracking",
    description: "Find all valid combinations of candidate numbers where the chosen numbers sum to a target. The same number may be chosen unlimited times.",
    pseudocode: [
        "function backtrack(start, combination, sum):",
        "  if sum == target:",
        "    save(combination)",
        "    return",
        "  if sum > target: return",
        "  for i from start to len(candidates)-1:",
        "    combination.push(candidates[i])",
        "    backtrack(i, combination, sum + candidates[i])",
        "    combination.pop()"
    ],
    complexity: {
        time: "O(N^(T/M)) where T=target, M=min_candidate",
        space: "O(T/M)"
    },
    inputConfig: [
        {
            name: 'candidates',
            label: 'Candidates (comma separated)',
            type: 'text',
            defaultValue: "2, 3, 6, 7"
        },
        {
            name: 'target',
            label: 'Target Sum',
            type: 'number',
            defaultValue: 7,
            min: 1,
            max: 50,
            step: 1
        }
    ],
    generateStates: (input: { candidates: string, target: string }) => solveCombinationSum(input.candidates || "2, 3, 6, 7", input.target ? String(input.target) : "7")
};
