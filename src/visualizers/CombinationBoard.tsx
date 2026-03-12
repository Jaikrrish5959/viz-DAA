import React from 'react';
import type { ExecutionState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CombinationBoardProps {
    state: ExecutionState;
}

export const CombinationBoard: React.FC<CombinationBoardProps> = ({ state }) => {
    if (!state || !state.metadata) {
        return (
            <div className="text-gray-500 font-mono">
                No visualization data available for this state.
            </div>
        );
    }

    const { candidates, target, sum, combination, activeCandidateIdx } = state.metadata;

    const remaining = target - sum;
    const isExceeded = sum > target;

    return (
        <div className="flex flex-col items-center w-full max-w-2xl gap-8 p-4">

            {/* Header / Status Info */}
            <div className="w-full flex justify-between bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col items-center">
                    <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Target</span>
                    <span className="text-4xl font-outfit font-bold text-white">{target}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Current Sum</span>
                    <span className={`text-4xl font-outfit font-bold ${isExceeded ? 'text-red-500' : state.action_type === 'solution' ? 'text-green-500' : 'text-primary-400'}`}>
                        {sum}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Remaining</span>
                    <span className={`text-4xl font-outfit font-bold ${remaining < 0 ? 'text-red-500' : 'text-gray-300'}`}>
                        {remaining}
                    </span>
                </div>
            </div>

            {/* Candidates Array */}
            <div className="w-full">
                <h3 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">Candidates</h3>
                <div className="flex flex-wrap gap-3">
                    {candidates.map((num: number, idx: number) => {
                        const isExploring = idx === activeCandidateIdx && (state.action_type === 'try' || state.action_type === 'backtrack');
                        return (
                            <div
                                key={idx}
                                className={`
                                    w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold font-mono transition-all duration-300 border-2
                                    ${isExploring ? 'bg-primary-500/20 border-primary-500 text-primary-300 scale-110 shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                                        : 'bg-gray-800 border-gray-700 text-gray-300'}
                                `}
                            >
                                {num}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Current Combination Stack */}
            <div className="w-full">
                <h3 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">Current Combination (Stack)</h3>

                <div className="min-h-[80px] w-full bg-[#0a0a0c] border border-gray-800 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
                    <AnimatePresence>
                        {combination.length === 0 && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-gray-600 font-mono italic"
                            >
                                [ Empty ]
                            </motion.span>
                        )}
                        {combination.map((num: number, idx: number) => {
                            // The last item often just got added
                            const isLatest = idx === combination.length - 1;

                            let bgClass = "bg-gray-700 border-gray-600 text-white";
                            if (isLatest) {
                                if (state.action_type === 'place') bgClass = "bg-blue-500/20 border-blue-500 text-blue-300";
                                if (state.action_type === 'conflict') bgClass = "bg-red-500/20 border-red-500 text-red-300";
                                if (state.action_type === 'solution') bgClass = "bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.4)]";
                            } else if (state.action_type === 'solution') {
                                bgClass = "bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.4)]";
                            }

                            return (
                                <motion.div
                                    key={`${idx}-${num}`}
                                    initial={{ scale: 0, x: -20, opacity: 0 }}
                                    animate={{ scale: 1, x: 0, opacity: 1 }}
                                    exit={{ scale: 0, y: 20, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2 ${bgClass}`}
                                >
                                    {num}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Action State Readout */}
            <div className={`mt-4 w-full p-4 rounded-xl border flex items-center justify-between font-mono text-sm
                ${state.action_type === 'conflict' ? 'bg-red-950/50 border-red-900/50 text-red-400' :
                    state.action_type === 'solution' ? 'bg-green-950/50 border-green-900/50 text-green-400' :
                        state.action_type === 'backtrack' ? 'bg-orange-950/50 border-orange-900/50 text-orange-400' :
                            'bg-gray-900 border-gray-800 text-gray-400'}
            `}>
                <span className="font-semibold uppercase pr-4 border-r border-[inherit]">{state.action_type}</span>
                <span className="pl-4 flex-1 text-right">{state.message}</span>
            </div>

        </div>
    );
};
