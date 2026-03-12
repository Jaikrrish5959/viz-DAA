import type { AlgorithmModule, ExecutionState } from '../../types';

function cloneBoard(board: number[][]): number[][] {
    return board.map(row => [...row]);
}

function* solveMazeGenerator(mazeStr: string): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let maze: number[][];
    try {
        maze = JSON.parse(mazeStr);
        if (!Array.isArray(maze) || !Array.isArray(maze[0])) {
            throw new Error();
        }
    } catch (e) {
        // default fallback 4x4
        maze = [
            [1, 0, 0, 0],
            [1, 1, 0, 1],
            [0, 1, 0, 0],
            [1, 1, 1, 1]
        ];
    }

    const n = maze.length;
    const sol = Array.from({ length: n }, () => Array(n).fill(0));

    function isSafe(r: number, c: number) {
        return (r >= 0 && r < n && c >= 0 && c < n && maze[r][c] === 1);
    }

    function* solveMazeUtil(r: number, c: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, boolean, unknown> {
        if (r === n - 1 && c === n - 1 && maze[r][c] === 1) {
            sol[r][c] = 1;
            yield {
                board: cloneBoard(sol),
                recursion_depth: r + c,
                action_type: 'solution',
                message: 'Destination reached! Solution found.',
                metadata: { maze }
            };
            sol[r][c] = 0; // backtrack if we want to find other possible paths
            return true;
        }

        if (isSafe(r, c) && sol[r][c] === 0) { // sol[r][c] === 0 means unvisited path
            yield {
                board: cloneBoard(sol),
                recursion_depth: r + c,
                action_type: 'try',
                message: `Exploring cell (${r}, ${c})`,
                active_cells: [{ row: r, col: c }],
                metadata: { maze }
            };

            sol[r][c] = 1; // Mark visited / path taken

            yield {
                board: cloneBoard(sol),
                recursion_depth: r + c,
                action_type: 'place',
                message: `Path safe. Moved to (${r}, ${c})`,
                active_cells: [{ row: r, col: c }],
                metadata: { maze }
            };

            let found = false;

            // Move Down
            if (yield* solveMazeUtil(r + 1, c)) found = true;
            // Move Right
            if (yield* solveMazeUtil(r, c + 1)) found = true;
            // Move Up
            if (yield* solveMazeUtil(r - 1, c)) found = true;
            // Move Left
            if (yield* solveMazeUtil(r, c - 1)) found = true;

            // Backtrack
            sol[r][c] = 0;

            yield {
                board: cloneBoard(sol),
                recursion_depth: r + c,
                action_type: 'backtrack',
                message: `Dead end. Backtracking from (${r}, ${c})`,
                active_cells: [{ row: r, col: c }],
                metadata: { maze }
            };

            return found;
        }

        // Only yield conflict if we actually try to step out of bounds or into wall that isn't visited
        if (!isSafe(r, c)) {
            yield {
                board: cloneBoard(sol),
                recursion_depth: r + c,
                action_type: 'conflict',
                message: `Wall at (${r}, ${c}) or out of bounds.`,
                active_cells: [{ row: r, col: c }],
                metadata: { maze }
            };
        }

        return false;
    }

    yield {
        board: cloneBoard(sol),
        recursion_depth: 0,
        action_type: 'none',
        message: `Starting Rat in a Maze with ${n}x${n} grid`,
        metadata: { maze }
    };

    yield* solveMazeUtil(0, 0);
}

// Generates a random N x N maze ensuring there is at least a path (though backtracking might still say false if we restrict it, but let's just generate a somewhat random one)
// A simple way to guarantee a path is to carve one first, then randomly fill.
export function generateRandomMazeString(n = 5): string {
    const maze = Array.from({ length: n }, () => Array(n).fill(0));

    // Create a guaranteed path: right then down randomly
    let r = 0, c = 0;
    maze[r][c] = 1;
    while (r < n - 1 || c < n - 1) {
        if (r === n - 1) c++;
        else if (c === n - 1) r++;
        else {
            Math.random() > 0.5 ? r++ : c++;
        }
        maze[r][c] = 1;
    }

    // Randomly open other walls to create alternatives and dead ends
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (maze[i][j] === 0 && Math.random() > 0.6) {
                maze[i][j] = 1;
            }
        }
    }

    return JSON.stringify(maze);
}

export const ratMazeModule: AlgorithmModule = {
    name: "Rat in a Maze",
    id: "rat-maze",
    category: "Backtracking",
    description: "A rat starts at the top-left corner and must reach the bottom-right corner of a maze. The rat can move in 4 directions: Up, Down, Left, Right. '1' represents a valid path, '0' is a wall.",
    pseudocode: [
        "function solveMaze(maze, r, c, sol):",
        "  if (r, c) is destination:",
        "    sol[r][c] = 1",
        "    return true",
        "  if isSafe(maze, r, c) and not visited(sol, r, c):",
        "    sol[r][c] = 1 // Mark as part of path",
        "    if solveMaze(maze, r+1, c, sol) return true",
        "    if solveMaze(maze, r, c+1, sol) return true",
        "    if solveMaze(maze, r-1, c, sol) return true",
        "    if solveMaze(maze, r, c-1, sol) return true",
        "    sol[r][c] = 0 // Backtrack",
        "  return false"
    ],
    complexity: {
        time: "O(4^(N^2))",
        space: "O(N^2)"
    },
    inputConfig: [
        {
            name: 'mazeStr',
            label: 'Matrix JSON (1=Path, 0=Wall)',
            type: 'text',
            defaultValue: generateRandomMazeString(5) // Dynamic invocation
        }
    ],
    generateStates: (input: { mazeStr: string }) => solveMazeGenerator(input.mazeStr || generateRandomMazeString(5))
};
