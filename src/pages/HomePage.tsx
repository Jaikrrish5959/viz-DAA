import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, BarChart3, Zap, GitCompare, Code2 } from 'lucide-react';
import { allAlgorithms, categoryColors, categoryDescriptions } from '../data/algorithmData';

export const HomePage = () => {
    const categories = Object.entries(
        allAlgorithms.reduce((acc, algo) => {
            acc[algo.category] = (acc[algo.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    );

    const stats = [
        { label: 'Algorithms', value: allAlgorithms.length, icon: Code2, color: '#A78BFA' },
        { label: 'Categories', value: categories.length, icon: GitCompare, color: '#22D3EE' },
        { label: 'Visualizers', value: 6, icon: BarChart3, color: '#34D399' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero — multi-color gradient */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/15 via-blue-900/10 to-emerald-900/10" />
                <div className="absolute top-10 left-[15%] w-80 h-80 rounded-full blur-[120px]" style={{ background: 'rgba(167,139,250,0.08)' }} />
                <div className="absolute top-20 right-[20%] w-64 h-64 rounded-full blur-[100px]" style={{ background: 'rgba(34,211,238,0.06)' }} />
                <div className="absolute bottom-0 left-[40%] w-72 h-72 rounded-full blur-[100px]" style={{ background: 'rgba(52,211,153,0.06)' }} />

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-app-text/5 border border-app-text/10 text-app-text-muted text-sm font-medium mb-8">
                        <Sparkles size={14} className="text-amber-400" />
                        Interactive Algorithm Learning Platform
                    </div>

                    <h1 className="text-5xl md:text-7xl font-outfit font-bold tracking-tight mb-6">
                        Design & Analysis of
                        <br />
                        <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                            Algorithms
                        </span>
                    </h1>

                    <p className="text-app-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Visualize, understand, and master {allAlgorithms.length} algorithms across {categories.length} categories.
                        Watch them execute step by step with interactive controls.
                    </p>

                    <div className="flex items-center gap-4 justify-center mb-16">
                        <Link to="/algorithms" className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg" style={{ background: 'linear-gradient(135deg, #7C3AED, #2563EB)', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
                            Start Exploring
                            <ArrowRight size={18} />
                        </Link>
                        <Link to="/learn" className="inline-flex items-center gap-2 px-6 py-3 bg-app-surface hover:bg-app-border border border-app-border text-app-text-muted hover:text-app-text font-medium rounded-xl transition-all duration-200">
                            <BookOpen size={18} />
                            Learning Guide
                        </Link>
                    </div>

                    {/* Stats — each with its own color */}
                    <div className="flex justify-center gap-8 md:gap-16">
                        {stats.map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Icon size={18} style={{ color }} />
                                    <span className="text-3xl md:text-4xl font-outfit font-bold text-app-text">{value}</span>
                                </div>
                                <span className="text-app-text-muted text-sm">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories — each card uses its own color */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
                <h2 className="text-3xl font-outfit font-bold mb-2 text-center text-app-text">Algorithm Categories</h2>
                <p className="text-app-text-muted text-center mb-12">Explore algorithms organized by paradigm and technique</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map(([category, count]) => {
                        const colors = categoryColors[category] || categoryColors['Backtracking'];
                        const desc = categoryDescriptions[category];
                        return (
                            <Link
                                key={category}
                                to={`/algorithms?category=${encodeURIComponent(category)}`}
                                className="group p-6 rounded-2xl border bg-app-surface transition-all duration-200 hover:scale-[1.02]"
                                style={{
                                    borderColor: `${colors.hex}20`,
                                    background: `linear-gradient(135deg, ${colors.hex}08, ${colors.hex}03)`,
                                }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-2xl">{colors.icon}</span>
                                    <span className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: colors.hex }}>
                                        {count} algos
                                    </span>
                                </div>
                                <h3 className="text-app-text font-outfit font-semibold text-lg mb-1">{category}</h3>
                                <p className="text-app-text-muted text-sm leading-relaxed">
                                    {desc?.tagline || 'Explore and visualize'}
                                </p>
                                <div className="mt-3 flex items-center gap-1 text-xs font-medium transition-opacity opacity-0 group-hover:opacity-100" style={{ color: colors.hex }}>
                                    Explore <ArrowRight size={12} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* CTA — multi-color accent */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
                <div className="relative overflow-hidden rounded-3xl border border-app-border p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(34,211,238,0.05), rgba(52,211,153,0.05))' }}>
                    <Zap size={48} className="text-amber-400/30 mx-auto mb-6" />
                    <h2 className="text-3xl font-outfit font-bold mb-4 text-app-text">Ready to Dive In?</h2>
                    <p className="text-app-text-muted max-w-lg mx-auto mb-8">
                        Choose any algorithm and watch it come to life with step-by-step visualization and interactive controls.
                    </p>
                    <Link to="/algorithms" className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl transition-all" style={{ background: 'linear-gradient(135deg, #7C3AED, #2563EB)' }}>
                        Browse All {allAlgorithms.length} Algorithms
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
};
