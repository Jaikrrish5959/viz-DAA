import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, Clock, HardDrive } from 'lucide-react';
import { allAlgorithms, algorithmMeta, categoryColors, difficultyColors } from '../data/algorithmData';

export const LibraryPage = () => {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || '';
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    const categories = [...new Set(allAlgorithms.map(a => a.category))];

    const filtered = allAlgorithms.filter(algo => {
        const matchesSearch = algo.name.toLowerCase().includes(search.toLowerCase()) || algo.id.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !activeCategory || algo.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-outfit font-bold mb-2 text-app-text">Algorithm Library</h1>
                <p className="text-app-text-muted">Browse, search, and visualize {allAlgorithms.length} algorithms</p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-muted" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search algorithms..."
                        className="w-full pl-10 pr-4 py-2.5 bg-app-surface border border-app-border text-app-text rounded-xl text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveCategory('')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!activeCategory ? 'bg-primary-600/20 text-primary-500 border border-primary-500/30' : 'bg-app-surface/50 text-app-text-muted border border-app-border hover:text-app-text'}`}
                    >
                        All
                    </button>
                    {categories.map(cat => {
                        const colors = categoryColors[cat] || categoryColors['Backtracking'];
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${activeCategory === cat ? `${colors.bg} ${colors.text} ${colors.border}` : 'bg-app-surface/50 text-app-text-muted border-app-border hover:text-app-text'}`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Count */}
            <p className="text-app-text-muted text-sm mb-6">{filtered.length} algorithm{filtered.length !== 1 ? 's' : ''}</p>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(algo => {
                    const meta = algorithmMeta[algo.id];
                    const colors = categoryColors[algo.category] || categoryColors['Backtracking'];
                    const diffColors = meta ? difficultyColors[meta.difficulty] : '';
                    return (
                        <Link
                            key={algo.id}
                            to={`/visualizer/${algo.id}`}
                            className="group p-5 rounded-2xl bg-app-surface border border-app-border hover:border-primary-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary-900/10 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border ${colors.bg} ${colors.text} ${colors.border}`}>
                                    {algo.category}
                                </span>
                                {meta && (
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${diffColors}`}>
                                        {meta.difficulty}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-app-text font-outfit font-semibold text-lg mb-2 group-hover:text-primary-500 transition-colors">
                                {algo.name}
                            </h3>

                            <p className="text-app-text-muted text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                                {algo.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-[11px] font-mono text-app-text-muted">
                                    <span className="flex items-center gap-1"><Clock size={12} />{algo.complexity.time}</span>
                                    <span className="flex items-center gap-1"><HardDrive size={12} />{algo.complexity.space}</span>
                                </div>
                                <ArrowRight size={16} className="text-app-text-muted group-hover:text-primary-500 transition-colors" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
