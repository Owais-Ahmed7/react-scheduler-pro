import './App.scss';
import Schedular from './Components';
import { Container } from 'reactstrap';

function App() {
  return (
    <div className="App p-2">
      {/* <Container className="p-5" fluid="md"> */}
      <Schedular
        events={[
          {
            _id: 1122,
            name: 'Zia wedding',
            startDate: new Date(
              new Date(new Date(new Date().setHours(1))).setDate(12)
            ),
            endDate: new Date(
              new Date(new Date(new Date().setHours(5))).setDate(13)
            ),
          },
          {
            _id: 1123,
            name: 'Saqib wedding',
            startDate: new Date(
              new Date(new Date(new Date().setHours(1))).setDate(13)
            ),
            endDate: new Date(
              new Date(new Date(new Date().setHours(5))).setDate(31)
            ),
          },
          {
            _id: 1124,
            name: 'birthday party',
            startDate: new Date(
              new Date(new Date(new Date().setHours(1))).setDate(15)
            ),
            endDate: new Date(
              new Date(new Date(new Date().setHours(5))).setDate(18)
            ),
          },
          {
            _id: 1125,
            name: 'Saad Wedding',
            startDate: new Date(
              new Date(new Date(new Date().setHours(1))).setDate(15)
            ),
            endDate: new Date(
              new Date(new Date(new Date().setHours(5))).setDate(18)
            ),
          },
          {
            _id: 1126,
            name: 'walima',
            startDate: new Date(
              new Date(new Date(new Date().setHours(1))).setDate(5)
            ),
            endDate: new Date(
              new Date(new Date(new Date().setHours(5))).setDate(5)
            ),
          },
          {
            _id: 1127,
            name: 'mayuu',
            startDate: new Date(
              new Date(new Date(new Date().setHours(1))).setDate(20)
            ),
            endDate: new Date(
              new Date(new Date(new Date().setHours(5))).setDate(20)
            ),
          },
          {
            _id: 1128,
            name: 'bharat',
            startDate: new Date(
              new Date(new Date(new Date().setHours(1))).setDate(8)
            ),
            endDate: new Date(
              new Date(new Date(new Date().setHours(5))).setDate(8)
            ),
          },
          {
            _id: 1129,
            name: 'walima',
            startDate: new Date(
              new Date(new Date(new Date().setHours(1))).setDate(25)
            ),
            endDate: new Date(
              new Date(new Date(new Date().setHours(5))).setDate(25)
            ),
          },
          // {
          //   _id: 1,
          //   name: '1',
          //   startDate: new Date(new Date().setHours(1)),
          //   endDate: new Date(new Date().setHours(5)),
          // },
          // {
          //   _id: 2,
          //   name: '2',
          //   startDate: new Date(new Date().setHours(2)),
          //   endDate: new Date(new Date().setHours(4)),
          // },
          // {
          //   _id: 3,
          //   name: '3',
          //   startDate: new Date(new Date().setHours(2)),
          //   endDate: new Date(new Date().setHours(3)),
          // },
          // {
          //   _id: 4,
          //   name: '4',
          //   startDate: new Date(new Date().setHours(2)),
          //   endDate: new Date(new Date().setHours(3)),
          // },
          // {
          //   _id: 5,
          //   name: '5',
          //   startDate: new Date(new Date().setHours(2)),
          //   endDate: new Date(new Date().setHours(3)),
          // },
          // {
          //   _id: 6,
          //   name: '6',
          //   startDate: new Date(new Date().setHours(3)),
          //   endDate: new Date(new Date().setHours(4)),
          // },
          // {
          //   _id: 7,
          //   name: '7',
          //   startDate: new Date(new Date().setHours(3)),
          //   endDate: new Date(new Date().setHours(4)),
          // },
          // {
          //   _id: 8,
          //   name: '8',
          //   startDate: new Date(new Date().setHours(3)),
          //   endDate: new Date(new Date().setHours(4)),
          // },

          // {
          //   _id: 9,
          //   name: '9',
          //   startDate: new Date(new Date().setHours(2)),
          //   endDate: new Date(new Date().setHours(3)),
          // },
          // {
          //   _id: 10,
          //   name: '10',
          //   startDate: new Date(new Date().setHours(2)),
          //   endDate: new Date(new Date().setHours(3)),
          // },
          // {
          //   _id: 11,
          //   name: '11',
          //   startDate: new Date(new Date().setHours(3)),
          //   endDate: new Date(new Date().setHours(4)),
          // },
          // {
          //   _id: 12,
          //   name: '12',
          //   startDate: new Date(new Date().setHours(3)),
          //   endDate: new Date(new Date().setHours(4)),
          // },
          {
            _id: 14,
            name: 'hiking',
            startDate: new Date(new Date().setHours(4)),
            endDate: new Date(new Date().setHours(5)),
          },
          {
            _id: 13,
            name: 'travleing',
            startDate: new Date(new Date(new Date().setHours(3)).setDate(15)),
            endDate: new Date(new Date(new Date().setHours(4)).setDate(15)),
          },
        ]}
        startHour={0}
        endHour={23}
        idFieldName="id"
        startDateFieldName="startDate"
        endDateFieldName="endDate"
        timeDifference={[]}
        fontSize={'9'}
        colorTheme={'primary'}
        layouts={['day', 'week', 'month']}
        data={[]}
        EventFormContext={<EventFormContext />}
      />
      {/* </Container> */}
    </div>
  );
}

const EventFormContext = () => {
  return (
    <>
      <div>Make your form according to you own will : )</div>
    </>
  );
};

export default App;
