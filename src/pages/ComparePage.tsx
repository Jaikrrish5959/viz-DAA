import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, ArrowRight, Clock, HardDrive } from 'lucide-react';
import { allAlgorithms, algorithmMeta, categoryColors, difficultyColors } from '../data/algorithmData';

export const ComparePage = () => {
    const [algoA, setAlgoA] = useState('');
    const [algoB, setAlgoB] = useState('');

    const a = allAlgorithms.find(x => x.id === algoA);
    const b = allAlgorithms.find(x => x.id === algoB);
    const metaA = algoA ? algorithmMeta[algoA] : undefined;
    const metaB = algoB ? algorithmMeta[algoB] : undefined;

    const presets = [
        ['merge-sort', 'quick-sort'],
        ['bfs', 'dfs'],
        ['dijkstra', 'bellman-ford'],
        ['prim', 'kruskal'],
        ['knapsack01', 'bnb-knapsack'],
        ['bubble-sort', 'heap-sort'],
        ['kmp', 'rabin-karp'],
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
            <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-500 text-sm font-medium mb-4">
                    <GitCompare size={14} />
                    Compare Algorithms
                </div>
                <h1 className="text-4xl font-outfit font-bold mb-3 text-app-text">Side-by-Side Comparison</h1>
                <p className="text-app-text-muted">Select two algorithms to compare their complexity, approach, and use cases</p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
                {presets.map(([pa, pb]) => (
                    <button
                        key={`${pa}-${pb}`}
                        onClick={() => { setAlgoA(pa); setAlgoB(pb); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${algoA === pa && algoB === pb
                            ? 'bg-primary-600/20 text-primary-500 border-primary-500/30'
                            : 'bg-app-surface/50 text-app-text-muted border-app-border hover:text-app-text'
                            }`}
                    >
                        {allAlgorithms.find(x => x.id === pa)?.name} vs {allAlgorithms.find(x => x.id === pb)?.name}
                    </button>
                ))}
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <select
                    value={algoA}
                    onChange={e => setAlgoA(e.target.value)}
                    className="w-full px-4 py-3 bg-app-surface border border-app-border text-app-text rounded-xl text-sm focus:ring-2 focus:ring-primary-500/50"
                >
                    <option value="">Select Algorithm A</option>
                    {allAlgorithms.map(algo => (
                        <option key={algo.id} value={algo.id}>{algo.name} ({algo.category})</option>
                    ))}
                </select>
                <select
                    value={algoB}
                    onChange={e => setAlgoB(e.target.value)}
                    className="w-full px-4 py-3 bg-app-surface border border-app-border text-app-text rounded-xl text-sm focus:ring-2 focus:ring-primary-500/50"
                >
                    <option value="">Select Algorithm B</option>
                    {allAlgorithms.map(algo => (
                        <option key={algo.id} value={algo.id}>{algo.name} ({algo.category})</option>
                    ))}
                </select>
            </div>

            {/* Comparison Table */}
            {a && b && (
                <div className="bg-app-surface rounded-2xl border border-app-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-app-border">
                                <th className="text-left text-app-text-muted px-6 py-4 font-normal">Property</th>
                                <th className="text-left px-6 py-4">
                                    <span className="font-outfit font-semibold text-app-text">{a.name}</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="font-outfit font-semibold text-app-text">{b.name}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-app-border/50">
                            <tr>
                                <td className="px-6 py-3 text-app-text-muted">Category</td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${categoryColors[a.category]?.bg} ${categoryColors[a.category]?.text} ${categoryColors[a.category]?.border}`}>{a.category}</span>
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${categoryColors[b.category]?.bg} ${categoryColors[b.category]?.text} ${categoryColors[b.category]?.border}`}>{b.category}</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 text-app-text-muted">Difficulty</td>
                                <td className="px-6 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded border ${metaA ? difficultyColors[metaA.difficulty] : ''}`}>{metaA?.difficulty || '—'}</span></td>
                                <td className="px-6 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded border ${metaB ? difficultyColors[metaB.difficulty] : ''}`}>{metaB?.difficulty || '—'}</span></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 text-app-text-muted"><Clock size={14} className="inline mr-1" />Time</td>
                                <td className="px-6 py-3 font-mono text-amber-500">{a.complexity.time}</td>
                                <td className="px-6 py-3 font-mono text-amber-500">{b.complexity.time}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 text-app-text-muted"><HardDrive size={14} className="inline mr-1" />Space</td>
                                <td className="px-6 py-3 font-mono text-cyan-500">{a.complexity.space}</td>
                                <td className="px-6 py-3 font-mono text-cyan-500">{b.complexity.space}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 text-app-text-muted">Description</td>
                                <td className="px-6 py-3 text-app-text-muted text-xs leading-relaxed">{a.description}</td>
                                <td className="px-6 py-3 text-app-text-muted text-xs leading-relaxed">{b.description}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 text-app-text-muted">Applications</td>
                                <td className="px-6 py-3 text-xs text-app-text-muted">{metaA?.applications.join(', ') || '—'}</td>
                                <td className="px-6 py-3 text-xs text-app-text-muted">{metaB?.applications.join(', ') || '—'}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex gap-4 p-6 border-t border-app-border">
                        <Link to={`/visualizer/${a.id}`} className="flex-1 text-center py-2.5 bg-primary-600/10 hover:bg-primary-600/20 text-primary-500 rounded-xl text-sm font-medium transition-colors border border-primary-500/20">
                            Visualize {a.name} <ArrowRight size={14} className="inline" />
                        </Link>
                        <Link to={`/visualizer/${b.id}`} className="flex-1 text-center py-2.5 bg-primary-600/10 hover:bg-primary-600/20 text-primary-500 rounded-xl text-sm font-medium transition-colors border border-primary-500/20">
                            Visualize {b.name} <ArrowRight size={14} className="inline" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};
