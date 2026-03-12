import { create } from 'zustand';
import type { ExecutionState, AlgorithmModule } from '../types';

interface ExecutionStore {
    algorithm: AlgorithmModule | null;
    states: ExecutionState[]; // Timeline of execution
    solutions: ExecutionState[]; // Store discovered solutions
    currentStepIndex: number; // Where we are in the playback
    isPlaying: boolean;
    speedMs: number;
    generator: Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> | null;
    isFinished: boolean; // Indicates if the generator is exhausted

    // Actions
    setAlgorithm: (algo: AlgorithmModule, input: any) => void;
    nextStep: () => void;
    prevStep: () => void;
    play: () => void;
    pause: () => void;
    skipToNextSolution: () => void;
    skipToEnd: () => void;
    setSpeed: (ms: number) => void;
    reset: () => void;
}

export const useExecutionStore = create<ExecutionStore>((set, get) => ({
    algorithm: null,
    states: [],
    solutions: [],
    currentStepIndex: -1,
    isPlaying: false,
    speedMs: 500,
    generator: null,
    isFinished: false,

    setAlgorithm: (algo, input) => {
        // Stop playing if it is
        const { pause } = get();
        pause();

        const gen = algo.generateStates(input);

        // Generate initial state (step 0 - starting state)
        // Wait, let's just initialize the generator and leave the first state extraction for the first `nextStep` or manually here.
        const firstYield = gen.next();

        if (firstYield.done) {
            set({ algorithm: algo, states: [], currentStepIndex: -1, generator: null, isFinished: true });
            return;
        }

        const firstState: ExecutionState = {
            ...firstYield.value,
            step_id: 0,
            algorithm: algo.id,
        };

        set({
            algorithm: algo,
            states: [firstState],
            solutions: firstState.action_type === 'solution' ? [firstState] : [],
            currentStepIndex: 0,
            generator: gen,
            isFinished: false,
        });
    },

    nextStep: () => {
        const { states, solutions, currentStepIndex, generator, algorithm, isFinished, pause } = get();

        if (!algorithm) return;

        // If we're not at the tip of the states array, just increment index
        if (currentStepIndex < states.length - 1) {
            set({ currentStepIndex: currentStepIndex + 1 });
            return;
        }

        // Otherwise, generate the next state
        if (!generator || isFinished) {
            pause();
            return;
        }

        const nextYield = generator.next();

        if (nextYield.done) {
            set({ isFinished: true });
            pause();
            return;
        }

        const newState: ExecutionState = {
            ...nextYield.value,
            step_id: states.length,
            algorithm: algorithm.id,
        };

        const newSolutions = newState.action_type === 'solution'
            ? [...solutions, newState]
            : solutions;

        set({
            states: [...states, newState],
            solutions: newSolutions,
            currentStepIndex: currentStepIndex + 1,
        });
    },

    prevStep: () => {
        const { currentStepIndex, pause } = get();
        pause();
        if (currentStepIndex > 0) {
            set({ currentStepIndex: currentStepIndex - 1 });
        }
    },

    play: () => {
        const { isFinished, currentStepIndex, states } = get();
        if (isFinished && currentStepIndex === states.length - 1) return;
        set({ isPlaying: true });
    },

    pause: () => {
        set({ isPlaying: false });
    },

    skipToNextSolution: () => {
        const { algorithm, generator, states, solutions, currentStepIndex, isFinished, pause } = get();
        pause();

        if (!algorithm) return;

        // Check if there is already a future solution in the generated states timeline
        const futureSolutionIndex = states.findIndex(
            (s, idx) => idx > currentStepIndex && s.action_type === 'solution'
        );

        if (futureSolutionIndex !== -1) {
            set({ currentStepIndex: futureSolutionIndex });
            return;
        }

        if (isFinished || !generator) return;

        // Generate states until a solution is found
        const newStates = [...states];
        const newSolutions = [...solutions];
        let nextYield = generator.next();
        const MAX_STEPS = 10000;
        let steps = 0;
        let foundSolution = false;

        while (!nextYield.done && steps < MAX_STEPS && !foundSolution) {
            const newState: ExecutionState = {
                ...nextYield.value,
                step_id: newStates.length,
                algorithm: algorithm.id,
            };
            newStates.push(newState);

            if (newState.action_type === 'solution') {
                newSolutions.push(newState);
                foundSolution = true;
            }

            if (!foundSolution) {
                nextYield = generator.next();
            }
            steps++;
        }

        set({
            states: newStates,
            solutions: newSolutions,
            currentStepIndex: newStates.length - 1,
            isFinished: nextYield.done
        });
    },

    skipToEnd: () => {
        const { algorithm, generator, states, solutions, isFinished, pause } = get();
        pause(); // Stop normal playback

        if (!algorithm) return;

        if (isFinished || !generator) {
            // If already generated all states, just jump to the end
            if (states.length > 0) {
                set({ currentStepIndex: states.length - 1 });
            }
            return;
        }

        // Fast forward the generator to avoid blocking the UI thread for too long, but get all states
        const newStates = [...states];
        const newSolutions = [...solutions];
        let nextYield = generator.next();
        const MAX_STEPS = 50000; // Safety limit
        let steps = 0;

        while (!nextYield.done && steps < MAX_STEPS) {
            const newState: ExecutionState = {
                ...nextYield.value,
                step_id: newStates.length,
                algorithm: algorithm.id,
            };
            newStates.push(newState);

            if (newState.action_type === 'solution') {
                newSolutions.push(newState);
            }

            nextYield = generator.next();
            steps++;
        }

        set({
            states: newStates,
            solutions: newSolutions,
            currentStepIndex: newStates.length - 1,
            isFinished: nextYield.done
        });
    },

    setSpeed: (ms) => {
        set({ speedMs: ms });
    },

    reset: () => {
        // To properly reset, we need the initial input again.
        // So usually resetting will just mean jumping index to 0.
        const { pause } = get();
        pause();
        set({ currentStepIndex: 0 });
    }
}));
