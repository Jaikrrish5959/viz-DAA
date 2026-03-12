import React from 'react';
import { useExecutionStore } from '../state/executionStore';
import { BacktrackingBoard } from '../visualizers/BacktrackingBoard';
import { CombinationBoard } from '../visualizers/CombinationBoard';
import { DpTableBoard } from '../visualizers/DpTableBoard';
import { ArrayVisualizer } from '../visualizers/ArrayVisualizer';
import { GraphVisualizer } from '../visualizers/GraphVisualizer';
import { StringVisualizer } from '../visualizers/StringVisualizer';
import { X } from 'lucide-react';

interface SolutionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    n: number;
}

export const SolutionsModal: React.FC<SolutionsModalProps> = ({ isOpen, onClose, n }) => {
    const { solutions, algorithm } = useExecutionStore();

    if (!isOpen || solutions.length === 0) return null;

    const renderSolution = (sol: any) => {
        if (!algorithm) return null;
        const cat = algorithm.category;
        const id = algorithm.id;
        if (cat === 'Sorting' || cat === 'Greedy' || cat === 'Data Structures' || cat === 'Divide and Conquer') return <ArrayVisualizer state={sol} />;
        if (cat === 'Dynamic Programming') return <DpTableBoard state={sol} />;
        if (cat === 'Graph Algorithms') return <GraphVisualizer state={sol} />;
        if (cat === 'String Matching') return <StringVisualizer state={sol} />;
        if (id === 'combination-sum' || id === 'permutations' || id === 'subsets' || id === 'subset-sum' || cat === 'Branch and Bound') return <CombinationBoard state={sol} />;
        if (id === 'n-queens' || id === 'rat-maze' || id === 'sudoku' || id === 'graph-coloring' || id === 'hamiltonian') return <BacktrackingBoard state={sol} n={n} />;
        return null;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-app-surface border border-app-border rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-app-border">
                    <div>
                        <h2 className="text-2xl font-outfit font-semibold text-app-text">Discovered Solutions</h2>
                        <p className="text-app-text-muted mt-1">Found {solutions.length} solutions for {algorithm?.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-app-bg hover:bg-app-border rounded-full text-app-text-muted transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solutions.map((sol, idx) => (
                        <div key={idx} className="bg-app-bg rounded-xl p-4 border border-app-border flex flex-col items-center">
                            <h4 className="text-app-text-muted font-medium mb-3">Solution {idx + 1}</h4>
                            <div className="w-full transform scale-75 origin-top">
                                {renderSolution(sol)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
