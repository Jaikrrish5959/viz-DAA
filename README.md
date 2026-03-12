# DAA Algorithm Visualizer

An interactive, web-based platform for visualizing Design and Analysis of Algorithms (DAA) execution built with React, TypeScript, TailwindCSS v4, and Zustand. 

Focused on real-time, step-by-step visualizations of backtracking algorithms.

## Supported Algorithms

*   **N-Queens (Backtracking):** Visualizes the placement of N queens on an NxN chessboard such that no two queens attack each other.
*   **Rat in a Maze (Backtracking):** Demonstrates pathfinding through a 2D grid maze with walls, plotting the valid route from start to finish.
*   **Combination Sum (Backtracking):** Visualizes the recursive discovery of number combinations that sum up to a specific target value.

## Features

*   **Interactive Playback Controls:** Play, pause, step-forward, step-backward, skip to next solution, and solve instantly.
*   **Dynamic Variable Speed:** Control the animation playback speed in real-time.
*   **Solution Tracking:** Discover and view all valid end-solutions simultaneously in a dedicated modal grid.
*   **Categorized Selection:** Clean categorizations (Backtracking, DP, Graphs, etc.) using native dropdown groupings.
*   **Dynamic Algorithm Configurations:** Change structural variables on the fly (e.g., Chessboard `N` size, custom target sums, custom maze designs).
*   **SVG Path Highlighting:** Clear visual SVG indicators overlaying exact solution routes on top of physical grids.

## Tech Stack

*   **Frontend Framework:** React 18
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (v4)
*   **State Management:** Zustand (for high-performance execution timelines)
*   **Icons:** Lucide React
*   **Animations:** Framer Motion

## Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Jaikrrish5959/viz-DAA.git
    cd viz-DAA
    ```

2.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

3.  Install dependencies:
    ```bash
    npm install
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to `http://localhost:5173`.

## Architecture Overview

The visualization engine is powered by **ES6 Generator Functions**. Each algorithm runs as a background generator (`function*`), `yield`ing discrete `ExecutionState` objects at interesting events (exploring, placing, branching, pruning, solving).

A centralized Zustand `executionStore` manages these states, maintaining a timeline array that allows the React UI to flawlessly scrub forward and backward through the execution history without needing to recompute the algorithm.
