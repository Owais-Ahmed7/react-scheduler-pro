import './App.scss';
import Schedular from './Components';
import { Container } from 'reactstrap';

function App() {
  return (
    <div className="App">
      <Container className="p-5" fluid="md">
        <Schedular
          startTime={'10:00 AM'}
          endTime={'8:00 PM'}
          timeDifference={[]}
          fontSize={'9'}
          colorTheme={'primary'}
          layouts={['day', 'week', 'month']}
          data={[]}
          EventFormContext={<EventFormContext />}
        />
      </Container>
    </div>
  );
}

const EventFormContext = () => {
  return (
    <>
      <div>Yallah Habibi how are you</div>
    </>
  );
};

export default App;
