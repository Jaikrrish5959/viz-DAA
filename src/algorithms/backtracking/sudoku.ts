import type { AlgorithmModule, ExecutionState } from '../../types';

function* sudokuGenerator({ board: bStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let board: number[][];
    try {
        board = JSON.parse(bStr);
    } catch {
        board = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
    }

    const cloneBoard = () => board.map(r => [...r]);

    function isValid(row: number, col: number, num: number): boolean {
        for (let j = 0; j < 9; j++) if (board[row][j] === num) return false;
        for (let i = 0; i < 9; i++) if (board[i][col] === num) return false;
        const boxR = Math.floor(row / 3) * 3, boxC = Math.floor(col / 3) * 3;
        for (let i = boxR; i < boxR + 3; i++)
            for (let j = boxC; j < boxC + 3; j++)
                if (board[i][j] === num) return false;
        return true;
    }

    yield {
        board: cloneBoard(), recursion_depth: 0, action_type: 'none',
        message: 'Starting Sudoku Solver',
        metadata: { row: -1, col: -1 }
    };

    function* solve(): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, boolean, unknown> {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        yield {
                            board: cloneBoard(), recursion_depth: 0, action_type: 'try',
                            message: `Trying ${num} at (${i}, ${j})`,
                            metadata: { row: i, col: j }
                        };

                        if (isValid(i, j, num)) {
                            board[i][j] = num;
                            yield {
                                board: cloneBoard(), recursion_depth: 0, action_type: 'place',
                                message: `Placed ${num} at (${i}, ${j})`,
                                metadata: { row: i, col: j }
                            };

                            const result: boolean = yield* solve();
                            if (result) return true;

                            board[i][j] = 0;
                            yield {
                                board: cloneBoard(), recursion_depth: 0, action_type: 'backtrack',
                                message: `Backtracking from (${i}, ${j})`,
                                metadata: { row: i, col: j }
                            };
                        } else {
                            yield {
                                board: cloneBoard(), recursion_depth: 0, action_type: 'conflict',
                                message: `${num} conflicts at (${i}, ${j})`,
                                metadata: { row: i, col: j }
                            };
                        }
                    }
                    return false;
                }
            }
        }
        yield {
            board: cloneBoard(), recursion_depth: 0, action_type: 'solution',
            message: 'Sudoku Solved!',
            metadata: { row: -1, col: -1 }
        };
        return true;
    }

    yield* solve();
}

export const sudokuModule: AlgorithmModule = {
    id: "sudoku", name: "Sudoku Solver", category: "Backtracking",
    description: "Solve a 9×9 Sudoku puzzle using backtracking. Fill each empty cell with digits 1-9 such that each row, column, and 3×3 box contains all digits.",
    pseudocode: [
        "for each empty cell (i,j):",
        "  for num from 1 to 9:",
        "    if isValid(i, j, num):",
        "      place num",
        "      if solve(): return true",
        "      backtrack",
        "  return false"
    ],
    complexity: { time: "O(9^(n²))", space: "O(n²)" },
    inputConfig: [{
        name: "board", type: "json", label: "Board (9x9, 0=empty)",
        defaultValue: "[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]"
    }],
    generateStates: sudokuGenerator
};
