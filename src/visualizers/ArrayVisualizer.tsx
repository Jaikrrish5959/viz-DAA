import React from 'react';
import { motion } from 'framer-motion';
import type { ExecutionState } from '../types';

interface ArrayVisualizerProps {
    state: ExecutionState;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ state }) => {
    if (!state || !state.array || state.array.length === 0) {
        return <div className="text-gray-500">No visualization data available.</div>;
    }

    const { array, action_type, message, metadata } = state;
    const indices: number[] = metadata?.indices || [];
    const sortedFrom: number = metadata?.sortedFrom ?? array.length;
    const pivotIndex: number | undefined = metadata?.pivotIndex;
    const maxVal = Math.max(...array, 1);
    const n = array.length;

    const getBarColor = (idx: number): string => {
        // Sorted region
        if (sortedFrom >= 0 && idx >= sortedFrom && action_type !== 'solution') {
            return 'bg-emerald-500/90';
        }
        // Final solution — all green
        if (action_type === 'solution') {
            return 'bg-emerald-500/90';
        }
        // Pivot
        if (idx === pivotIndex || (action_type === 'pivot' && indices.includes(idx))) {
            return 'bg-purple-500/90';
        }
        // Active indices
        if (indices.includes(idx)) {
            if (action_type === 'swap') return 'bg-red-500/90';
            if (action_type === 'compare') return 'bg-yellow-500/90';
            if (action_type === 'overwrite') return 'bg-orange-500/90';
            if (action_type === 'explore') return 'bg-blue-500/90';
            if (action_type === 'sorted') return 'bg-emerald-500/90';
            if (action_type === 'place') return 'bg-emerald-400/90';
            return 'bg-blue-500/90';
        }
        return 'bg-slate-600/80';
    };

    const getBarBorder = (idx: number): string => {
        if (indices.includes(idx)) {
            if (action_type === 'swap') return 'ring-2 ring-red-400/60';
            if (action_type === 'compare') return 'ring-2 ring-yellow-400/60';
            if (action_type === 'pivot') return 'ring-2 ring-purple-400/60';
            if (action_type === 'overwrite') return 'ring-2 ring-orange-400/60';
        }
        return '';
    };

    const actionBadgeStyle = (): string => {
        switch (action_type) {
            case 'swap': return 'bg-red-950/50 border-red-900/50 text-red-400';
            case 'compare': return 'bg-yellow-950/50 border-yellow-900/50 text-yellow-400';
            case 'pivot': return 'bg-purple-950/50 border-purple-900/50 text-purple-400';
            case 'overwrite': return 'bg-orange-950/50 border-orange-900/50 text-orange-400';
            case 'sorted': return 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400';
            case 'solution': return 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400';
            case 'explore': return 'bg-blue-950/50 border-blue-900/50 text-blue-400';
            case 'place': return 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400';
            default: return 'bg-gray-900 border-gray-800 text-gray-400';
        }
    };

    // Calculate bar width based on number of elements
    const barWidth = n <= 10 ? 'w-12' : n <= 20 ? 'w-8' : n <= 40 ? 'w-5' : 'w-3';
    const showLabel = n <= 20;
    const gapClass = n <= 10 ? 'gap-2' : n <= 20 ? 'gap-1.5' : 'gap-0.5';

    return (
        <div className="flex flex-col items-center w-full max-w-4xl gap-6 p-4">
            {/* Action Status */}
            <div className={`w-full p-4 rounded-xl border flex items-center justify-between font-mono text-sm ${actionBadgeStyle()}`}>
                <span className="font-semibold uppercase pr-4 border-r border-[inherit]">{action_type}</span>
                <span className="pl-4 flex-1">{message}</span>
            </div>

            {/* Bar Chart */}
            <div className={`flex items-end justify-center ${gapClass} bg-gray-950 p-8 rounded-2xl shadow-2xl border border-gray-800 min-h-[280px] w-full`}>
                {array.map((val, idx) => {
                    const heightPercent = (val / maxVal) * 100;
                    return (
                        <div key={idx} className="flex flex-col items-center">
                            <motion.div
                                className={`${barWidth} rounded-t-md ${getBarColor(idx)} ${getBarBorder(idx)} relative`}
                                style={{ height: `${Math.max(heightPercent * 2, 8)}px` }}
                                initial={false}
                                animate={{
                                    height: `${Math.max(heightPercent * 2, 8)}px`,
                                    scale: indices.includes(idx) ? 1.05 : 1,
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            >
                                {/* Value on top of bar */}
                                {showLabel && (
                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-gray-300 whitespace-nowrap">
                                        {val}
                                    </span>
                                )}
                            </motion.div>
                            {/* Index label */}
                            {showLabel && (
                                <span className="text-[9px] font-mono text-gray-600 mt-1">{idx}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-[10px] font-mono text-gray-500 justify-center">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500/90 rounded-sm"></span> Inspecting</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500/90 rounded-sm"></span> Comparing</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500/90 rounded-sm"></span> Swap</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500/90 rounded-sm"></span> Pivot</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500/90 rounded-sm"></span> Sorted</span>
            </div>
        </div>
    );
};
