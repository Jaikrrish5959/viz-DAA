import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ExecutionState } from '../types';

interface BacktrackingBoardProps {
    state: ExecutionState | undefined;
    n: number;
}

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// Helper to trace the path continuously
function getPathCoordinates(board: number[][], n: number): { r: number, c: number }[] {
    const coords: { r: number, c: number }[] = [];
    // For rat in a maze, it starts at 0,0 and usually we can just find adjacent 1s
    // To keep it simple, let's just trace the path by looking for neighbors since it's a simple path
    let curr_r = 0;
    let curr_c = 0;

    if (board[0][0] !== 1) return coords;
    coords.push({ r: curr_r, c: curr_c });

    const visited = new Set();
    visited.add(`0,0`);

    let finding = true;
    while (finding) {
        finding = false;
        const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        for (const [dr, dc] of dirs) {
            const nr = curr_r + dr;
            const nc = curr_c + dc;
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && board[nr][nc] === 1 && !visited.has(`${nr},${nc}`)) {
                coords.push({ r: nr, c: nc });
                visited.add(`${nr},${nc}`);
                curr_r = nr;
                curr_c = nc;
                finding = true;
                break; // Stop looking for next neighbor once found to keep it linear
            }
        }
    }
    return coords;
}

export const BacktrackingBoard: React.FC<BacktrackingBoardProps> = ({ state, n }) => {
    if (!state || !state.board) {
        return (
            <div className="flex items-center justify-center h-full w-full text-gray-500 font-outfit">
                Loading Board...
            </div>
        );
    }

    const board = state.board;

    // Active cell evaluation
    const isActiveCell = (r: number, c: number) => {
        return state.active_cells?.some((cell) => cell.row === r && cell.col === c) || false;
    };

    const getCellStyles = (r: number, c: number) => {
        const isActive = isActiveCell(r, c);
        const isMaze = state.algorithm === 'rat-maze';
        const isWall = isMaze && state.metadata?.maze && state.metadata.maze[r][c] === 0;

        let baseStyle = "w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center border transition-all duration-300 relative";

        if (isWall) {
            baseStyle = cn(baseStyle, "bg-gray-950 border-gray-900 shadow-inner");
        } else if (isMaze) {
            baseStyle = cn(baseStyle, "bg-gray-800 border-gray-700");
        } else {
            // Chessboard pattern
            if ((r + c) % 2 === 0) {
                baseStyle = cn(baseStyle, "bg-gray-800 border-gray-700");
            } else {
                baseStyle = cn(baseStyle, "bg-gray-900 border-gray-700");
            }
        }

        if (isActive) {
            if (state.action_type === 'try') {
                baseStyle = cn(baseStyle, "ring-4 ring-yellow-400 z-10");
            } else if (state.action_type === 'place') {
                baseStyle = cn(baseStyle, "ring-4 ring-green-500 z-10");
            } else if (state.action_type === 'conflict') {
                baseStyle = cn(baseStyle, "ring-4 ring-red-500 z-10 bg-red-900/50");
            } else if (state.action_type === 'backtrack') {
                baseStyle = cn(baseStyle, "ring-4 ring-orange-500 z-10 opacity-50");
            }
        }

        return baseStyle;
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-app-surface rounded-2xl border border-app-border shadow-[0_0_40px_rgba(139,92,246,0.05)] w-full w-full max-w-2xl mx-auto">
            <div className="mb-6 flex justify-between w-full items-center">
                <h3 className="text-xl font-outfit font-medium text-white">Board Visualization</h3>
                <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    state.action_type === 'solution' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                        state.action_type === 'conflict' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                            state.action_type === 'place' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50' :
                                'bg-gray-800 text-gray-300 border border-gray-700'
                )}>
                    {state.action_type}
                </span>
            </div>

            <div
                className="grid gap-1 bg-gray-700 p-1 rounded-lg shadow-xl relative"
                style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
            >
                {state.action_type === 'solution' && state.algorithm === 'rat-maze' && (
                    <svg className="absolute inset-0 pointer-events-none z-20" style={{ width: '100%', height: '100%' }}>
                        {(() => {
                            const coords = getPathCoordinates(board, n);
                            if (coords.length < 2) return null;

                            // Gap is 4px (1rem/4 = 0.25rem = 4px in Tailwind gap-1, wait gap is handled by CSS, let's use percentage or viewBox)
                            // SVG viewBox makes alignment trivial
                            // viewBox="0 0 N N", each cell is 1x1
                            const pathStr = coords.map((pt, i) =>
                                `${i === 0 ? 'M' : 'L'} ${pt.c + 0.5} ${pt.r + 0.5}`
                            ).join(' ');

                            return (
                                <svg viewBox={`0 0 ${n} ${n}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    <defs>
                                        <marker id="arrowhead" markerWidth="6" markerHeight="6"
                                            refX="5" refY="3" orient="auto">
                                            <polygon points="0 0, 6 3, 0 6" fill="#22c55e" />
                                        </marker>
                                    </defs>
                                    <path
                                        d={pathStr}
                                        fill="none"
                                        stroke="#22c55e"
                                        strokeWidth="0.1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        markerEnd="url(#arrowhead)"
                                        className="drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                                        strokeDasharray="10"
                                    >
                                        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
                                    </path>
                                </svg>
                            );
                        })()}
                    </svg>
                )}

                {board.map((row, r) => (
                    row.map((cell, c) => {
                        const isMaze = state.algorithm === 'rat-maze'; // Define isMaze here for use in this scope
                        const isWall = isMaze && state.metadata?.maze && state.metadata.maze[r][c] === 0;
                        const isPlaced = cell === 1;
                        const isSolutionPath = state.action_type === 'solution' && isPlaced && !isWall;

                        return (
                            <div key={`${r}-${c}`} className={cn(getCellStyles(r, c), isSolutionPath && "ring-2 ring-inset ring-green-500/30")}>
                                {(isPlaced && !isSolutionPath) && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="w-3/4 h-3/4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.6)] border border-white/20"
                                    />
                                )}
                                {isSolutionPath && (
                                    <div className="w-1/2 h-1/2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                                )}
                            </div>
                        )
                    }
                    )
                ))}
            </div>

            <div className="mt-8 p-4 bg-app-bg rounded-lg border border-app-border w-full">
                <p className="text-gray-400 font-mono text-sm">
                    <span className="text-primary-400 mr-2">{`>`}</span>
                    {state.message}
                </p>
            </div>
        </div>
    );
};
