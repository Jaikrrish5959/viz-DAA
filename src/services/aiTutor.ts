import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AlgorithmModule, ExecutionState } from '../types';

export interface TutorContext {
    algorithm: AlgorithmModule;
    currentState: ExecutionState;
    currentStepIndex: number;
    totalSteps: number;
    inputValues?: Record<string, any>;
}

export async function askTutor(question: string, context: TutorContext, apiKey: string): Promise<string> {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Specifically instructed to use Gemini 1.5 Pro or Flash as they are best for this
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are an expert Computer Science professor and algorithm tutor helping a student understand a complex algorithm visualization.

**Current Algorithm Context:**
Algorithm Name: ${context.algorithm.name}
Category: ${context.algorithm.category}
Time Complexity: ${context.algorithm.complexity.time}
Space Complexity: ${context.algorithm.complexity.space}

**Current Execution State (Step ${context.currentStepIndex + 1} of ${context.totalSteps}):**
Action: ${context.currentState.action_type}
Depth: ${context.currentState.recursion_depth || 0}

**State Data:**
` + JSON.stringify(context.currentState, (key, value) => {
            // Filter out React ref/circular stuff if any gets in there, though execution state should be clean
            return key === 'board' || key === 'metadata' || key === 'array' || key === 'variables' ? value : value;
        }, 2) + `

**Student Question:**
"${question}"

**Instructions for your response:**
1. Explain clearly in simple terms suitable for a beginner learning algorithms.
2. Avoid unnecessary dense theory; focus directly on explaining THIS specific step or answering the question based on the provided state data.
3. If the user asks for a hint, guide them without revealing the full solution.
4. If describing "Why it backtracked", connect it to the constraints (e.g., "The board sum exceeded the target").
5. Format your response cleanly using markdown (bolding key variables, using code blocks for small arrays/numbers).
6. Be encouraging and concise. Do NOT output a massive essay, keep it to 1-3 short paragraphs.
`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error: any) {
        console.error("AI Tutor Error:", error);
        if (error.message?.includes("API key")) {
            return "Error: Invalid or missing API Key. Please click the settings icon above to configure your Gemini API Key.";
        }
        return "Sorry, I encountered an error while trying to process your request. " + (error.message || "");
    }
}
