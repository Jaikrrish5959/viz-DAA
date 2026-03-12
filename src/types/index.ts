export type ActionType = 'try' | 'place' | 'backtrack' | 'solution' | 'conflict' | 'swap' | 'compare' | 'found' | 'none';

export interface GridCell {
    row: number;
    col: number;
    value: number;
}

export interface ExecutionState {
    step_id: number;
    algorithm: string;
    board?: number[][];
    array?: number[];
    recursion_depth: number;
    action_type: ActionType;
    message: string;
    metadata?: Record<string, any>;
    // E.g., specific cell being evaluated
    active_cells?: { row: number; col: number }[];
    active_indices?: number[]; // For array operations
}

export interface AlgorithmComplexity {
    time: string;
    space: string;
}

export type InputType = 'number' | 'text' | 'array' | 'select' | 'boolean';

export interface AlgorithmInputDef {
    name: string;
    label: string;
    type: InputType;
    defaultValue: any;
    options?: { value: string | number; label: string }[]; // For select type
    min?: number;
    max?: number;
    step?: number;
}

export interface AlgorithmModule {
    name: string;
    id: string; // url-friendly id
    category: 'Backtracking' | 'Dynamic Programming' | 'Divide and Conquer' | 'Greedy' | 'String Matching' | 'Sorting' | 'Graph Algorithms' | 'Other';
    description: string;
    pseudocode: string[];
    complexity: AlgorithmComplexity;
    inputConfig: AlgorithmInputDef[];
    // A generator that yields execution states based on standard inputs
    generateStates: (input: any) => Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown>;
}
