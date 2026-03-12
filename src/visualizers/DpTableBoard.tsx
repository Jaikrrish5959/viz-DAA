import React from 'react';
import type { ExecutionState } from '../types';

interface DpTableBoardProps {
    state: ExecutionState;
}

export const DpTableBoard: React.FC<DpTableBoardProps> = ({ state }) => {
    if (!state || !state.metadata || !state.metadata.dpTable) {
        return <div className="text-gray-500">No visualization data available.</div>;
    }

    const {
        action_type,
        message,
        metadata: {
            row: activeRow,
            col: activeCol,
            dpTable,
            compareInclude,
            compareExclude,
            weights,
            values,
            capacity,
            selectedItems,
            maxValue
        }
    } = state;

    // Helper to determine the color of a cell
    const getCellClass = (r: number, c: number) => {
        let base = "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border font-mono text-sm transition-colors duration-300 ";

        if (action_type === 'solution' && selectedItems) {
            // Highlight rows that correspond to selected items
            if (r > 0 && selectedItems.includes(r - 1)) {
                return base + "bg-purple-900/50 border-purple-500 text-purple-300";
            }
            return base + "bg-gray-800 border-gray-700 text-gray-500";
        }

        if (r === activeRow && c === activeCol) {
            if (action_type === 'explore') return base + "bg-blue-900/50 border-blue-500 text-blue-300 scale-110 shadow-lg z-10";
            if (action_type === 'compare') return base + "bg-yellow-900/50 border-yellow-500 text-yellow-300 scale-110 shadow-lg z-10";
            if (action_type === 'update') return base + "bg-green-900/50 border-green-500 text-green-300 scale-110 shadow-lg z-10";
            if (action_type === 'skip') return base + "bg-gray-700 border-gray-500 text-gray-300 scale-110 shadow-lg z-10 text-opacity-50";
        }

        // Highlight cells being compared
        if (action_type === 'compare') {
            if (compareInclude && r === compareInclude.row && c === compareInclude.col) {
                return base + "bg-yellow-900/30 border-yellow-600/50 text-yellow-400 font-bold border-2";
            }
            if (compareExclude && r === compareExclude.row && c === compareExclude.col) {
                return base + "bg-yellow-900/30 border-yellow-600/50 text-yellow-400 font-bold border-2";
            }
        }

        return base + "bg-gray-800 border-gray-700 text-gray-400";
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl gap-6 p-4 overflow-x-auto">

            {/* Action State Readout */}
            <div className={`w-full p-4 rounded-xl border flex items-center justify-between font-mono text-sm
                ${action_type === 'skip' ? 'bg-gray-900 border-gray-700 text-gray-400' :
                    action_type === 'solution' ? 'bg-purple-950/50 border-purple-900/50 text-purple-400' :
                        action_type === 'explore' ? 'bg-blue-950/50 border-blue-900/50 text-blue-400' :
                            action_type === 'compare' ? 'bg-yellow-950/50 border-yellow-900/50 text-yellow-400' :
                                action_type === 'update' ? 'bg-green-950/50 border-green-900/50 text-green-400' :
                                    'bg-gray-900 border-gray-800 text-gray-400'}
            `}>
                <span className="font-semibold uppercase pr-4 border-r border-[inherit]">{action_type}</span>
                <span className="pl-4 flex-1">{message}</span>
            </div>

            {/* DP Table */}
            <div className="flex flex-col gap-1 bg-gray-950 p-6 rounded-2xl shadow-2xl border border-gray-800 overflow-visible w-max">
                {/* Column Headers */}
                <div className="flex gap-1">
                    <div className="w-20 pl-2 text-xs text-gray-500 flex flex-col justify-end pb-2">Cap &#x2192;</div>
                    {Array.from({ length: capacity + 1 }).map((_, w) => (
                        <div key={`header-col-${w}`} className="w-10 sm:w-12 text-center text-xs text-gray-500 font-mono pb-2">
                            {w}
                        </div>
                    ))}
                </div>

                {dpTable.map((row: number[], r: number) => (
                    <div key={`row-${r}`} className="flex gap-1 items-center">
                        {/* Row Header */}
                        <div className="w-20 pr-4 text-xs font-mono text-gray-500 flex flex-col justify-center leading-tight text-right">
                            {r === 0 ? (
                                <span>i=0</span>
                            ) : (
                                <>
                                    <span>i={r}</span>
                                    <span className="text-[10px] text-gray-600">w:{weights[r - 1]} v:{values[r - 1]}</span>
                                </>
                            )}
                        </div>

                        {/* Cells */}
                        {row.map((cellValue: number, c: number) => (
                            <div key={`cell-${r}-${c}`} className={getCellClass(r, c)}>
                                {cellValue}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Solution Readout (if applicable) */}
            {action_type === 'solution' && (
                <div className="mt-4 p-6 bg-purple-900/20 border border-purple-500/30 rounded-2xl w-full flex justify-around">
                    <div className="flex flex-col items-center">
                        <span className="text-purple-400/60 text-xs uppercase tracking-wider font-semibold mb-1">Max Value</span>
                        <span className="text-4xl font-bold font-outfit text-purple-400">{maxValue}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-purple-400/60 text-xs uppercase tracking-wider font-semibold mb-1">Selected Items (0-indexed)</span>
                        <span className="text-2xl font-mono text-purple-300 mt-2">
                            [{selectedItems?.join(', ')}]
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
