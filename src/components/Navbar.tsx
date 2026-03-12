import { NavLink } from 'react-router-dom';
import { Activity, BookOpen, GitCompare, Info, LayoutGrid, Sun, Moon, Code2, Settings, X, Check } from 'lucide-react';
import { allAlgorithms } from '../data/algorithmData';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react'; // Added useState import
import { useAIStore } from '../state/aiStore'; // Added useAIStore import

export const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // API Key State
    const { apiKey, setApiKey } = useAIStore();
    const [tempKey, setTempKey] = useState(apiKey || '');
    const [keySaved, setKeySaved] = useState(false);

    const handleSaveKey = () => {
        setApiKey(tempKey.trim() || null);
        setKeySaved(true);
        setTimeout(() => setKeySaved(false), 2000);
    };

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

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2 bg-app-bg hover:bg-app-surface border border-transparent hover:border-app-border text-app-text-muted hover:text-app-text rounded-xl transition-all"
                        aria-label="Open settings"
                    >
                        <Settings size={20} />
                    </button>

                    <div className="ml-2 px-2.5 py-1 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-500 text-xs font-mono">
                        {allAlgorithms.length}
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-app-surface border border-app-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-app-border bg-[#0d0d0f]">
                            <h2 className="text-xl font-outfit font-bold text-app-text flex items-center gap-2">
                                <Settings className="text-primary-500" size={24} />
                                Platform Settings
                            </h2>
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="text-app-text-muted hover:text-app-text transition-colors p-2 hover:bg-app-bg rounded-lg"
                                aria-label="Close settings"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Theme block placeholder (if you want to add theme later) */}

                            {/* Gemini API Key */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-app-text font-medium">
                                    <Activity size={18} className="text-primary-500" />
                                    AI Algorithm Tutor
                                </div>
                                <p className="text-sm text-app-text-muted leading-relaxed">
                                    To use the interactive AI Tutor, please provide your Google Gemini API key. Your key is stored securely in your browser's local storage and is only sent directly to Google's API.
                                </p>

                                <div className="space-y-2 mt-4">
                                    <label htmlFor="gemini-api-key" className="text-xs text-app-text-muted uppercase tracking-wider font-semibold">Gemini API Key</label>
                                    <input
                                        id="gemini-api-key"
                                        type="password"
                                        value={tempKey}
                                        onChange={(e) => setTempKey(e.target.value)}
                                        placeholder="AIzaSy..."
                                        className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm text-app-text outline-none focus:border-primary-500 transition-colors"
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <a
                                        href="https://aistudio.google.com/app/apikey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary-400 hover:text-primary-300 underline underline-offset-2 flex items-center gap-1"
                                    >
                                        Get an API key here
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-app-border bg-[#0d0d0f] flex justify-end">
                            <button
                                onClick={handleSaveKey}
                                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-primary-500/20 flex items-center gap-2"
                            >
                                {keySaved ? <><Check size={16} /> Saved!</> : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
