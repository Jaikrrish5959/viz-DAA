import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { VisualizerPage } from './pages/VisualizerPage';
import { LearnPage } from './pages/LearnPage';
import { ComparePage } from './pages/ComparePage';
import { AboutPage } from './pages/AboutPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/algorithms" element={<LibraryPage />} />
          <Route path="/visualizer/:id" element={<VisualizerPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
