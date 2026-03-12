import { NavLink } from 'react-router-dom';
import { Activity, BookOpen, GitCompare, Info, LayoutGrid, Sun, Moon, Code2 } from 'lucide-react';
import { allAlgorithms } from '../data/algorithmData';
import { useTheme } from '../hooks/useTheme';

export const Navbar = () => {
    const { theme, toggleTheme } = useTheme();

    const links = [
        { to: '/', label: 'Home', icon: Activity },
        { to: '/algorithms', label: 'Algorithms', icon: LayoutGrid },
        { to: '/learn', label: 'Learn', icon: BookOpen },
        { to: '/source-code', label: 'Code', icon: Code2 },
        { to: '/compare', label: 'Compare', icon: GitCompare },
        { to: '/about', label: 'About', icon: Info },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-app-bg/80 backdrop-blur-xl border-b border-app-border transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                <NavLink to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center group-hover:bg-primary-600/30 transition-colors">
                        <Activity className="text-primary-500" size={18} />
                    </div>
                    <span className="font-outfit font-semibold text-lg tracking-tight text-app-text">
                        DAA<span className="text-app-text-muted mx-1">|</span><span className="text-primary-400">Visualizer</span>
                    </span>
                </NavLink>

                <div className="flex items-center gap-1">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-primary-600/15 text-primary-500 border border-primary-500/20'
                                    : 'text-app-text-muted hover:text-app-text hover:bg-app-surface'
                                }`
                            }
                        >
                            <Icon size={16} />
                            <span className="hidden sm:inline">{label}</span>
                        </NavLink>
                    ))}

                    <div className="w-px h-6 bg-app-border mx-2 hidden sm:block"></div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 ml-1 rounded-lg text-app-text-muted hover:text-app-text hover:bg-app-surface transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <div className="ml-2 px-2.5 py-1 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-500 text-xs font-mono">
                        {allAlgorithms.length}
                    </div>
                </div>
            </div>
        </nav>
    );
};
