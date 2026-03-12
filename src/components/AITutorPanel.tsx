import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bot, AlertCircle, X, Lightbulb } from 'lucide-react';
import { useAIStore } from '../state/aiStore';
import { useExecutionStore } from '../state/executionStore';
import { askTutor, type TutorContext } from '../services/aiTutor';

interface Message {
    id: string;
    role: 'user' | 'tutor';
    content: string;
    timestamp: number;
}

export const AITutorPanel = () => {
    const { apiKey } = useAIStore();
    const { algorithm, states, currentStepIndex, isPlaying } = useExecutionStore();

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text: string) => {
        if (!text.trim() || !algorithm || !apiKey) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        const currentExecState = states[currentStepIndex];

        const context: TutorContext = {
            algorithm: algorithm,
            currentState: currentExecState,
            currentStepIndex: currentStepIndex,
            totalSteps: states.length,
        };

        try {
            const responseText = await askTutor(text, context, apiKey);
            const tutorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'tutor',
                content: responseText,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, tutorMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'tutor',
                content: "I'm having trouble connecting to my brain right now. Please check your API key or try again later.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickActions = [
        { label: "Explain this step", icon: Sparkles },
        { label: "Give me a hint", icon: Lightbulb },
        { label: "Why did it backtrack?", icon: AlertCircle }
    ];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl shadow-2xl shadow-primary-500/25 transition-all hover:-translate-y-1 hover:scale-105 z-50 flex items-center justify-center group"
            >
                <Bot size={24} className="group-hover:animate-pulse" />
                <span className="absolute right-full mr-4 bg-app-surface text-app-text px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-app-border">
                    Ask AI Tutor
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-app-surface border border-app-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transform transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            {/* Header */}
            <div className="p-4 border-b border-app-border bg-[#0d0d0f] flex justify-between items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-500/10" />
                <div className="relative flex items-center gap-3">
                    <div className="p-2 bg-primary-500/20 rounded-xl border border-primary-500/30">
                        <Bot size={20} className="text-primary-500" />
                    </div>
                    <div>
                        <h3 className="font-outfit font-semibold text-app-text text-lg leading-tight">AI Tutor</h3>
                        <p className="text-xs text-app-text-muted mt-0.5">Powered by Gemini 1.5</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="relative p-2 text-app-text-muted hover:text-white hover:bg-app-border rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Missing API Key Warning */}
            {!apiKey && (
                <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 flex gap-3 text-amber-500">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium mb-1">API Key Required</p>
                        <p className="opacity-80">You need to configure your Gemini API key in the platform settings (Navbar) to use the AI Tutor.</p>
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#08080a]">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-app-text-muted space-y-4">
                        <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-2">
                            <Sparkles size={28} className="text-primary-500" />
                        </div>
                        <h4 className="font-outfit font-medium text-app-text text-lg">Interactive Learning</h4>
                        <p className="text-sm leading-relaxed max-w-[250px]">
                            I can contextually read the exact step ({currentStepIndex + 1}) the algorithm is currently paused on. Ask me anything!
                        </p>
                    </div>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-app-border text-app-text-muted' : 'bg-primary-500/20 text-primary-400 border border-primary-500/30'}`}>
                                {msg.role === 'user' ? <span className="text-xs font-semibold">ME</span> : <Bot size={16} />}
                            </div>
                            <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-app-surface border border-app-border text-app-text rounded-tl-none leading-relaxed prose prose-sm prose-invert'}`}>
                                {/* Basic markdown rendering (just line breaks for now) */}
                                {msg.content.split('\n').map((line: string, i: number) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i !== msg.content.split('\\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div >
                    ))
                )}

                {
                    isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 flex items-center justify-center shrink-0">
                                <Bot size={16} />
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-app-surface border border-app-border flex items-center gap-1.5 h-[44px]">
                                <div className="w-1.5 h-1.5 bg-primary-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-primary-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-primary-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )
                }
                <div ref={messagesEndRef} />
            </div >

            {/* Input Area */}
            < div className="p-4 bg-app-surface border-t border-app-border" >
                {/* Quick Actions */}
                < div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar hidden-scrollbar mask-edges" >
                    {
                        quickActions.map(({ label, icon: Icon }) => (
                            <button
                                key={label}
                                onClick={() => handleSend(label)}
                                disabled={!apiKey || isTyping || !algorithm || isPlaying}
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-app-bg border border-app-border text-xs text-app-text-muted hover:text-primary-400 hover:border-primary-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Icon size={12} />
                                {label}
                            </button>
                        ))
                    }
                </div >

                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={!apiKey || isTyping || !algorithm || isPlaying}
                        placeholder={isPlaying ? "Pause visualizer to ask questions..." : "Ask a question about this step..."}
                        className="flex-1 bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || !apiKey || isTyping || !algorithm || isPlaying}
                        className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={18} className={inputValue.trim() && apiKey && !isTyping ? "ml-0.5" : ""} />
                    </button>
                </form>
            </div >
        </div >
    );
};
