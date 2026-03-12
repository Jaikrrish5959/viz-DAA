import type { AlgorithmModule, ExecutionState } from '../../types';

// KMP
function* kmpGenerator({ text: tStr, pattern: pStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const text: string = tStr || "ABABDABACDABABCABAB";
    const pattern: string = pStr || "ABABCABAB";

    // Build LPS array
    const lps = new Array(pattern.length).fill(0);
    let len = 0, i = 1;
    while (i < pattern.length) {
        if (pattern[i] === pattern[len]) { len++; lps[i] = len; i++; }
        else { if (len !== 0) len = lps[len - 1]; else { lps[i] = 0; i++; } }
    }

    yield { recursion_depth: 0, action_type: 'none', array: lps, message: `KMP: text="${text}", pattern="${pattern}". LPS: [${lps.join(',')}]`, metadata: { text, pattern, lps, textIdx: -1, patIdx: -1, matches: [] } };

    let ti = 0, pi = 0;
    const matches: number[] = [];
    while (ti < text.length) {
        yield { recursion_depth: 0, action_type: 'compare', array: lps, message: `Comparing text[${ti}]='${text[ti]}' with pattern[${pi}]='${pattern[pi]}'`, metadata: { text, pattern, lps, textIdx: ti, patIdx: pi, matches: [...matches] } };

        if (text[ti] === pattern[pi]) {
            ti++; pi++;
            if (pi === pattern.length) {
                matches.push(ti - pi);
                yield { recursion_depth: 0, action_type: 'found', array: lps, message: `Match found at index ${ti - pi}!`, metadata: { text, pattern, lps, textIdx: ti, patIdx: pi, matches: [...matches] } };
                pi = lps[pi - 1];
            }
        } else {
            if (pi !== 0) {
                yield { recursion_depth: 0, action_type: 'skip', array: lps, message: `Mismatch. Using LPS: jump pattern to index ${lps[pi - 1]}`, metadata: { text, pattern, lps, textIdx: ti, patIdx: pi, matches: [...matches] } };
                pi = lps[pi - 1];
            } else {
                ti++;
            }
        }
    }
    yield { recursion_depth: 0, action_type: 'solution', array: lps, message: `KMP complete. ${matches.length} match(es) at: [${matches.join(', ')}]`, metadata: { text, pattern, lps, textIdx: -1, patIdx: -1, matches } };
}

export const kmpModule: AlgorithmModule = {
    id: "kmp", name: "KMP Pattern Matching", category: "String Matching",
    description: "Efficient string matching using a prefix function (LPS array) to avoid redundant comparisons.",
    pseudocode: ["build LPS array", "i=0, j=0", "while i < text.length:", "  if match: advance both", "  if j==m: found match", "  else: use LPS to shift"],
    complexity: { time: "O(n + m)", space: "O(m)" },
    inputConfig: [
        { name: "text", type: "text", label: "Text", defaultValue: "ABABDABACDABABCABAB" },
        { name: "pattern", type: "text", label: "Pattern", defaultValue: "ABABCABAB" }
    ],
    generateStates: kmpGenerator
};

// Rabin-Karp
function* rabinKarpGenerator({ text: tStr, pattern: pStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const text: string = tStr || "ABCCDDAEFG";
    const pattern: string = pStr || "CDD";
    const d = 256, q = 101;
    const m = pattern.length, n = text.length;

    let pHash = 0, tHash = 0, h = 1;
    for (let i = 0; i < m - 1; i++) h = (h * d) % q;
    for (let i = 0; i < m; i++) { pHash = (d * pHash + pattern.charCodeAt(i)) % q; tHash = (d * tHash + text.charCodeAt(i)) % q; }

    yield { recursion_depth: 0, action_type: 'none', array: [], message: `Rabin-Karp: pattern hash=${pHash}`, metadata: { text, pattern, textIdx: -1, patIdx: -1, matches: [], pHash, tHash } };

    const matches: number[] = [];
    for (let i = 0; i <= n - m; i++) {
        yield { recursion_depth: 0, action_type: 'compare', array: [], message: `Window [${i}..${i + m - 1}] hash=${tHash} vs pattern hash=${pHash}`, metadata: { text, pattern, textIdx: i, patIdx: 0, matches: [...matches], pHash, tHash } };

        if (pHash === tHash) {
            let match = true;
            for (let j = 0; j < m; j++) { if (text[i + j] !== pattern[j]) { match = false; break; } }
            if (match) {
                matches.push(i);
                yield { recursion_depth: 0, action_type: 'found', array: [], message: `Match confirmed at index ${i}!`, metadata: { text, pattern, textIdx: i, patIdx: 0, matches: [...matches], pHash, tHash } };
            } else {
                yield { recursion_depth: 0, action_type: 'conflict', array: [], message: `Hash collision at index ${i} — spurious hit`, metadata: { text, pattern, textIdx: i, patIdx: 0, matches: [...matches], pHash, tHash } };
            }
        }

        if (i < n - m) {
            tHash = (d * (tHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
            if (tHash < 0) tHash += q;
        }
    }
    yield { recursion_depth: 0, action_type: 'solution', array: [], message: `${matches.length} match(es) at [${matches.join(', ')}]`, metadata: { text, pattern, textIdx: -1, patIdx: -1, matches, pHash, tHash } };
}

export const rabinKarpModule: AlgorithmModule = {
    id: "rabin-karp", name: "Rabin-Karp", category: "String Matching",
    description: "String matching using rolling hash. Compares hash values of the pattern with substrings, verifying on hash match.",
    pseudocode: ["compute pattern hash", "compute initial window hash", "for each window:", "  if hashes match:", "    verify char by char", "  slide window (rolling hash)"],
    complexity: { time: "O(n+m) avg", space: "O(1)" },
    inputConfig: [
        { name: "text", type: "text", label: "Text", defaultValue: "ABCCDDAEFG" },
        { name: "pattern", type: "text", label: "Pattern", defaultValue: "CDD" }
    ],
    generateStates: rabinKarpGenerator
};

// Z Algorithm
function* zAlgorithmGenerator({ text: tStr, pattern: pStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    const text: string = tStr || "AABXAABXCAABXAABXAY";
    const pattern: string = pStr || "AABXAAB";
    const s = pattern + "$" + text;
    const n = s.length;
    const z = new Array(n).fill(0);

    yield { recursion_depth: 0, action_type: 'none', array: z, message: `Z Algorithm: concat = "${pattern}$${text}"`, metadata: { text, pattern, concat: s, textIdx: -1, matches: [] } };

    let l = 0, r = 0;
    for (let i = 1; i < n; i++) {
        if (i < r) z[i] = Math.min(r - i, z[i - l]);
        while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
        if (i + z[i] > r) { l = i; r = i + z[i]; }

        yield { recursion_depth: 0, action_type: 'explore', array: [...z], message: `Z[${i}] = ${z[i]} (comparing from pos ${i})`, metadata: { text, pattern, concat: s, textIdx: i, matches: [] } };
    }

    const m = pattern.length;
    const matches: number[] = [];
    for (let i = m + 1; i < n; i++) {
        if (z[i] === m) matches.push(i - m - 1);
    }

    yield { recursion_depth: 0, action_type: 'solution', array: [...z], message: `Matches at: [${matches.join(', ')}]`, metadata: { text, pattern, concat: s, textIdx: -1, matches } };
}

export const zAlgorithmModule: AlgorithmModule = {
    id: "z-algorithm", name: "Z Algorithm", category: "String Matching",
    description: "Builds a Z-array where Z[i] is the length of the longest substring starting at i which is also a prefix. Used for pattern matching.",
    pseudocode: ["concat = pattern + '$' + text", "build Z array:", "  for i from 1 to n:", "    compute Z[i]", "matches where Z[i] == m"],
    complexity: { time: "O(n + m)", space: "O(n + m)" },
    inputConfig: [
        { name: "text", type: "text", label: "Text", defaultValue: "AABXAABXCAABXAABXAY" },
        { name: "pattern", type: "text", label: "Pattern", defaultValue: "AABXAAB" }
    ],
    generateStates: zAlgorithmGenerator
};

export { boyerMooreModule } from './boyerMoore';
