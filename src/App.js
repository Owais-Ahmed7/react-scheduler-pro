import logo from "./logo.svg";
import "./App.scss";
import Schedular from "./Components";
import { Container } from "reactstrap";

function App() {
  return (
    <div className="App">
      <Container className="p-5" fluid='md'>
        <Schedular />
      </Container>
    </div>
  );
}

export default App;
