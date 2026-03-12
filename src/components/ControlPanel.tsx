import React from 'react';
import {
    Play,
    Pause,
    SkipForward,
    SkipBack,
    RotateCcw,
    Settings2,
    FastForward,
    ChevronsRight
} from 'lucide-react';
import { useExecutionStore } from '../state/executionStore';

export const ControlPanel: React.FC = () => {
    const {
        isPlaying,
        play,
        pause,
        nextStep,
        prevStep,
        skipToNextSolution,
        skipToEnd,
        reset,
        speedMs,
        setSpeed,
        algorithm,
        isFinished,
        currentStepIndex,
        states,
        solutions
    } = useExecutionStore();

    const handlePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    const isAtEnd = isFinished && currentStepIndex === states.length - 1;

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 bg-app-surface border border-app-border rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={reset}
                    title="Reset"
                    className="p-2 sm:p-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    disabled={!algorithm || currentStepIndex <= 0}
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    onClick={prevStep}
                    title="Previous Step"
                    className="p-2 sm:p-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    disabled={!algorithm || currentStepIndex <= 0 || isPlaying}
                >
                    <SkipBack size={20} />
                </button>

                <button
                    onClick={handlePlayPause}
                    title={isPlaying ? "Pause" : "Play"}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    disabled={!algorithm || isAtEnd}
                >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>

                <button
                    onClick={nextStep}
                    title="Next Step"
                    className="p-2 sm:p-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    disabled={!algorithm || isAtEnd || isPlaying}
                >
                    <SkipForward size={20} />
                </button>

                <button
                    onClick={skipToNextSolution}
                    title="Skip to Next Solution"
                    className="p-2 sm:p-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    disabled={!algorithm || isAtEnd}
                >
                    <FastForward size={20} />
                </button>

                <button
                    onClick={skipToEnd}
                    title="Skip to Generation End"
                    className="p-2 sm:p-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    disabled={!algorithm || isAtEnd}
                >
                    <ChevronsRight size={20} />
                </button>
            </div>

            {/* Middle: Solution Tracker (if applicable) */}
            {solutions.length > 0 && (
                <div className="flex-1 hidden sm:flex justify-center">
                    <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-full font-medium">
                        {solutions.length} Solution{solutions.length !== 1 ? 's' : ''} Found
                    </div>
                </div>
            )}

            {/* Speed Control */}
            <div className="flex items-center gap-3 w-full sm:w-auto px-4 py-2 bg-gray-900 rounded-xl border border-gray-800">
                <Settings2 size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-400 w-16">
                    {speedMs}ms
                </span>
                <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={speedMs}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full sm:w-32 accent-primary-500"
                />
                <span className="text-xs text-gray-500 font-medium">Slow</span>
            </div>

        </div>
    );
};
