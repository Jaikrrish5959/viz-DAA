import type { AlgorithmModule, ExecutionState } from '../../types';

// Boyer-Moore String Matching
function* boyerMooreGenerator({ text: textStr, pattern: patStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const text = textStr || 'ABAAABCDABC';
    const pattern = patStr || 'ABC';

    yield { recursion_depth: 0, action_type: 'none', message: `Boyer-Moore: search "${pattern}" in "${text}"`, metadata: { text, pattern, textIndex: -1, patternIndex: -1, matches: [] } };

    // Build bad character table
    const badChar: Record<string, number> = {};
    for (let i = 0; i < pattern.length; i++) badChar[pattern[i]] = i;

    yield { recursion_depth: 0, action_type: 'explore', message: `Bad char table: ${JSON.stringify(badChar)}`, metadata: { text, pattern, textIndex: -1, patternIndex: -1, matches: [] } };

    const matches: number[] = [];
    let s = 0;

    while (s <= text.length - pattern.length) {
        let j = pattern.length - 1;

        yield { recursion_depth: 0, action_type: 'explore', message: `Align pattern at position ${s}`, metadata: { text, pattern, textIndex: s, patternIndex: j, matches: [...matches] } };

        while (j >= 0 && pattern[j] === text[s + j]) {
            yield { recursion_depth: 0, action_type: 'compare', message: `Match: text[${s + j}]='${text[s + j]}' == pattern[${j}]='${pattern[j]}'`, metadata: { text, pattern, textIndex: s + j, patternIndex: j, matches: [...matches] } };
            j--;
        }

        if (j < 0) {
            matches.push(s);
            yield { recursion_depth: 0, action_type: 'solution', message: `Pattern found at index ${s}!`, metadata: { text, pattern, textIndex: s, patternIndex: 0, matches: [...matches] } };
            s += (s + pattern.length < text.length) ? pattern.length - (badChar[text[s + pattern.length]] ?? -1) : 1;
        } else {
            yield { recursion_depth: 0, action_type: 'compare', message: `Mismatch: text[${s + j}]='${text[s + j]}' != pattern[${j}]='${pattern[j]}'`, metadata: { text, pattern, textIndex: s + j, patternIndex: j, matches: [...matches] } };
            const shift = Math.max(1, j - (badChar[text[s + j]] ?? -1));
            yield { recursion_depth: 0, action_type: 'update', message: `Shift pattern by ${shift} positions`, metadata: { text, pattern, textIndex: s + j, patternIndex: j, matches: [...matches] } };
            s += shift;
        }
    }

    yield { recursion_depth: 0, action_type: 'solution', message: `Search complete. Found ${matches.length} match(es) at positions: [${matches.join(', ')}]`, metadata: { text, pattern, textIndex: -1, patternIndex: -1, matches } };
}

export const boyerMooreModule: AlgorithmModule = {
    id: "boyer-moore", name: "Boyer-Moore", category: "String Matching",
    description: "String matching using bad character heuristic. Compares pattern right-to-left and shifts pattern intelligently on mismatch, often skipping large portions of text.",
    pseudocode: ["Build bad character table", "s = 0", "while s <= n - m:", "  j = m - 1", "  while j >= 0 and P[j] == T[s+j]: j--", "  if j < 0: match found at s", "  else: shift by bad char rule"],
    complexity: { time: "O(n/m) best, O(nm) worst", space: "O(σ)" },
    inputConfig: [
        { name: "text", type: "text", label: "Text", defaultValue: "ABAAABCDABC" },
        { name: "pattern", type: "text", label: "Pattern", defaultValue: "ABC" }
    ],
    generateStates: boyerMooreGenerator
};
