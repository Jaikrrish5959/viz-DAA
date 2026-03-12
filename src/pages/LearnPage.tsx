import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { allAlgorithms, categoryColors, categoryDescriptions } from '../data/algorithmData';

export const LearnPage = () => {
    const categories = [...new Set(allAlgorithms.map(a => a.category))];

    const paradigms = categories.map(cat => ({
        name: cat,
        ...categoryDescriptions[cat],
        algorithms: allAlgorithms.filter(a => a.category === cat),
        colors: categoryColors[cat] || categoryColors['Backtracking'],
    }));

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
            <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-500 text-sm font-medium mb-4">
                    <BookOpen size={14} />
                    Learning Guide
                </div>
                <h1 className="text-4xl font-outfit font-bold mb-3 text-app-text">Algorithm Paradigms</h1>
                <p className="text-app-text-muted max-w-xl mx-auto">
                    Understand the core techniques and know when to apply each paradigm to solve problems efficiently.
                </p>
            </div>

            <div className="space-y-6">
                {paradigms.map(({ name, tagline, description, whenToUse, algorithms, colors }) => (
                    <div key={name} className={`p-6 rounded-2xl border ${colors.border} ${colors.bg}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className={`text-2xl font-outfit font-bold ${colors.text} mb-1`}>{name}</h2>
                                <p className={`text-sm italic`} style={{ color: `${colors.hex}90` }}>{tagline}</p>
                            </div>
                            <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${colors.bg} ${colors.text} ${colors.border}`}>
                                {algorithms.length} algorithms
                            </span>
                        </div>

                        <p className="text-app-text-muted leading-relaxed mb-4">{description}</p>

                        <div className="bg-app-bg/50 rounded-xl p-4 mb-4 border border-app-border/50">
                            <h4 className="text-xs font-mono uppercase tracking-wider text-app-text-muted mb-2">When to Use</h4>
                            <p className="text-app-text text-sm hover:text-app-text">{whenToUse}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {algorithms.map(algo => (
                                <Link
                                    key={algo.id}
                                    to={`/visualizer/${algo.id}`}
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 bg-app-surface/50 ${colors.text} border border-app-border`}
                                >
                                    {algo.name}
                                    <ArrowRight size={12} />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
