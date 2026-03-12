import type { AlgorithmModule } from '../types';
// Backtracking
import { nQueensModule } from '../algorithms/backtracking/nQueens';
import { ratMazeModule } from '../algorithms/backtracking/ratMaze';
import { combinationSumModule } from '../algorithms/backtracking/combinationSum';
import { sudokuModule } from '../algorithms/backtracking/sudoku';
import { permutationsModule } from '../algorithms/backtracking/permutations';
import { subsetsModule } from '../algorithms/backtracking/subsets';
import { graphColoringModule } from '../algorithms/backtracking/graphColoring';
import { hamiltonianModule } from '../algorithms/backtracking/hamiltonian';
import { subsetSumModule } from '../algorithms/backtracking/subsetSum';
// DP
import { knapsack01Module } from '../algorithms/dp/knapsack01';
import { coinChangeModule } from '../algorithms/dp/coinChange';
import { lcsModule } from '../algorithms/dp/lcs';
import { matrixChainModule } from '../algorithms/dp/matrixChain';
import { lisModule } from '../algorithms/dp/lis';
import { editDistanceModule } from '../algorithms/dp/editDistance';
import { fibonacciModule } from '../algorithms/dp/fibonacci';
import { optimalBSTModule } from '../algorithms/dp/optimalBST';
// Sorting
import { bubbleSortModule } from '../algorithms/sorting/bubbleSort';
import { selectionSortModule } from '../algorithms/sorting/selectionSort';
import { insertionSortModule } from '../algorithms/sorting/insertionSort';
import { mergeSortModule } from '../algorithms/sorting/mergeSort';
import { quickSortModule } from '../algorithms/sorting/quickSort';
import { heapSortModule } from '../algorithms/sorting/heapSort';
import { bucketSortModule } from '../algorithms/sorting/bucketSort';
// Graph
import { bfsModule, dfsModule, dijkstraModule, bellmanFordModule, primModule, kruskalModule, topoSortModule, floydWarshallModule, fordFulkersonModule, bipartiteMatchingModule, kosarajuModule } from '../algorithms/graph';
// Greedy
import { activitySelectionModule, fractionalKnapsackModule, huffmanModule, jobSchedulingModule } from '../algorithms/greedy';
// String
import { kmpModule, rabinKarpModule, zAlgorithmModule, boyerMooreModule } from '../algorithms/string';
// B&B
import { bnbKnapsackModule, tspModule } from '../algorithms/bnb';
// DS
import { heapOpsModule, unionFindModule, segTreeModule } from '../algorithms/ds';
// D&C
import { binarySearchModule, quickSelectModule, kadaneModule, closestPairModule, convexHullModule, karatsubaModule } from '../algorithms/dnc';

export const allAlgorithms: AlgorithmModule[] = [
    nQueensModule, ratMazeModule, combinationSumModule, sudokuModule, permutationsModule, subsetsModule, graphColoringModule, hamiltonianModule, subsetSumModule,
    knapsack01Module, coinChangeModule, lcsModule, matrixChainModule, lisModule, editDistanceModule, fibonacciModule, optimalBSTModule,
    bubbleSortModule, selectionSortModule, insertionSortModule, mergeSortModule, quickSortModule, heapSortModule, bucketSortModule,
    bfsModule, dfsModule, dijkstraModule, bellmanFordModule, primModule, kruskalModule, topoSortModule, floydWarshallModule, fordFulkersonModule, bipartiteMatchingModule, kosarajuModule,
    activitySelectionModule, fractionalKnapsackModule, huffmanModule, jobSchedulingModule,
    kmpModule, rabinKarpModule, zAlgorithmModule, boyerMooreModule,
    bnbKnapsackModule, tspModule,
    heapOpsModule, unionFindModule, segTreeModule,
    binarySearchModule, quickSelectModule, kadaneModule, closestPairModule, convexHullModule, karatsubaModule,
];

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface AlgorithmMeta {
    difficulty: Difficulty;
    applications: string[];
    commonMistakes?: string[];
    examples?: { input: string; output: string }[];
}

export const algorithmMeta: Record<string, AlgorithmMeta> = {
    'n-queens': { difficulty: 'Medium', applications: ['Constraint satisfaction', 'Chess AI', 'Scheduling'], commonMistakes: ['Forgetting diagonal checks', 'Not backtracking properly'] },
    'rat-maze': { difficulty: 'Medium', applications: ['Robot pathfinding', 'Maze generation', 'Puzzle games'], commonMistakes: ['Not marking visited cells', 'Missing diagonal walls'] },
    'combination-sum': { difficulty: 'Medium', applications: ['Financial planning', 'Subset selection', 'Resource allocation'] },
    'sudoku': { difficulty: 'Hard', applications: ['Puzzle solvers', 'Constraint propagation', 'Logic games'], commonMistakes: ['Not checking 3x3 box constraint', 'Infinite recursion without base case'] },
    'permutations': { difficulty: 'Medium', applications: ['Anagram generation', 'Password cracking', 'Combinatorics'] },
    'subsets': { difficulty: 'Easy', applications: ['Power set generation', 'Feature selection', 'Combination problems'] },
    'graph-coloring': { difficulty: 'Hard', applications: ['Map coloring', 'Register allocation', 'Scheduling'], commonMistakes: ['Not checking all adjacent vertices'] },
    'hamiltonian': { difficulty: 'Hard', applications: ['Circuit design', 'DNA sequencing', 'Logistics routing'] },
    'subset-sum': { difficulty: 'Medium', applications: ['Cryptography', 'Resource allocation', 'Decision problems'], commonMistakes: ['Not pruning when sum exceeds target'] },
    'knapsack01': { difficulty: 'Medium', applications: ['Resource allocation', 'Portfolio optimization', 'Cargo loading'] },
    'coin-change': { difficulty: 'Medium', applications: ['Currency exchange', 'Vending machines', 'Financial systems'] },
    'lcs': { difficulty: 'Medium', applications: ['Diff tools', 'DNA analysis', 'Version control'], commonMistakes: ['Confusing subsequence with substring'] },
    'matrix-chain': { difficulty: 'Hard', applications: ['Compiler optimization', 'Query planning', 'Scientific computing'] },
    'lis': { difficulty: 'Medium', applications: ['Patience sorting', 'Stock analysis', 'Scheduling'] },
    'edit-distance': { difficulty: 'Medium', applications: ['Spell checkers', 'DNA alignment', 'NLP'], commonMistakes: ['Off-by-one errors in base cases'] },
    'fibonacci': { difficulty: 'Easy', applications: ['Algorithm introduction', 'Growth modeling', 'Teaching DP'], commonMistakes: ['Forgetting memoization leads to O(2^n)'] },
    'optimal-bst': { difficulty: 'Hard', applications: ['Database indexing', 'Compiler symbol tables', 'Huffman-like encodings'] },
    'bubble-sort': { difficulty: 'Easy', applications: ['Teaching tool', 'Small datasets', 'Nearly sorted data'] },
    'selection-sort': { difficulty: 'Easy', applications: ['Small datasets', 'Memory-constrained systems'] },
    'insertion-sort': { difficulty: 'Easy', applications: ['Nearly sorted data', 'Online sorting', 'Small datasets'] },
    'merge-sort': { difficulty: 'Medium', applications: ['External sorting', 'Linked lists', 'Stable sorting needed'], commonMistakes: ['Not handling odd-length splits'] },
    'quick-sort': { difficulty: 'Medium', applications: ['General-purpose sorting', 'In-place sorting', 'Cache-friendly'], commonMistakes: ['Poor pivot selection causing O(n²)'] },
    'heap-sort': { difficulty: 'Medium', applications: ['Priority queues', 'OS scheduling', 'Top-K problems'] },
    'bucket-sort': { difficulty: 'Easy', applications: ['Uniformly distributed data', 'Floating point sorting', 'Radix sort subroutine'] },
    'bfs': { difficulty: 'Easy', applications: ['Shortest path in unweighted graphs', 'Social networks', 'Web crawlers'] },
    'dfs': { difficulty: 'Easy', applications: ['Maze solving', 'Topological sort', 'Cycle detection'] },
    'dijkstra': { difficulty: 'Medium', applications: ['Google Maps', 'Network routing', 'GPS navigation'], commonMistakes: ['Using with negative weights'] },
    'bellman-ford': { difficulty: 'Medium', applications: ['Negative weight graphs', 'Arbitrage detection', 'Distance vector routing'] },
    'prim': { difficulty: 'Medium', applications: ['Network design', 'Cable laying', 'Clustering'] },
    'kruskal': { difficulty: 'Medium', applications: ['Network design', 'Image segmentation', 'Clustering'] },
    'topo-sort': { difficulty: 'Easy', applications: ['Build systems', 'Task scheduling', 'Course prerequisites'] },
    'floyd-warshall': { difficulty: 'Medium', applications: ['Network routing', 'Transitive closure', 'All-pairs shortest path'], commonMistakes: ['Forgetting to initialize diagonal to 0'] },
    'ford-fulkerson': { difficulty: 'Hard', applications: ['Network flow', 'Bipartite matching', 'Circulation problems'], commonMistakes: ['Not updating residual graph correctly'] },
    'bipartite-matching': { difficulty: 'Hard', applications: ['Job assignment', 'Stable matching', 'Resource allocation'] },
    'kosaraju': { difficulty: 'Hard', applications: ['Compiler optimization', 'Social network analysis', '2-SAT solver'] },
    'activity-selection': { difficulty: 'Easy', applications: ['Meeting scheduling', 'Job scheduling', 'Resource management'] },
    'fractional-knapsack': { difficulty: 'Easy', applications: ['Investment allocation', 'Loading cargo', 'Bandwidth allocation'] },
    'huffman': { difficulty: 'Medium', applications: ['File compression (ZIP, GZIP)', 'Data transmission', 'Image coding'] },
    'job-scheduling': { difficulty: 'Medium', applications: ['Operating systems', 'Manufacturing', 'Project management'] },
    'kmp': { difficulty: 'Hard', applications: ['Text editors (Find)', 'DNA search', 'Intrusion detection'], commonMistakes: ['Building LPS array incorrectly'] },
    'rabin-karp': { difficulty: 'Medium', applications: ['Plagiarism detection', 'Multiple pattern search', 'DNA matching'] },
    'z-algorithm': { difficulty: 'Hard', applications: ['Pattern matching', 'String compression', 'Bioinformatics'] },
    'boyer-moore': { difficulty: 'Hard', applications: ['Text editors', 'grep implementation', 'Network packet inspection'], commonMistakes: ['Incorrect bad character shift calculation'] },
    'bnb-knapsack': { difficulty: 'Hard', applications: ['Optimized resource allocation', 'Combinatorial optimization'] },
    'tsp': { difficulty: 'Hard', applications: ['Delivery routing', 'PCB drilling', 'Genome sequencing'] },
    'heap-ops': { difficulty: 'Medium', applications: ['Priority queues', 'Median finding', 'Event-driven simulation'] },
    'union-find': { difficulty: 'Medium', applications: ['Network connectivity', 'Kruskal\'s MST', 'Social network groups'] },
    'segment-tree': { difficulty: 'Hard', applications: ['Range queries', 'Competitive programming', 'Database indexing'] },
    'binary-search': { difficulty: 'Easy', applications: ['Searching sorted data', 'Database lookup', 'Binary search trees'] },
    'quick-select': { difficulty: 'Medium', applications: ['Median finding', 'Order statistics', 'Percentile computation'] },
    'kadane': { difficulty: 'Easy', applications: ['Stock trading', 'Signal processing', 'Image processing'] },
    'closest-pair': { difficulty: 'Medium', applications: ['Computational geometry', 'Collision detection', 'Geographic analysis'] },
    'convex-hull': { difficulty: 'Hard', applications: ['Computer graphics', 'Path planning', 'Image processing'] },
    'karatsuba': { difficulty: 'Medium', applications: ['Big number libraries', 'Cryptography', 'Scientific computing'] },
};

export const categoryColors: Record<string, { bg: string; text: string; border: string; hex: string; icon: string; gradient: string }> = {
    'Backtracking': { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', hex: '#A78BFA', icon: '🔙', gradient: 'from-violet-900/20 via-transparent to-purple-900/10' },
    'Dynamic Programming': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', hex: '#60A5FA', icon: '📊', gradient: 'from-blue-900/20 via-transparent to-indigo-900/10' },
    'Sorting': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', hex: '#FBBF24', icon: '📶', gradient: 'from-amber-900/20 via-transparent to-yellow-900/10' },
    'Graph Algorithms': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', hex: '#22D3EE', icon: '🕸️', gradient: 'from-cyan-900/20 via-transparent to-blue-900/10' },
    'Greedy': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', hex: '#34D399', icon: '🎯', gradient: 'from-emerald-900/20 via-transparent to-green-900/10' },
    'String Matching': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', hex: '#F472B6', icon: '🔤', gradient: 'from-pink-900/20 via-transparent to-rose-900/10' },
    'Branch and Bound': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', hex: '#FB923C', icon: '✂️', gradient: 'from-orange-900/20 via-transparent to-red-900/10' },
    'Data Structures': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', hex: '#2DD4BF', icon: '🏗️', gradient: 'from-teal-900/20 via-transparent to-cyan-900/10' },
    'Divide and Conquer': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', hex: '#818CF8', icon: '🔀', gradient: 'from-indigo-900/20 via-transparent to-purple-900/10' },
};

export const difficultyColors: Record<Difficulty, string> = {
    'Easy': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    'Medium': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    'Hard': 'text-red-400 bg-red-500/10 border-red-500/30',
};

export const categoryDescriptions: Record<string, { tagline: string; description: string; whenToUse: string }> = {
    'Backtracking': { tagline: 'Explore all possibilities', description: 'Systematically build candidates and abandon partial candidates (backtrack) as soon as they cannot lead to a valid solution.', whenToUse: 'Constraints satisfaction, puzzles, combinatorial problems, permutations' },
    'Dynamic Programming': { tagline: 'Optimize with memory', description: 'Break problems into overlapping subproblems and store their results to avoid redundant computation.', whenToUse: 'Optimal substructure, overlapping subproblems, counting problems' },
    'Sorting': { tagline: 'Order from chaos', description: 'Arrange elements in a specific order. Different algorithms trade off time, space, and stability.', whenToUse: 'Data organization, preprocessing for binary search, database indexing' },
    'Graph Algorithms': { tagline: 'Navigate networks', description: 'Traverse, search, and find optimal paths in graph structures representing relationships.', whenToUse: 'Networks, routing, social graphs, dependency resolution' },
    'Greedy': { tagline: 'Best local choice', description: 'Make the locally optimal choice at each step, hoping to find a global optimum.', whenToUse: 'Scheduling, resource allocation, where greedy choice property holds' },
    'String Matching': { tagline: 'Find the pattern', description: 'Efficiently search for patterns within text using preprocessing to avoid redundant comparisons.', whenToUse: 'Text search, DNA analysis, data validation' },
    'Branch and Bound': { tagline: 'Smart exhaustive search', description: 'Explore the solution space systematically, pruning branches that cannot lead to better solutions.', whenToUse: 'Combinatorial optimization, NP-hard problems with good bounds' },
    'Data Structures': { tagline: 'Organize efficiently', description: 'Specialized structures that enable efficient operations like queries, updates, and unions.', whenToUse: 'Range queries, disjoint sets, priority management' },
    'Divide and Conquer': { tagline: 'Split and conquer', description: 'Break a problem into smaller subproblems, solve each recursively, then combine the results.', whenToUse: 'Searching, sorting, computational geometry, matrix operations' },
};
