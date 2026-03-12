import type { AlgorithmModule, ExecutionState } from '../../types';

// Activity Selection
function* activitySelectionGenerator({ activities: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let acts: [number, number][];
    try { acts = JSON.parse(aStr); } catch { acts = [[1, 3], [2, 5], [0, 6], [5, 7], [8, 9], [5, 9], [6, 10], [8, 11], [2, 13], [12, 14]]; }
    acts.sort((a, b) => a[1] - b[1]);
    const selected: [number, number][] = [];
    const arr = acts.map(a => a[1] - a[0]);

    yield { recursion_depth: 0, action_type: 'none', array: arr, message: `Activity Selection: ${acts.length} activities sorted by finish time`, metadata: { activities: acts, selected: [], indices: [] } };

    let lastEnd = -1;
    for (let i = 0; i < acts.length; i++) {
        yield { recursion_depth: 0, action_type: 'compare', array: arr, message: `Activity ${i} [${acts[i][0]},${acts[i][1]}]: start ${acts[i][0]} >= lastEnd ${lastEnd}?`, metadata: { activities: acts, selected: [...selected], indices: [i] } };
        if (acts[i][0] >= lastEnd) {
            selected.push(acts[i]); lastEnd = acts[i][1];
            yield { recursion_depth: 0, action_type: 'place', array: arr, message: `Selected activity ${i} [${acts[i][0]},${acts[i][1]}]`, metadata: { activities: acts, selected: [...selected], indices: [i] } };
        } else {
            yield { recursion_depth: 0, action_type: 'skip', array: arr, message: `Skipped activity ${i} — overlaps`, metadata: { activities: acts, selected: [...selected], indices: [i] } };
        }
    }
    yield { recursion_depth: 0, action_type: 'solution', array: arr, message: `Selected ${selected.length} activities`, metadata: { activities: acts, selected, indices: [] } };
}

export const activitySelectionModule: AlgorithmModule = {
    id: "activity-selection", name: "Activity Selection", category: "Greedy",
    description: "Select the maximum number of non-overlapping activities from a set, sorted by finish time.",
    pseudocode: ["sort by finish time", "for each activity:", "  if start >= lastEnd:", "    select it", "    update lastEnd"],
    complexity: { time: "O(n log n)", space: "O(n)" },
    inputConfig: [{ name: "activities", type: "json", label: "Activities [[start,end],...]", defaultValue: "[[1,3],[2,5],[0,6],[5,7],[8,9],[5,9]]" }],
    generateStates: activitySelectionGenerator
};

// Fractional Knapsack
function* fractionalKnapsackGenerator({ items: iStr, capacity: cStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let items: [number, number][];
    let cap: number;
    try { items = JSON.parse(iStr); cap = parseInt(cStr, 10); } catch { items = [[60, 10], [100, 20], [120, 30]]; cap = 50; }
    const ratioItems = items.map(([v, w], i) => ({ v, w, ratio: v / w, idx: i })).sort((a, b) => b.ratio - a.ratio);
    const arr = ratioItems.map(it => it.ratio);
    let remaining = cap; let totalValue = 0;

    yield { recursion_depth: 0, action_type: 'none', array: arr, message: `Fractional Knapsack: capacity=${cap}, ${items.length} items sorted by value/weight ratio`, metadata: { ratioItems, indices: [], remaining, totalValue } };

    for (let i = 0; i < ratioItems.length; i++) {
        const it = ratioItems[i];
        yield { recursion_depth: 0, action_type: 'explore', array: arr, message: `Item ${it.idx}: value=${it.v}, weight=${it.w}, ratio=${it.ratio.toFixed(2)}`, metadata: { ratioItems, indices: [i], remaining, totalValue } };
        if (it.w <= remaining) {
            remaining -= it.w; totalValue += it.v;
            yield { recursion_depth: 0, action_type: 'place', array: arr, message: `Took full item ${it.idx}. Value +${it.v}. Remaining capacity: ${remaining}`, metadata: { ratioItems, indices: [i], remaining, totalValue } };
        } else {
            const frac = remaining / it.w; totalValue += frac * it.v; remaining = 0;
            yield { recursion_depth: 0, action_type: 'place', array: arr, message: `Took ${(frac * 100).toFixed(1)}% of item ${it.idx}. Value +${(frac * it.v).toFixed(2)}`, metadata: { ratioItems, indices: [i], remaining, totalValue } };
            break;
        }
    }
    yield { recursion_depth: 0, action_type: 'solution', array: arr, message: `Total value: ${totalValue.toFixed(2)}`, metadata: { ratioItems, indices: [], remaining, totalValue } };
}

export const fractionalKnapsackModule: AlgorithmModule = {
    id: "fractional-knapsack", name: "Fractional Knapsack", category: "Greedy",
    description: "Maximize value by taking items (or fractions) with the highest value-to-weight ratio.",
    pseudocode: ["sort by value/weight ratio", "for each item:", "  if fits: take all", "  else: take fraction", "  update capacity"],
    complexity: { time: "O(n log n)", space: "O(n)" },
    inputConfig: [
        { name: "items", type: "json", label: "Items [[value,weight],...]", defaultValue: "[[60,10],[100,20],[120,30]]" },
        { name: "capacity", type: "number", label: "Capacity", defaultValue: 50 }
    ],
    generateStates: fractionalKnapsackGenerator
};

// Huffman Coding
function* huffmanGenerator({ frequencies: fStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let freqs: [string, number][];
    try { freqs = JSON.parse(fStr); } catch { freqs = [["a", 5], ["b", 9], ["c", 12], ["d", 13], ["e", 16], ["f", 45]]; }
    const arr = freqs.map(f => f[1]);

    // Min-heap simulation
    let heap = freqs.map(([ch, fr]) => ({ label: ch, freq: fr }));
    heap.sort((a, b) => a.freq - b.freq);

    yield { recursion_depth: 0, action_type: 'none', array: arr, message: `Huffman Coding: ${freqs.length} characters`, metadata: { heap: heap.map(h => ({ ...h })), indices: [] } };

    const merges: string[] = [];
    while (heap.length > 1) {
        const left = heap.shift()!;
        const right = heap.shift()!;
        yield { recursion_depth: 0, action_type: 'compare', array: heap.map(h => h.freq), message: `Merging "${left.label}"(${left.freq}) + "${right.label}"(${right.freq})`, metadata: { heap: heap.map(h => ({ ...h })), indices: [0, 1] } };

        const merged = { label: `(${left.label}+${right.label})`, freq: left.freq + right.freq };
        heap.push(merged);
        heap.sort((a, b) => a.freq - b.freq);
        merges.push(`${left.label}+${right.label}=${merged.freq}`);

        yield { recursion_depth: 0, action_type: 'place', array: heap.map(h => h.freq), message: `Created node "${merged.label}" freq=${merged.freq}`, metadata: { heap: heap.map(h => ({ ...h })), indices: [heap.indexOf(merged)] } };
    }

    yield { recursion_depth: 0, action_type: 'solution', array: [heap[0]?.freq || 0], message: `Huffman tree built. Root freq: ${heap[0]?.freq}. Merges: ${merges.join(' → ')}`, metadata: { heap: heap.map(h => ({ ...h })), indices: [] } };
}

export const huffmanModule: AlgorithmModule = {
    id: "huffman", name: "Huffman Coding", category: "Greedy",
    description: "Build an optimal prefix-free encoding tree by repeatedly merging the two lowest-frequency nodes.",
    pseudocode: ["build min-heap of frequencies", "while heap.size > 1:", "  left = extractMin()", "  right = extractMin()", "  insert(left + right)"],
    complexity: { time: "O(n log n)", space: "O(n)" },
    inputConfig: [{ name: "frequencies", type: "json", label: "Char Frequencies [[char,freq],...]", defaultValue: '[["a",5],["b",9],["c",12],["d",13],["e",16],["f",45]]' }],
    generateStates: huffmanGenerator
};

// Job Scheduling
function* jobSchedulingGenerator({ jobs: jStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let jobs: [string, number, number][]; // [id, deadline, profit]
    try { jobs = JSON.parse(jStr); } catch { jobs = [["J1", 2, 100], ["J2", 1, 19], ["J3", 2, 27], ["J4", 1, 25], ["J5", 3, 15]]; }
    jobs.sort((a, b) => b[2] - a[2]); // Sort by profit descending
    const maxDL = Math.max(...jobs.map(j => j[1]));
    const slots: (string | null)[] = new Array(maxDL).fill(null);
    const arr = jobs.map(j => j[2]);

    yield { recursion_depth: 0, action_type: 'none', array: arr, message: `Job Scheduling: ${jobs.length} jobs, max deadline ${maxDL}`, metadata: { jobs, slots: [...slots], indices: [] } };

    let totalProfit = 0;
    for (let i = 0; i < jobs.length; i++) {
        const [id, dl, profit] = jobs[i];
        yield { recursion_depth: 0, action_type: 'explore', array: arr, message: `Trying job ${id} (profit=${profit}, deadline=${dl})`, metadata: { jobs, slots: [...slots], indices: [i] } };
        let placed = false;
        for (let t = dl - 1; t >= 0; t--) {
            if (slots[t] === null) {
                slots[t] = id; totalProfit += profit; placed = true;
                yield { recursion_depth: 0, action_type: 'place', array: arr, message: `Scheduled ${id} at slot ${t + 1}. Total profit: ${totalProfit}`, metadata: { jobs, slots: [...slots], indices: [i] } };
                break;
            }
        }
        if (!placed) {
            yield { recursion_depth: 0, action_type: 'skip', array: arr, message: `Cannot schedule ${id} — all slots full`, metadata: { jobs, slots: [...slots], indices: [i] } };
        }
    }
    yield { recursion_depth: 0, action_type: 'solution', array: arr, message: `Total profit: ${totalProfit}. Schedule: [${slots.join(', ')}]`, metadata: { jobs, slots: [...slots], indices: [] } };
}

export const jobSchedulingModule: AlgorithmModule = {
    id: "job-scheduling", name: "Job Scheduling", category: "Greedy",
    description: "Schedule jobs to maximize profit, where each job has a deadline and can take one unit of time.",
    pseudocode: ["sort jobs by profit (desc)", "for each job:", "  find latest free slot ≤ deadline", "  if found: schedule it"],
    complexity: { time: "O(n² )", space: "O(n)" },
    inputConfig: [{ name: "jobs", type: "json", label: "Jobs [[id,deadline,profit],...]", defaultValue: '[["J1",2,100],["J2",1,19],["J3",2,27],["J4",1,25],["J5",3,15]]' }],
    generateStates: jobSchedulingGenerator
};
