import React from 'react';
import type { ExecutionState } from '../types';

interface StringVisualizerProps { state: ExecutionState; }

export const StringVisualizer: React.FC<StringVisualizerProps> = ({ state }) => {
    if (!state?.metadata) return <div className="text-gray-500">No string data.</div>;

    const { text, pattern, textIdx, patIdx, matches = [], lps, concat } = state.metadata;
    const { action_type, message } = state;

    const actionColor = (): string => {
        switch (action_type) {
            case 'compare': return 'bg-yellow-950/50 border-yellow-900/50 text-yellow-400';
            case 'found': return 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400';
            case 'skip': return 'bg-orange-950/50 border-orange-900/50 text-orange-400';
            case 'conflict': return 'bg-red-950/50 border-red-900/50 text-red-400';
            case 'explore': return 'bg-blue-950/50 border-blue-900/50 text-blue-400';
            case 'solution': return 'bg-purple-950/50 border-purple-900/50 text-purple-400';
            default: return 'bg-gray-900 border-gray-800 text-gray-400';
        }
    };

    const displayText = text || concat || '';
    const displayPattern = pattern || '';

    return (
        <div className="flex flex-col items-center w-full max-w-3xl gap-6 p-4">
            {/* Status */}
            <div className={`w-full p-4 rounded-xl border flex items-center justify-between font-mono text-sm ${actionColor()}`}>
                <span className="font-semibold uppercase pr-4 border-r border-[inherit]">{action_type}</span>
                <span className="pl-4 flex-1">{message}</span>
            </div>

            {/* Text Display */}
            <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 shadow-2xl w-full overflow-x-auto">
                <div className="text-gray-500 text-xs font-mono mb-2 uppercase tracking-wider">Text</div>
                <div className="flex flex-wrap gap-0.5 mb-6">
                    {[...displayText].map((ch, i) => {
                        const isMatch = matches.some((m: number) => i >= m && i < m + displayPattern.length);
                        const isActive = i === textIdx;
                        const isWindow = textIdx >= 0 && i >= textIdx && i < textIdx + displayPattern.length;
                        return (
                            <span key={i} className={`w-7 h-8 flex items-center justify-center text-sm font-mono rounded-md transition-all duration-200 ${isMatch ? 'bg-emerald-600/40 text-emerald-300 ring-1 ring-emerald-500/50' :
                                    isActive ? 'bg-blue-600/50 text-blue-200 ring-2 ring-blue-400/50 scale-110' :
                                        isWindow ? 'bg-yellow-600/20 text-yellow-300' :
                                            'bg-gray-800/50 text-gray-400'
                                }`}>
                                {ch}
                            </span>
                        );
                    })}
                </div>

                {displayPattern && (
                    <>
                        <div className="text-gray-500 text-xs font-mono mb-2 uppercase tracking-wider">Pattern</div>
                        <div className="flex flex-wrap gap-0.5 mb-4">
                            {[...displayPattern].map((ch, i) => {
                                const isActive = i === patIdx;
                                return (
                                    <span key={i} className={`w-7 h-8 flex items-center justify-center text-sm font-mono rounded-md ${isActive ? 'bg-purple-600/40 text-purple-200 ring-2 ring-purple-400/50' :
                                            'bg-gray-800/50 text-gray-400'
                                        }`}>
                                        {ch}
                                    </span>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* LPS Array */}
                {lps && (
                    <>
                        <div className="text-gray-500 text-xs font-mono mb-2 uppercase tracking-wider">LPS / Z Array</div>
                        <div className="flex flex-wrap gap-0.5">
                            {lps.map((v: number, i: number) => (
                                <span key={i} className="w-7 h-7 flex items-center justify-center text-xs font-mono bg-gray-800/50 text-cyan-400 rounded-md">
                                    {v}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Matches */}
            {matches.length > 0 && (
                <div className="text-sm font-mono text-emerald-400">
                    Matches at indices: [{matches.join(', ')}]
                </div>
            )}
        </div>
    );
};
