import React from 'react';
import { useExecutionStore } from '../state/executionStore';
import { BacktrackingBoard } from '../visualizers/BacktrackingBoard';
import { CombinationBoard } from '../visualizers/CombinationBoard';
import { X } from 'lucide-react';

interface SolutionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    n: number;
}

export const SolutionsModal: React.FC<SolutionsModalProps> = ({ isOpen, onClose, n }) => {
    const { solutions, algorithm } = useExecutionStore();

    if (!isOpen || solutions.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-app-surface border border-app-border rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-app-border">
                    <div>
                        <h2 className="text-2xl font-outfit font-semibold text-white">Discovered Solutions</h2>
                        <p className="text-gray-400 mt-1">Found {solutions.length} solutions for {algorithm?.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solutions.map((sol, idx) => (
                        <div key={idx} className="bg-[#0d0d0f] rounded-xl p-4 border border-gray-800 flex flex-col items-center">
                            <h4 className="text-gray-400 font-medium mb-3">Solution {idx + 1}</h4>
                            <div className="w-full transform scale-75 origin-top">
                                {(algorithm?.id === 'n-queens' || algorithm?.id === 'rat-maze') ? (
                                    <BacktrackingBoard state={sol} n={n} />
                                ) : algorithm?.id === 'combination-sum' ? (
                                    <CombinationBoard state={sol} />
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
