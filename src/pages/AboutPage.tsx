import { Activity, Code2, BookOpen, BarChart3, Layers, Zap } from 'lucide-react';

export const AboutPage = () => {
    const techStack = [
        { name: 'React 19', desc: 'UI framework with hooks' },
        { name: 'TypeScript', desc: 'Type-safe development' },
        { name: 'Zustand', desc: 'Lightweight state management' },
        { name: 'Tailwind CSS 4', desc: 'Utility-first styling' },
        { name: 'Framer Motion', desc: 'Smooth animations' },
        { name: 'Vite 8', desc: 'Lightning-fast builds' },
        { name: 'React Router', desc: 'Client-side routing' },
    ];

    const architecture = [
        { icon: Code2, title: 'Generator Engine', desc: 'Each algorithm is a generator function that yields ExecutionState objects, pausing at every key step for visualization.' },
        { icon: Layers, title: 'Pluggable Visualizers', desc: '6 visualizer components (Array, Graph, String, DP Table, Backtracking Board, Combination Board) auto-route based on algorithm category.' },
        { icon: BarChart3, title: 'Timeline Playback', desc: 'Zustand-powered timeline lets you play, pause, step forward/backward through execution states at any speed.' },
        { icon: Zap, title: 'Zero-Config Modules', desc: 'Each algorithm module declares its inputs, pseudocode, complexity, and generator — everything auto-wires into the platform.' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
                        <Activity className="text-primary-500" size={28} />
                    </div>
                </div>
                <h1 className="text-4xl font-outfit font-bold mb-3 text-app-text">About DAA Visualizer</h1>
                <p className="text-app-text-muted max-w-xl mx-auto leading-relaxed">
                    An interactive learning platform for Design and Analysis of Algorithms.
                    Visualize 39 algorithms across 7 categories with step-by-step execution, interactive controls, and educational annotations.
                </p>
            </div>

            {/* Goals */}
            <div className="bg-app-surface p-6 rounded-2xl border border-app-border mb-8">
                <h2 className="text-xl font-outfit font-semibold mb-4 flex items-center gap-2 text-app-text">
                    <BookOpen size={20} className="text-primary-500" />
                    Educational Goals
                </h2>
                <ul className="space-y-2 text-app-text-muted text-sm">
                    <li className="flex items-start gap-2"><span className="text-primary-500 mt-0.5">•</span> Make abstract algorithms tangible through real-time visualization</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500 mt-0.5">•</span> Support multiple learning styles: visual, interactive, and reference-based</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500 mt-0.5">•</span> Provide context: real-world applications, common mistakes, complexity analysis</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500 mt-0.5">•</span> Enable comparison between alternative approaches to the same class of problems</li>
                </ul>
            </div>

            {/* Architecture */}
            <h2 className="text-xl font-outfit font-semibold mb-4 text-app-text">Platform Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {architecture.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="bg-app-surface p-5 rounded-2xl border border-app-border">
                        <Icon size={20} className="text-primary-500 mb-3" />
                        <h3 className="font-outfit font-medium text-app-text mb-2">{title}</h3>
                        <p className="text-app-text-muted text-sm leading-relaxed">{desc}</p>
                    </div>
                ))}
            </div>

            {/* Tech Stack */}
            <h2 className="text-xl font-outfit font-semibold mb-4 text-app-text">Technology Stack</h2>
            <div className="bg-app-surface rounded-2xl border border-app-border overflow-hidden mb-8">
                <div className="divide-y divide-app-border/50">
                    {techStack.map(({ name, desc }) => (
                        <div key={name} className="flex items-center justify-between px-6 py-3">
                            <span className="font-mono text-sm text-app-text">{name}</span>
                            <span className="text-xs text-app-text-muted">{desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center text-app-text-muted text-sm border-t border-app-border pt-8 mt-12">
                Built with ❤️ for algorithm enthusiasts and CS students
            </div>
        </div>
    );
};
