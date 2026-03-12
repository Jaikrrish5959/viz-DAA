import React from 'react';
import type { ExecutionState } from '../types';

interface GraphVisualizerProps { state: ExecutionState; }

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ state }) => {
    if (!state?.metadata) return <div className="text-gray-500">No graph data.</div>;

    const { nodes = [], edges = [], visited = [], distances = {}, activeNode, activeEdge, mstEdges = [] } = state.metadata;
    const { action_type, message } = state;

    // Layout nodes in a circle
    const cx = 250, cy = 200, radius = 150;
    const nodePositions: Record<string, { x: number; y: number }> = {};
    nodes.forEach((n: string, i: number) => {
        const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
        nodePositions[n] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    });

    const isVisited = (n: string) => visited.includes(n);
    const isActive = (n: string) => n === activeNode;
    const isActiveEdge = (u: string, v: string) => activeEdge && ((activeEdge[0] === u && activeEdge[1] === v) || (activeEdge[0] === v && activeEdge[1] === u));
    const isMSTEdge = (u: string, v: string) => mstEdges.some((e: [string, string, number]) => (e[0] === u && e[1] === v) || (e[0] === v && e[1] === u));

    const actionColor = (): string => {
        switch (action_type) {
            case 'explore': return 'bg-blue-950/50 border-blue-900/50 text-blue-400';
            case 'place': return 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400';
            case 'update': return 'bg-yellow-950/50 border-yellow-900/50 text-yellow-400';
            case 'compare': return 'bg-yellow-950/50 border-yellow-900/50 text-yellow-400';
            case 'conflict': return 'bg-red-950/50 border-red-900/50 text-red-400';
            case 'backtrack': return 'bg-orange-950/50 border-orange-900/50 text-orange-400';
            case 'solution': return 'bg-purple-950/50 border-purple-900/50 text-purple-400';
            default: return 'bg-gray-900 border-gray-800 text-gray-400';
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl gap-6 p-4">
            <div className={`w-full p-4 rounded-xl border flex items-center justify-between font-mono text-sm ${actionColor()}`}>
                <span className="font-semibold uppercase pr-4 border-r border-[inherit]">{action_type}</span>
                <span className="pl-4 flex-1">{message}</span>
            </div>

            <svg viewBox="0 0 500 400" className="w-full max-w-lg bg-gray-950 rounded-2xl border border-gray-800 shadow-2xl p-4">
                {/* Edges */}
                {edges.map(([u, v, w]: [string, string, number], i: number) => {
                    const p1 = nodePositions[u], p2 = nodePositions[v];
                    if (!p1 || !p2) return null;
                    const active = isActiveEdge(u, v);
                    const mst = isMSTEdge(u, v);
                    return (
                        <g key={`edge-${i}`}>
                            <line
                                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                stroke={active ? '#facc15' : mst ? '#22c55e' : '#374151'}
                                strokeWidth={active ? 3 : mst ? 2.5 : 1.5}
                                opacity={active ? 1 : mst ? 0.9 : 0.4}
                            />
                            <text x={(p1.x + p2.x) / 2 + 8} y={(p1.y + p2.y) / 2 - 8}
                                fill={active ? '#facc15' : mst ? '#22c55e' : '#6b7280'}
                                fontSize="11" fontFamily="monospace" textAnchor="middle">
                                {w > 1 ? w : ''}
                            </text>
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map((n: string) => {
                    const pos = nodePositions[n];
                    if (!pos) return null;
                    const active = isActive(n);
                    const vis = isVisited(n);
                    const dist = distances[n];
                    return (
                        <g key={`node-${n}`}>
                            <circle cx={pos.x} cy={pos.y} r={20}
                                fill={active ? '#3b82f6' : vis ? '#22c55e' : '#1e293b'}
                                stroke={active ? '#60a5fa' : vis ? '#4ade80' : '#475569'}
                                strokeWidth={active ? 3 : 2}
                                opacity={0.9} />
                            <text x={pos.x} y={pos.y + 1} fill="white" fontSize="14"
                                fontWeight="bold" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">
                                {n}
                            </text>
                            {dist !== undefined && dist !== null && dist !== Infinity && (
                                <text x={pos.x} y={pos.y + 34} fill="#94a3b8" fontSize="10"
                                    fontFamily="monospace" textAnchor="middle">
                                    d={dist}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Distance table */}
            {Object.keys(distances).length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {nodes.map((n: string) => (
                        <div key={n} className={`px-3 py-1.5 rounded-lg border ${isVisited(n) ? 'bg-emerald-950/30 border-emerald-800/30 text-emerald-400' : 'bg-gray-900 border-gray-800 text-gray-500'}`}>
                            {n}: {distances[n] === Infinity || distances[n] === undefined ? '∞' : distances[n]}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
