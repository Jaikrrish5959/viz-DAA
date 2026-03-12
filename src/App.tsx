import { useEffect, useState } from 'react';
import { useExecutionStore } from './state/executionStore';
import { nQueensModule } from './algorithms/backtracking/nQueens';
import { ratMazeModule, generateRandomMazeString } from './algorithms/backtracking/ratMaze';
import { combinationSumModule } from './algorithms/backtracking/combinationSum';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { AlgorithmConfigPanel } from './components/AlgorithmConfigPanel';
import { ControlPanel } from './components/ControlPanel';
import { SolutionsModal } from './components/SolutionsModal';
import { BacktrackingBoard } from './visualizers/BacktrackingBoard';
import { CombinationBoard } from './visualizers/CombinationBoard';
import { Activity, ListRestart } from 'lucide-react';

const algorithms = [nQueensModule, ratMazeModule, combinationSumModule];

function App() {
  const { algorithm, states, solutions, currentStepIndex, isPlaying, nextStep, speedMs, setAlgorithm } = useExecutionStore();

  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('');
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Playback Loop
  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      interval = window.setInterval(() => {
        nextStep();
      }, speedMs);
    }
    return () => {
      if (interval !== null) window.clearInterval(interval);
    };
  }, [isPlaying, speedMs, nextStep]);

  const currentState = states[currentStepIndex];

  const selectedAlgo = algorithms.find(a => a.id === selectedAlgoId);

  const handleAlgoSelect = (id: string) => {
    setSelectedAlgoId(id);
    const algo = algorithms.find(a => a.id === id);
    if (algo?.inputConfig) {
      const defaultInputs: Record<string, any> = {};
      algo.inputConfig.forEach(def => {
        // Evaluate dynamic defaults if necessary
        if (id === 'rat-maze' && def.name === 'mazeStr') {
          defaultInputs[def.name] = generateRandomMazeString(5);
        } else {
          defaultInputs[def.name] = def.defaultValue;
        }
      });
      setInputValues(defaultInputs);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  const handleExecute = () => {
    if (selectedAlgo) {
      setAlgorithm(selectedAlgo, inputValues);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-8 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <header className="mb-10 flex items-center justify-between border-b border-app-border pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
              <Activity className="text-primary-500" size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-outfit font-semibold !m-0 tracking-tight flex items-center gap-2">
              DAA
              <span className="text-white/40 font-light">|</span>
              <span className="text-primary-400">Visualizer</span>
            </h1>
          </div>
          <p className="text-gray-400 font-inter text-sm md:text-base">
            Interactive Design and Analysis of Algorithms execution platform.
          </p>
        </div>

        {solutions.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600/10 hover:bg-primary-600/20 border border-primary-500/30 text-primary-400 rounded-lg font-medium transition-colors"
          >
            <ListRestart size={18} />
            View Solutions ({solutions.length})
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col md:flex-row gap-8">
        {/* Left Column: Config and Controls */}
        <div className="md:w-[400px] flex flex-col gap-6 shrink-0">
          <AlgorithmSelector
            algorithms={algorithms}
            selectedId={selectedAlgoId}
            onSelect={handleAlgoSelect}
          />

          <AlgorithmConfigPanel
            algorithm={selectedAlgo}
            inputValues={inputValues}
            onInputChange={handleInputChange}
            onExecute={handleExecute}
            isRunning={isPlaying}
          />

          {algorithm && (
            <div className="bg-app-surface p-6 rounded-2xl border border-app-border">
              <h3 className="font-outfit text-xl font-medium mb-3 text-white">Algorithm Details</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                {algorithm.description}
              </p>

              <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 font-mono text-xs overflow-hidden">
                <div className="text-gray-500 mb-2 uppercase tracking-wide">Pseudocode</div>
                {algorithm.pseudocode.map((line, i) => (
                  <div key={i} className="text-gray-300 ml-2 py-0.5" style={{ paddingLeft: `${(line.match(/^\s*/)?.[0].length || 0)}ch` }}>
                    {line.trim()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visualization Box */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 border border-app-border rounded-3xl bg-[#0d0d0f] relative overflow-hidden flex flex-col shadow-2xl">
            {/* Top Bar inside Visualizer */}
            <div className="h-14 border-b border-gray-800/60 bg-black/40 backdrop-blur-md px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-sm font-mono text-gray-500">
                {algorithm ? `${algorithm.id} execution` : 'No loaded module'}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 p-6 md:p-10 flex items-center justify-center overflow-auto min-h-[400px]">
              {algorithm ? (
                algorithm.id === 'combination-sum' ? (
                  <CombinationBoard state={currentState} />
                ) : (algorithm.id === 'n-queens' || algorithm.id === 'rat-maze') ? (
                  <BacktrackingBoard
                    state={currentState}
                    n={currentState?.board?.length || 8}
                  />
                ) : null
              ) : (
                <div className="text-gray-600 font-outfit text-xl flex flex-col items-center">
                  <Activity size={48} className="mb-4 text-gray-800" />
                  Select an algorithm to begin visualization.
                </div>
              )}
            </div>
          </div>

          <ControlPanel />
        </div>
      </main>

      <SolutionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        n={currentState?.board?.length || 8}
      />
    </div>
  );
}

export default App;
