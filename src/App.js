import './App.css';
import Visualizer from './components/Visualizer';

function App() {
  return (
    <div className='App'>
      <h1>
        <i className='bi bi-bar-chart-line-fill' style={{ padding: 10 }}></i>
        Sorting Visualizer
      </h1>
      <Visualizer />
    </div>
  );
}

export default App;
