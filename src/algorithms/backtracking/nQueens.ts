import type { AlgorithmModule, ExecutionState } from '../../types';

function createEmptyBoard(n: number): number[][] {
    return Array.from({ length: n }, () => Array(n).fill(0));
}

function cloneBoard(board: number[][]): number[][] {
    return board.map(row => [...row]);
}

function isSafe(board: number[][], row: number, col: number, n: number): boolean {
    // Check this column on upper rows
    for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false;
    }

    // Check upper diagonal on left side
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 1) return false;
    }

    // Check upper diagonal on right side
    for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
        if (board[i][j] === 1) return false;
    }

    return true;
}

function* solveNQueensGenerator(n: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const board = createEmptyBoard(n);

    function* backtrack(row: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, boolean, unknown> {
        if (row === n) {
            yield {
                board: cloneBoard(board),
                recursion_depth: row,
                action_type: 'solution',
                message: 'Solution found!',
            };
            return true;
        }

        let foundAnySolution = false;

        for (let col = 0; col < n; col++) {
            yield {
                board: cloneBoard(board),
                recursion_depth: row,
                action_type: 'try',
                message: `Trying column ${col} for row ${row}`,
                active_cells: [{ row, col }]
            };

            if (isSafe(board, row, col, n)) {
                board[row][col] = 1;

                yield {
                    board: cloneBoard(board),
                    recursion_depth: row,
                    action_type: 'place',
                    message: `Safe. Placing Queen at row ${row}, col ${col}`,
                    active_cells: [{ row, col }]
                };

                const result = yield* backtrack(row + 1);
                if (result) foundAnySolution = true;
                // Note: For finding ALL solutions, we do not return immediately, we keep searching.
                // N Queens standard visualizer usually finds all solutions or stops at one based on user config.
                // We will just find all solutions to show full backtracking capability.

                // Backtrack
                board[row][col] = 0;

                yield {
                    board: cloneBoard(board),
                    recursion_depth: row,
                    action_type: 'backtrack',
                    message: `Backtracking from row ${row}, col ${col}`,
                    active_cells: [{ row, col }]
                };

            } else {
                yield {
                    board: cloneBoard(board),
                    recursion_depth: row,
                    action_type: 'conflict',
                    message: `Conflict detected at row ${row}, col ${col}`,
                    active_cells: [{ row, col }]
                };
            }
        }

        return foundAnySolution;
    }

    yield {
        board: cloneBoard(board),
        recursion_depth: 0,
        action_type: 'none',
        message: `Starting N-Queens with N=${n}`,
    };

    yield* backtrack(0);
}

export const nQueensModule: AlgorithmModule = {
    name: "N Queens",
    id: "n-queens",
    category: "Backtracking",
    description: "The N Queens puzzle is the problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other.",
    pseudocode: [
        "function solveNQueens(board, row):",
        "  if row == N:",
        "    return true // Solution found",
        "  for col = 0 to N - 1:",
        "    if isSafe(board, row, col):",
        "      placeQueen(board, row, col)",
        "      solveNQueens(board, row + 1)",
        "      removeQueen(board, row, col) // Backtrack"
    ],
    complexity: {
        time: "O(N!)",
        space: "O(N)"
    },
    inputConfig: [
        {
            name: 'n',
            label: 'Board Size (N)',
            type: 'number',
            defaultValue: 4,
            min: 4,
            max: 12,
            step: 1
        }
    ],
    generateStates: (input: { n: number }) => solveNQueensGenerator(input.n || 4)
};
