import type { AlgorithmModule, ExecutionState } from '../../types';

// Heap Operations (Build Max Heap + Extract)
function* heapOpsGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [4, 10, 3, 5, 1, 8, 7]; }
    const n = arr.length;

    yield { recursion_depth: 0, action_type: 'none', array: [...arr], message: `Heap Operations: Building max-heap from [${arr.join(', ')}]`, metadata: { indices: [], heapSize: n } };

    function* heapify(size: number, root: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        let largest = root;
        const l = 2 * root + 1, r = 2 * root + 2;
        if (l < size && arr[l] > arr[largest]) largest = l;
        if (r < size && arr[r] > arr[largest]) largest = r;
        if (largest !== root) {
            yield { recursion_depth: 0, action_type: 'compare', array: [...arr], message: `Heapify: arr[${root}]=${arr[root]} < arr[${largest}]=${arr[largest]}`, metadata: { indices: [root, largest], heapSize: size } };
            [arr[root], arr[largest]] = [arr[largest], arr[root]];
            yield { recursion_depth: 0, action_type: 'swap', array: [...arr], message: `Swapped ${arr[largest]} and ${arr[root]}`, metadata: { indices: [root, largest], heapSize: size } };
            yield* heapify(size, largest);
        }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(n, i);
    yield { recursion_depth: 0, action_type: 'place', array: [...arr], message: `Max-heap built: [${arr.join(', ')}]`, metadata: { indices: [], heapSize: n } };

    // Extract max 3 times
    let hs = n;
    for (let k = 0; k < Math.min(3, n); k++) {
        const max = arr[0];
        [arr[0], arr[hs - 1]] = [arr[hs - 1], arr[0]]; hs--;
        yield { recursion_depth: 0, action_type: 'sorted', array: [...arr], message: `Extracted max ${max}`, metadata: { indices: [hs], heapSize: hs } };
        yield* heapify(hs, 0);
    }

    yield { recursion_depth: 0, action_type: 'solution', array: [...arr], message: `Heap operations complete`, metadata: { indices: [], heapSize: hs } };
}

export const heapOpsModule: AlgorithmModule = {
    id: "heap-ops", name: "Heap Operations", category: "Data Structures",
    description: "Demonstrates building a max-heap and extracting the maximum element. Shows heapify-up and heapify-down operations.",
    pseudocode: ["buildMaxHeap:", "  for i from n/2-1 to 0:", "    heapify(n, i)", "extractMax:", "  swap root with last", "  heapify(size-1, 0)"],
    complexity: { time: "O(n log n)", space: "O(1)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[4,10,3,5,1,8,7]" }],
    generateStates: heapOpsGenerator
};

// Union Find
function* unionFindGenerator({ operations: oStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let ops: [string, number, number][];
    try { ops = JSON.parse(oStr); } catch { ops = [["union", 0, 1], ["union", 2, 3], ["find", 0, 0], ["union", 1, 2], ["find", 0, 3], ["union", 4, 5], ["find", 4, 5]]; }

    const n = 10;
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);

    yield { recursion_depth: 0, action_type: 'none', array: [...parent], message: `Union-Find: ${ops.length} operations on ${n} elements`, metadata: { parent: [...parent], rank: [...rank], indices: [] } };

    function find(x: number): number {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    }

    for (const [op, a, b] of ops) {
        if (op === "union") {
            const ra = find(a), rb = find(b);
            yield { recursion_depth: 0, action_type: 'explore', array: [...parent], message: `Union(${a}, ${b}): roots are ${ra} and ${rb}`, metadata: { parent: [...parent], rank: [...rank], indices: [a, b] } };
            if (ra !== rb) {
                if (rank[ra] < rank[rb]) parent[ra] = rb;
                else if (rank[ra] > rank[rb]) parent[rb] = ra;
                else { parent[rb] = ra; rank[ra]++; }
                yield { recursion_depth: 0, action_type: 'place', array: [...parent], message: `Merged set of ${a} and ${b}`, metadata: { parent: [...parent], rank: [...rank], indices: [a, b] } };
            } else {
                yield { recursion_depth: 0, action_type: 'skip', array: [...parent], message: `${a} and ${b} already in same set`, metadata: { parent: [...parent], rank: [...rank], indices: [a, b] } };
            }
        } else {
            const ra = find(a), rb = find(b);
            yield { recursion_depth: 0, action_type: 'compare', array: [...parent], message: `Find(${a})=${ra}, Find(${b})=${rb}. ${ra === rb ? 'Same set' : 'Different sets'}`, metadata: { parent: [...parent], rank: [...rank], indices: [a, b] } };
        }
    }

    yield { recursion_depth: 0, action_type: 'solution', array: [...parent], message: `Final parent array: [${parent.join(', ')}]`, metadata: { parent: [...parent], rank: [...rank], indices: [] } };
}

export const unionFindModule: AlgorithmModule = {
    id: "union-find", name: "Union Find", category: "Data Structures",
    description: "Disjoint Set Union with union by rank and path compression. Supports union and find operations.",
    pseudocode: ["find(x): path compression", "union(a,b):", "  ra = find(a), rb = find(b)", "  merge by rank"],
    complexity: { time: "O(α(n))", space: "O(n)" },
    inputConfig: [{ name: "operations", type: "json", label: "Ops [[op,a,b],...]", defaultValue: '[["union",0,1],["union",2,3],["find",0,0],["union",1,2],["find",0,3]]' }],
    generateStates: unionFindGenerator
};

// Segment Tree (Build + Range Query)
function* segTreeGenerator({ array: aStr }: any): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
    let arr: number[];
    try { arr = JSON.parse(aStr); } catch { arr = [1, 3, 5, 7, 9, 11]; }
    const n = arr.length;
    const tree = new Array(4 * n).fill(0);

    yield { recursion_depth: 0, action_type: 'none', array: [...arr], message: `Segment Tree: array=[${arr.join(', ')}]`, metadata: { tree: [...tree], indices: [] } };

    // Build with yields
    function* buildGen(node: number, start: number, end: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, void, unknown> {
        if (start === end) {
            tree[node] = arr[start];
            yield { recursion_depth: depth, action_type: 'place', array: [...arr], message: `Leaf: tree[${node}] = arr[${start}] = ${arr[start]}`, metadata: { tree: [...tree], indices: [start] } };
            return;
        }
        const mid = Math.floor((start + end) / 2);
        yield { recursion_depth: depth, action_type: 'explore', array: [...arr], message: `Building node ${node} for range [${start},${end}]`, metadata: { tree: [...tree], indices: [] } };
        yield* buildGen(2 * node, start, mid, depth + 1);
        yield* buildGen(2 * node + 1, mid + 1, end, depth + 1);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
        yield { recursion_depth: depth, action_type: 'update', array: [...arr], message: `tree[${node}] = ${tree[2 * node]} + ${tree[2 * node + 1]} = ${tree[node]}`, metadata: { tree: [...tree], indices: [] } };
    }

    yield* buildGen(1, 0, n - 1, 0);

    // Query sum [1, 3]
    const ql = 1, qr = Math.min(3, n - 1);
    function* queryGen(node: number, start: number, end: number, l: number, r: number, depth: number): Generator<Omit<ExecutionState, 'step_id' | 'algorithm'>, number, unknown> {
        if (r < start || end < l) {
            yield { recursion_depth: depth, action_type: 'skip', array: [...arr], message: `Node ${node} [${start},${end}] outside query [${l},${r}]`, metadata: { tree: [...tree], indices: [] } };
            return 0;
        }
        if (l <= start && end <= r) {
            yield { recursion_depth: depth, action_type: 'found', array: [...arr], message: `Node ${node} [${start},${end}] fully inside query. Sum=${tree[node]}`, metadata: { tree: [...tree], indices: [] } };
            return tree[node];
        }
        const mid = Math.floor((start + end) / 2);
        yield { recursion_depth: depth, action_type: 'explore', array: [...arr], message: `Node ${node} [${start},${end}] partially overlaps [${l},${r}]`, metadata: { tree: [...tree], indices: [] } };
        const left: number = yield* queryGen(2 * node, start, mid, l, r, depth + 1);
        const right: number = yield* queryGen(2 * node + 1, mid + 1, end, l, r, depth + 1);
        return left + right;
    }

    const result: number = yield* queryGen(1, 0, n - 1, ql, qr, 0);
    yield { recursion_depth: 0, action_type: 'solution', array: [...arr], message: `Query sum([${ql},${qr}]) = ${result}. Tree root = ${tree[1]}`, metadata: { tree: [...tree], indices: [] } };
}

export const segTreeModule: AlgorithmModule = {
    id: "segment-tree", name: "Segment Tree", category: "Data Structures",
    description: "Build a segment tree for range sum queries. Demonstrates recursive build and range query operations.",
    pseudocode: ["build(node, start, end):", "  if leaf: tree[node] = arr[start]", "  else: build children", "  tree[node] = left + right", "query(node, l, r):", "  if outside: return 0", "  if inside: return tree[node]", "  else: query children"],
    complexity: { time: "O(n) build, O(log n) query", space: "O(n)" },
    inputConfig: [{ name: "array", type: "json", label: "Input Array", defaultValue: "[1,3,5,7,9,11]" }],
    generateStates: segTreeGenerator
};
