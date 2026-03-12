import React from 'react';
import type { AlgorithmModule, AlgorithmInputDef } from '../types';
import { Play } from 'lucide-react';

interface AlgorithmConfigPanelProps {
    algorithm: AlgorithmModule | undefined;
    inputValues: Record<string, any>;
    onInputChange: (name: string, value: any) => void;
    onExecute: () => void;
    isRunning: boolean;
}

export const AlgorithmConfigPanel: React.FC<AlgorithmConfigPanelProps> = ({
    algorithm,
    inputValues,
    onInputChange,
    onExecute,
    isRunning
}) => {
    if (!algorithm || !algorithm.inputConfig || algorithm.inputConfig.length === 0) return null;

    const renderInput = (def: AlgorithmInputDef) => {
        const value = inputValues[def.name] ?? def.defaultValue;

        switch (def.type) {
            case 'number':
                return (
                    <input
                        type="number"
                        min={def.min}
                        max={def.max}
                        step={def.step}
                        value={value}
                        onChange={(e) => onInputChange(def.name, Number(e.target.value))}
                        disabled={isRunning}
                        className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 disabled:opacity-50"
                    />
                );
            case 'text':
            case 'json':
            case 'array': // Simplifying array input UX to text field comma-separated for now
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onInputChange(def.name, e.target.value)}
                        disabled={isRunning}
                        placeholder={def.type === 'array' ? "e.g. 5, 2, 8, 1" : ""}
                        className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 disabled:opacity-50"
                    />
                );
            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => onInputChange(def.name, e.target.value)}
                        disabled={isRunning}
                        className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 disabled:opacity-50"
                    >
                        {def.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );
            case 'boolean':
                return (
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => onInputChange(def.name, e.target.checked)}
                            disabled={isRunning}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 disabled:opacity-50"></div>
                    </label>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-app-surface p-6 rounded-2xl border border-app-border">
            <h3 className="font-outfit text-xl font-medium mb-4 text-white">Configuration</h3>

            <div className="flex flex-col gap-4">
                {algorithm.inputConfig.map((def) => (
                    <div key={def.name}>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            {def.label}
                        </label>
                        {renderInput(def)}
                    </div>
                ))}
            </div>

            <button
                onClick={onExecute}
                disabled={isRunning}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg px-4 py-2.5 transition-colors disabled:opacity-50"
            >
                <Play size={18} />
                {isRunning ? 'Executing...' : 'Generate & Execute'}
            </button>
        </div>
    );
};
