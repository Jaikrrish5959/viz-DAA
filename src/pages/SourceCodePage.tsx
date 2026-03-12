import { useState } from 'react';
import { Download, Code2, Copy, FileArchive, Check } from 'lucide-react';
import { allAlgorithms, categoryColors } from '../data/algorithmData';
import { generateSourceCode, type SupportedLanguage, getFileExtension } from '../utils/codeGenerator';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const SourceCodePage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(allAlgorithms[0]);
    const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python');
    const [copied, setCopied] = useState(false);
    const [isZipping, setIsZipping] = useState(false);

    const categories = ['All', ...new Set(allAlgorithms.map(a => a.category))];
    const filteredAlgorithms = selectedCategory === 'All'
        ? allAlgorithms
        : allAlgorithms.filter(a => a.category === selectedCategory);

    const languages: { id: SupportedLanguage; label: string }[] = [
        { id: 'python', label: 'Python' },
        { id: 'java', label: 'Java' },
        { id: 'cpp', label: 'C++' },
        { id: 'c', label: 'C' },
        { id: 'javascript', label: 'JavaScript' },
    ];

    const currentCode = generateSourceCode(selectedAlgorithm, selectedLanguage);
    const ext = getFileExtension(selectedLanguage);
    const filename = `${selectedAlgorithm.id}.${ext}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(currentCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadSingleFile = () => {
        const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, filename);
    };

    const downloadZip = async (type: 'category' | 'all') => {
        setIsZipping(true);
        try {
            const zip = new JSZip();
            const folderName = type === 'all' ? 'daa_all_algorithms' : `daa_${selectedCategory.toLowerCase().replace(/\\s+/g, '_')}`;
            const root = zip.folder(folderName);
            if (!root) throw new Error('Could not create zip folder');

            const algosToZip = type === 'all' ? allAlgorithms : filteredAlgorithms;

            algosToZip.forEach(algo => {
                const code = generateSourceCode(algo, selectedLanguage);
                const fileExt = getFileExtension(selectedLanguage);
                // Group by category inside the zip if downloading all
                if (type === 'all') {
                    const catFolder = root.folder(algo.category.replace(/\\s+/g, '_'));
                    if (catFolder) catFolder.file(`${algo.id}.${fileExt}`, code);
                } else {
                    root.file(`${algo.id}.${fileExt}`, code);
                }
            });

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${folderName}_${selectedLanguage}.zip`);
        } catch (error) {
            console.error('Error creating ZIP:', error);
            alert('Failed to generate ZIP file.');
        } finally {
            setIsZipping(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-72 shrink-0 flex flex-col gap-4">
                <div className="bg-app-surface border border-app-border rounded-2xl p-4">
                    <h2 className="text-xl font-outfit font-bold text-app-text mb-4">Source Code</h2>
                    <div className="space-y-2 mb-6">
                        <label className="text-xs text-app-text-muted uppercase tracking-wider font-semibold">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                const firstInCat = e.target.value === 'All'
                                    ? allAlgorithms[0]
                                    : allAlgorithms.find(a => a.category === e.target.value);
                                if (firstInCat) setSelectedAlgorithm(firstInCat);
                            }}
                            className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2 text-sm text-app-text outline-none focus:border-primary-500"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredAlgorithms.map(algo => (
                            <button
                                key={algo.id}
                                onClick={() => setSelectedAlgorithm(algo)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedAlgorithm.id === algo.id
                                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/30'
                                    : 'text-app-text-muted hover:bg-app-bg hover:text-app-text border border-transparent'
                                    }`}
                            >
                                {algo.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-app-surface border border-app-border rounded-2xl p-4 flex flex-col gap-3">
                    <button
                        onClick={() => downloadZip('category')}
                        disabled={isZipping || selectedCategory === 'All'}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-app-bg hover:bg-app-border text-app-text-muted hover:text-app-text rounded-xl transition-colors text-sm font-medium border border-app-border disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FileArchive size={16} />
                        Zip Category ({selectedLanguage})
                    </button>
                    <button
                        onClick={() => downloadZip('all')}
                        disabled={isZipping}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-xl transition-colors text-sm font-medium border border-primary-500/30 disabled:opacity-50"
                    >
                        {isZipping ? <span className="animate-pulse">Zipping...</span> : <><FileArchive size={16} /> Zip All (54 Algos)</>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-app-surface border border-app-border rounded-2xl overflow-hidden min-h-[600px]">
                {/* Header/Tabs */}
                <div className="border-b border-app-border bg-app-bg/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ background: `${categoryColors[selectedAlgorithm.category]?.hex}15`, color: categoryColors[selectedAlgorithm.category]?.hex }}>
                                <Code2 size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-outfit font-bold text-app-text">{selectedAlgorithm.name}</h2>
                                <p className="text-xs text-app-text-muted">{selectedAlgorithm.category} • {ext} file</p>
                            </div>
                        </div>

                        <div className="flex items-center bg-app-bg border border-app-border rounded-lg p-1">
                            {languages.map(lang => (
                                <button
                                    key={lang.id}
                                    onClick={() => setSelectedLanguage(lang.id)}
                                    className={`px-4 py-1.5 text-sm rounded-md transition-colors font-medium ${selectedLanguage === lang.id
                                        ? 'bg-app-surface text-app-text shadow-sm border border-app-border/50'
                                        : 'text-app-text-muted hover:text-app-text'
                                        }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Code Actions */}
                <div className="flex items-center justify-end px-4 py-3 bg-app-surface border-b border-app-border gap-3">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-app-text-muted hover:text-app-text bg-app-bg border border-app-border rounded-lg transition-colors"
                    >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        onClick={downloadSingleFile}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors shadow-lg shadow-primary-500/20"
                    >
                        <Download size={14} />
                        Download .{ext}
                    </button>
                </div>

                {/* Code Viewer */}
                <div className="flex-1 overflow-auto bg-[#0d0d0f] p-6 relative group">
                    <pre className="font-mono text-sm leading-relaxed text-gray-300">
                        <code>{currentCode}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};
