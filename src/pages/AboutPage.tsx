import { Activity, Code2, BookOpen, BarChart3, Layers, Zap, Github, Linkedin, Mail, GraduationCap, Code } from 'lucide-react';

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
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-12">
            {/* Developer Profile Header */}
            <div className="bg-app-surface p-8 rounded-3xl border border-app-border flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/5 blur-3xl rounded-full pointer-events-none"></div>
                <div className="shrink-0 relative">
                    <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full"></div>
                    <img
                        src="https://github.com/Jaikrrish5959.png"
                        alt="Jaikrrish S"
                        className="w-40 h-40 rounded-full object-cover border-4 border-app-surface shadow-2xl relative z-10"
                    />
                </div>
                <div className="flex-1 text-center md:text-left relative z-10">
                    <h1 className="text-4xl font-outfit font-bold text-app-text mb-2">Jaikrrish S</h1>
                    <p className="text-primary-400 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                        <GraduationCap size={18} />
                        B.Tech CSE @ Amrita Vishwa Vidyapeetham (2024 - 2028)
                    </p>
                    <p className="text-app-text-muted mb-6 max-w-2xl leading-relaxed text-sm sm:text-base">
                        Creator of DAA Visualizer. I'm passionate about algorithms, semantic robotics, AIoT systems, and building interactive software. I actively research malware analysis and develop autonomous robotics systems integrating ROS2, Gazebo, and ontology-driven knowledge models.
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <a href="https://github.com/Jaikrrish5959" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-app-bg hover:bg-app-border border border-app-border rounded-xl text-app-text hover:text-white transition-colors cursor-pointer group">
                            <Github size={20} className="group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://linkedin.com/in/jaikrrish-s" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-app-bg hover:bg-app-border border border-app-border rounded-xl text-app-text hover:text-[#0a66c2] transition-colors cursor-pointer group">
                            <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="mailto:jaikrrish5959@gmail.com" className="p-2.5 bg-app-bg hover:bg-app-border border border-app-border rounded-xl text-app-text hover:text-rose-500 transition-colors cursor-pointer group">
                            <Mail size={20} className="group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Resume Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <div className="bg-app-surface p-6 rounded-2xl border border-app-border">
                    <h2 className="text-xl font-outfit font-semibold mb-6 flex items-center gap-2 text-app-text">
                        <Code size={20} className="text-primary-500" />
                        Technical Expertise
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <div className="text-xs text-app-text-muted uppercase tracking-wider font-semibold mb-2">Languages</div>
                            <div className="flex flex-wrap gap-2">
                                {['Java', 'Python', 'C', 'C++', 'JavaScript', 'TypeScript', 'Haskell', 'SQL'].map(s => (
                                    <span key={s} className="px-2.5 py-1 rounded-md bg-app-bg border border-app-border text-xs text-app-text font-medium">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-app-text-muted uppercase tracking-wider font-semibold mb-2">AI & Robotics</div>
                            <div className="flex flex-wrap gap-2">
                                {['ROS2 Jazzy', 'Gazebo Harmonic', 'YOLOv3', 'Edge AI', 'NS-3', 'ESP32'].map(s => (
                                    <span key={s} className="px-2.5 py-1 rounded-md bg-primary-500/10 border border-primary-500/20 text-xs text-primary-400 font-medium">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-app-text-muted uppercase tracking-wider font-semibold mb-2">Frameworks & Databases</div>
                            <div className="flex flex-wrap gap-2">
                                {['React', 'Next.js 13+', 'FastAPI', 'Node.js', 'PostgreSQL', 'Docker'].map(s => (
                                    <span key={s} className="px-2.5 py-1 rounded-md bg-app-bg border border-app-border text-xs text-app-text font-medium">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Experience & Projects */}
                <div className="bg-app-surface p-6 rounded-2xl border border-app-border">
                    <h2 className="text-xl font-outfit font-semibold mb-6 flex items-center gap-2 text-app-text">
                        <Activity size={20} className="text-primary-500" />
                        Key Research & Projects
                    </h2>
                    <div className="space-y-6">
                        <div className="relative pl-4 border-l-2 border-primary-500/30">
                            <div className="absolute w-2 h-2 bg-primary-500 rounded-full -left-[5px] top-1.5"></div>
                            <h3 className="font-medium text-app-text">Semantic Robotics Research</h3>
                            <p className="text-sm text-app-text-muted mt-1 leading-relaxed">Developing autonomous decision-making systems by integrating ROS2 and Gazebo with formal ontologies mapping environment constraints.</p>
                        </div>
                        <div className="relative pl-4 border-l-2 border-primary-500/30">
                            <div className="absolute w-2 h-2 bg-primary-500 rounded-full -left-[5px] top-1.5"></div>
                            <h3 className="font-medium text-app-text">AIoT Agricultural Protection</h3>
                            <p className="text-sm text-app-text-muted mt-1 leading-relaxed">Designed a 3-layer architecture for wild boar intrusion detection utilizing YOLOv3 edge classification and NS-3 LoRa mesh routing.</p>
                        </div>
                        <div className="relative pl-4 border-l-2 border-primary-500/30">
                            <div className="absolute w-2 h-2 bg-primary-500 rounded-full -left-[5px] top-1.5"></div>
                            <h3 className="font-medium text-app-text">Malware Analysis (Fileless Attacks)</h3>
                            <p className="text-sm text-app-text-muted mt-1 leading-relaxed">Performing YARA-based static and dynamic analysis of obfuscated JavaScript executed via mshta.exe in sandboxed VMware environments.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-app-border to-transparent w-full my-4"></div>

            <div className="text-center">
                <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
                        <Activity className="text-primary-500" size={20} />
                    </div>
                </div>
                <h2 className="text-3xl font-outfit font-bold mb-3 text-app-text">About DAA Visualizer</h2>
                <p className="text-app-text-muted max-w-xl mx-auto leading-relaxed">
                    An interactive learning platform for Design and Analysis of Algorithms.
                    Visualize 54 algorithms across 9 categories with step-by-step execution, interactive controls, and educational annotations.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Goals */}
                <div className="bg-app-surface p-6 rounded-2xl border border-app-border h-full">
                    <h2 className="text-xl font-outfit font-semibold mb-4 flex items-center gap-2 text-app-text">
                        <BookOpen size={20} className="text-primary-500" />
                        Educational Goals
                    </h2>
                    <ul className="space-y-3 text-app-text-muted text-sm">
                        <li className="flex items-start gap-2"><span className="text-primary-500 mt-0.5">•</span> Make abstract algorithms tangible through real-time visualization</li>
                        <li className="flex items-start gap-2"><span className="text-primary-500 mt-0.5">•</span> Support multiple learning styles: visual, interactive, and reference-based</li>
                        <li className="flex items-start gap-2"><span className="text-primary-500 mt-0.5">•</span> Provide context: real-world applications, common mistakes, complexity analysis</li>
                        <li className="flex items-start gap-2"><span className="text-primary-500 mt-0.5">•</span> Enable comparison between alternative approaches to the same class of problems</li>
                    </ul>
                </div>

                {/* Tech Stack */}
                <div className="bg-app-surface rounded-2xl border border-app-border overflow-hidden h-full flex flex-col">
                    <div className="p-6 border-b border-app-border/50 bg-app-bg/30">
                        <h2 className="text-xl font-outfit font-semibold flex items-center gap-2 text-app-text">
                            <Code2 size={20} className="text-primary-500" />
                            Technology Stack
                        </h2>
                    </div>
                    <div className="divide-y divide-app-border/50 flex-1 overflow-y-auto">
                        {techStack.map(({ name, desc }) => (
                            <div key={name} className="flex flex-wrap items-center justify-between px-6 py-3 gap-2">
                                <span className="font-mono text-sm text-app-text bg-app-bg px-2 py-0.5 rounded border border-app-border">{name}</span>
                                <span className="text-xs text-app-text-muted">{desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Architecture */}
            <div>
                <h2 className="text-xl font-outfit font-semibold mb-4 text-app-text ml-2">Platform Architecture</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {architecture.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="bg-app-surface p-5 rounded-2xl border border-app-border hover:border-primary-500/30 transition-colors group">
                            <Icon size={24} className="text-primary-500 mb-4 group-hover:scale-110 transition-transform origin-left" />
                            <h3 className="font-outfit font-semibold text-app-text mb-2">{title}</h3>
                            <p className="text-app-text-muted text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center text-app-text-muted text-sm border-t border-app-border pt-8 mt-12 pb-4">
                Designed & Developed by Jaikrrish S
            </div>
        </div>
    );
};
