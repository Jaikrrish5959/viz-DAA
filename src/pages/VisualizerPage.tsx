import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useExecutionStore } from '../state/executionStore';
import { allAlgorithms, algorithmMeta, categoryColors, difficultyColors } from '../data/algorithmData';
import { generateRandomMazeString } from '../algorithms/backtracking/ratMaze';
// Visualizers
import { BacktrackingBoard } from '../visualizers/BacktrackingBoard';
import { CombinationBoard } from '../visualizers/CombinationBoard';
import { DpTableBoard } from '../visualizers/DpTableBoard';
import { ArrayVisualizer } from '../visualizers/ArrayVisualizer';
import { GraphVisualizer } from '../visualizers/GraphVisualizer';
import { StringVisualizer } from '../visualizers/StringVisualizer';
// Components
import { ControlPanel } from '../components/ControlPanel';
import { SolutionsModal } from '../components/SolutionsModal';
import { AITutorPanel } from '../components/AITutorPanel';
import { Activity, ArrowLeft, Clock, HardDrive, Lightbulb, AlertTriangle, Globe, ChevronRight, Eye } from 'lucide-react';

// Algorithms that can produce multiple solutions
const MULTI_SOLUTION_IDS = new Set([
    'n-queens', 'rat-maze', 'sudoku', 'graph-coloring', 'hamiltonian',
    'combination-sum', 'permutations', 'subsets', 'subset-sum',
]);

export const VisualizerPage = () => {
    const { id } = useParams<{ id: string }>();
    const { algorithm, states, currentStepIndex, isPlaying, nextStep, speedMs, setAlgorithm, solutions } = useExecutionStore();

    const [inputValues, setInputValues] = useState<Record<string, any>>({});
    const [showSolutions, setShowSolutions] = useState(false);

    const algoModule = allAlgorithms.find(a => a.id === id);
    const meta = id ? algorithmMeta[id] : undefined;
    const colors = algoModule ? (categoryColors[algoModule.category] || categoryColors['Backtracking']) : null;
    const accent = colors?.hex || '#8B5CF6';

    useEffect(() => {
        if (algoModule?.inputConfig) {
            const defaults: Record<string, any> = {};
            algoModule.inputConfig.forEach(def => {
                if (algoModule.id === 'rat-maze' && def.name === 'mazeStr') {
                    defaults[def.name] = generateRandomMazeString(5);
                } else {
                    defaults[def.name] = def.defaultValue;
                }
            });
            setInputValues(defaults);
        }
    }, [algoModule?.id]);

    useEffect(() => {
        let interval: number | null = null;
        if (isPlaying) {
            interval = window.setInterval(() => nextStep(), speedMs);
        }
        return () => { if (interval !== null) clearInterval(interval); };
    }, [isPlaying, speedMs, nextStep]);

    if (!algoModule) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-outfit font-bold mb-4 text-app-text">Algorithm Not Found</h1>
                <p className="text-app-text-muted mb-6">The algorithm "{id}" does not exist.</p>
                <Link to="/algorithms" className="text-primary-500 hover:underline">← Back to Library</Link>
            </div>
        );
    }

    const handleExecute = () => setAlgorithm(algoModule, inputValues);

    const handleInputChange = (name: string, value: any) => {
        setInputValues(prev => ({ ...prev, [name]: value }));
    };

    const currentState = states[currentStepIndex];

    const renderVisualizer = () => {
        if (!algorithm || !currentState) {
            return (
                <div className="text-app-text-muted font-outfit text-lg flex flex-col items-center">
                    <Activity size={40} className="mb-3" style={{ color: `${accent}40` }} />
                    Click Run to start visualization
                </div>
            );
        }
        const cat = algorithm.category;
        const aid = algorithm.id;
        if (cat === 'Sorting') return <ArrayVisualizer state={currentState} />;
        if (cat === 'Dynamic Programming' || aid === 'floyd-warshall') return <DpTableBoard state={currentState} />;
        if (cat === 'Graph Algorithms') return <GraphVisualizer state={currentState} />;
        if (cat === 'String Matching') return <StringVisualizer state={currentState} />;
        if (aid === 'combination-sum' || aid === 'permutations' || aid === 'subsets' || aid === 'subset-sum') return <CombinationBoard state={currentState} />;
        if (cat === 'Branch and Bound') return <CombinationBoard state={currentState} />;
        if (cat === 'Greedy') return <ArrayVisualizer state={currentState} />;
        if (cat === 'Data Structures') return <ArrayVisualizer state={currentState} />;
        if (cat === 'Divide and Conquer') {
            if (aid === 'closest-pair' || aid === 'convex-hull') return <GraphVisualizer state={currentState} />;
            return <ArrayVisualizer state={currentState} />;
        }
        if (aid === 'n-queens' || aid === 'rat-maze' || aid === 'sudoku' || aid === 'graph-coloring' || aid === 'hamiltonian') {
            return <BacktrackingBoard state={currentState} n={currentState?.board?.length || 8} />;
        }
        return null;
    };

    const activePseudocodeLine = currentState?.recursion_depth ?? -1;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Category accent glow at top */}
            <div className="absolute top-16 left-0 right-0 h-64 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${accent}10, transparent)` }} />

            {/* Breadcrumb */}
            <div className="relative flex items-center gap-2 text-sm text-app-text-muted mb-6">
                <Link to="/algorithms" className="hover:text-app-text transition-colors flex items-center gap-1">
                    <ArrowLeft size={14} /> Library
                </Link>
                <ChevronRight size={14} />
                <span style={{ color: accent }}>{algoModule.category}</span>
                <ChevronRight size={14} />
                <span className="text-app-text">{algoModule.name}</span>
            </div>

            {/* Header */}
            <div className="relative flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                        <h1 className="text-3xl md:text-4xl font-outfit font-bold text-app-text">{algoModule.name}</h1>
                        {colors && (
                            <span className="text-xs font-mono px-2.5 py-1 rounded-lg border" style={{ color: accent, borderColor: `${accent}30`, background: `${accent}10` }}>
                                {algoModule.category}
                            </span>
                        )}
                        {meta && (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${difficultyColors[meta.difficulty]}`}>
                                {meta.difficulty}
                            </span>
                        )}
                    </div>
                    <p className="text-app-text-muted leading-relaxed mb-4">{algoModule.description}</p>
                    <div className="flex items-center gap-4 text-sm font-mono text-app-text-muted">
                        <span className="flex items-center gap-1.5"><Clock size={14} /> Time: {algoModule.complexity.time}</span>
                        <span className="flex items-center gap-1.5"><HardDrive size={14} /> Space: {algoModule.complexity.space}</span>
                    </div>
                </div>
            </div>

            <div className="relative flex flex-col lg:flex-row gap-6">
                {/* Left Panel */}
                <div className="lg:w-[340px] flex flex-col gap-5 shrink-0">
                    {/* Input Config */}
                    <div className="bg-app-surface p-5 rounded-2xl border border-app-border">
                        <h3 className="font-outfit font-medium text-app-text mb-4">Input Configuration</h3>
                        {algoModule.inputConfig?.map(config => (
                            <div key={config.name} className="mb-3">
                                <label className="text-xs font-mono text-app-text-muted block mb-1">{config.label}</label>
                                {config.type === 'number' ? (
                                    <input
                                        type="number"
                                        value={inputValues[config.name] ?? config.defaultValue}
                                        min={config.min}
                                        max={config.max}
                                        onChange={e => handleInputChange(config.name, Number(e.target.value))}
                                        className="w-full px-3 py-2 bg-app-bg border border-app-border rounded-lg text-sm text-app-text"
                                        style={{ outlineColor: accent }}
                                    />
                                ) : (
                                    <textarea
                                        value={inputValues[config.name] ?? config.defaultValue}
                                        onChange={e => handleInputChange(config.name, e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 bg-app-bg border border-app-border rounded-lg text-sm text-app-text font-mono resize-none"
                                        style={{ outlineColor: accent }}
                                    />
                                )}
                            </div>
                        ))}
                        <button
                            onClick={handleExecute}
                            className="w-full mt-2 px-4 py-2.5 text-white font-semibold rounded-xl transition-all text-sm hover:opacity-90 shadow-sm"
                            style={{ background: accent }}
                        >
                            ▶ Run Algorithm
                        </button>
                        {MULTI_SOLUTION_IDS.has(algoModule.id) && solutions.length > 0 && (
                            <button
                                onClick={() => setShowSolutions(true)}
                                className="w-full mt-2 px-4 py-2.5 font-semibold rounded-xl transition-all text-sm border-2 hover:opacity-90 flex items-center justify-center gap-2"
                                style={{ color: accent, borderColor: accent, background: `${accent}10` }}
                            >
                                <Eye size={16} />
                                View All Solutions ({solutions.length})
                            </button>
                        )}
                    </div>

                    {/* Pseudocode */}
                    <div className="bg-app-surface p-5 rounded-2xl border border-app-border">
                        <h3 className="font-outfit font-medium text-app-text mb-3">Pseudocode</h3>
                        <div className="bg-app-bg rounded-lg border border-app-border p-3 font-mono text-xs">
                            {algoModule.pseudocode.map((line, i) => (
                                <div
                                    key={i}
                                    className="py-0.5 px-2 rounded transition-colors"
                                    style={i === activePseudocodeLine ? { background: `${accent}15`, color: accent } : { color: 'var(--app-text-muted)' }}
                                >
                                    <span style={{ paddingLeft: `${(line.match(/^\s*/)?.[0].length || 0) * 8}px` }}>
                                        {line.trim()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Info */}
                    {currentState && (
                        <div className="bg-app-surface p-5 rounded-2xl border border-app-border">
                            <h3 className="font-outfit font-medium text-app-text mb-3">Execution State</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-app-text-muted">
                                    <span>Step</span>
                                    <span className="font-mono text-app-text">{currentStepIndex + 1} / {states.length}</span>
                                </div>
                                <div className="flex justify-between text-app-text-muted">
                                    <span>Action</span>
                                    <span className="font-mono" style={{ color: accent }}>{currentState.action_type}</span>
                                </div>
                                <div className="flex justify-between text-app-text-muted">
                                    <span>Depth</span>
                                    <span className="font-mono text-app-text">{currentState.recursion_depth}</span>
                                </div>
                                <div className="w-full bg-app-border rounded-full h-1.5 mt-2">
                                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${states.length > 0 ? ((currentStepIndex + 1) / states.length) * 100 : 0}%`, background: accent }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Visualization */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 rounded-3xl bg-app-surface relative overflow-hidden flex flex-col shadow-xl" style={{ border: `1px solid ${accent}15` }}>
                        <div className="h-12 border-b px-5 flex items-center justify-between" style={{ borderColor: `${accent}10`, background: `${accent}05` }}>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${accent}60` }} />
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${accent}30` }} />
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${accent}15` }} />
                            </div>
                            <span className="text-xs font-mono" style={{ color: `${accent}80` }}>{algoModule.id} visualization</span>
                        </div>
                        <div className="flex-1 p-6 md:p-8 flex items-center justify-center overflow-auto min-h-[350px]">
                            {renderVisualizer()}
                        </div>
                    </div>
                    <ControlPanel />
                </div>
            </div>

            {/* Bottom Info Panels */}
            {meta && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {meta.applications.length > 0 && (
                        <div className="bg-app-surface p-5 rounded-2xl border border-app-border">
                            <h4 className="flex items-center gap-2 font-outfit font-medium text-app-text mb-3">
                                <Globe size={16} style={{ color: accent }} /> Real-World Applications
                            </h4>
                            <ul className="space-y-1.5">
                                {meta.applications.map((app, i) => (
                                    <li key={i} className="text-sm text-app-text-muted flex items-start gap-2">
                                        <span style={{ color: accent }} className="mt-1">•</span> {app}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {meta.commonMistakes && meta.commonMistakes.length > 0 && (
                        <div className="bg-app-surface p-5 rounded-2xl border border-app-border">
                            <h4 className="flex items-center gap-2 font-outfit font-medium text-app-text mb-3">
                                <AlertTriangle size={16} className="text-amber-500" /> Common Mistakes
                            </h4>
                            <ul className="space-y-1.5">
                                {meta.commonMistakes.map((mistake, i) => (
                                    <li key={i} className="text-sm text-app-text-muted flex items-start gap-2">
                                        <span className="text-amber-500 mt-1">•</span> {mistake}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="bg-app-surface p-5 rounded-2xl border border-app-border">
                        <h4 className="flex items-center gap-2 font-outfit font-medium text-app-text mb-3">
                            <Lightbulb size={16} style={{ color: accent }} /> Complexity Analysis
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-app-text-muted">Time</span>
                                <span className="font-mono" style={{ color: accent }}>{algoModule.complexity.time}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-app-text-muted">Space</span>
                                <span className="font-mono" style={{ color: accent }}>{algoModule.complexity.space}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-app-text-muted">Difficulty</span>
                                <span className={`font-mono ${difficultyColors[meta?.difficulty || 'Medium'].split(' ')[0]}`}>{meta?.difficulty || 'Medium'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Solutions Modal */}
            <SolutionsModal
                isOpen={showSolutions}
                onClose={() => setShowSolutions(false)}
                n={currentState?.board?.length || 8}
            />

            {/* AI Tutor Panel Floatiing Widget */}
            <AITutorPanel />
        </div>
    );
};
