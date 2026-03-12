import React from 'react';
import { useExecutionStore } from '../state/executionStore';
import type { AlgorithmModule } from '../types';

interface AlgorithmSelectorProps {
    algorithms: AlgorithmModule[];
    selectedId: string;
    onSelect: (id: string) => void;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ algorithms, selectedId, onSelect }) => {
    const { isPlaying } = useExecutionStore();

    // Group algorithms by category
    const groupedAlgorithms = algorithms.reduce((acc, algo) => {
        if (!acc[algo.category]) acc[algo.category] = [];
        acc[algo.category].push(algo);
        return acc;
    }, {} as Record<string, AlgorithmModule[]>);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(e.target.value);
    };

    const algorithm = algorithms.find(a => a.id === selectedId);

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-app-surface p-4 rounded-2xl border border-app-border">
            <div className="flex-1">
                <label htmlFor="algo-select" className="block text-sm font-medium text-gray-400 mb-1">
                    Select Algorithm
                </label>
                <select
                    id="algo-select"
                    value={selectedId}
                    onChange={handleSelect}
                    disabled={isPlaying}
                    className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 transition-colors disabled:opacity-50"
                >
                    <option value="" disabled>Choose an algorithm...</option>
                    {Object.entries(groupedAlgorithms).map(([category, algos]) => (
                        <optgroup key={category} label={category}>
                            {algos.map((algo) => (
                                <option key={algo.id} value={algo.id}>
                                    {algo.name}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>

            {algorithm && (
                <div className="flex-1 flex gap-4 text-sm mt-4 sm:mt-0">
                    <div className="bg-gray-800/50 rounded-lg p-3 flex-1 border border-gray-700/50 overflow-hidden">
                        <span className="text-gray-500 text-xs block uppercase tracking-wider mb-1">Time</span>
                        <span className="text-primary-400 font-mono font-medium text-xs">{algorithm.complexity.time}</span>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 flex-1 border border-gray-700/50 overflow-hidden">
                        <span className="text-gray-500 text-xs block uppercase tracking-wider mb-1">Space</span>
                        <span className="text-primary-400 font-mono font-medium text-xs">{algorithm.complexity.space}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
