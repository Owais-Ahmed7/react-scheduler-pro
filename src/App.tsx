import './App.scss';
import { Scheduler } from './lib';
import { generateRandomEvents } from './lib/utils/schedular';

function App() {
  return (
    <div className="App p-2">
      <Scheduler events={generateRandomEvents(250)} />
    </div>
  );
}

export default App;
