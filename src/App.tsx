import './App.scss';
import { Scheduler } from './lib';
import {
  onDeleteEventType,
  onDoubleClickEventType,
  onEditEventType,
  onSlotType,
} from './lib/types';
import { generateRandomEvents } from './lib/utils/schedular';
import { useState } from 'react';

function App() {
  const resources = [
    { _id: 1, backgroundColor: '#0079FF', title: 'Board room' },
    { _id: 2, backgroundColor: '#FFA447', title: 'Training room' },
    { _id: 3, backgroundColor: '#F31559', title: 'Meeting room 1' },
    { _id: 4, backgroundColor: '#65C18C', title: 'Meeting room 2' },
  ];

  const [events, setEvents] = useState<
    {
      _id: number;
      name: string;
      startDate: Date;
      endDate: Date;
      backgroundColor?: string;
      resourceId?: string | number;
      allDay?: string;
    }[]
  >(generateRandomEvents(500));

  const [timezone, setTimezone] = useState('Canada/Atlantic');
  return (
    <div className="App p-2">
      <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
        <option>Canada/Atlantic</option>
        <option>Europe/Moscow</option>
        <option>Australia/Hobart</option>
        <option>Asia/Karachi</option>
      </select>
      <Scheduler
        schedulerHeight={500}
        startHour={0}
        endHour={23}
        step={30}
        hourFormat={12}
        timezone={timezone}
        events={events}
        fields={{
          id: '_id',
          subject: 'name',
          start: 'startDate',
          end: 'endDate',
          backgroundColor: 'backgroundColor',
          allDay: 'allDay',
          resourceId: 'resourceId',
        }}
        // resources={resources}
        resourceFields={{
          id: '_id',
          title: 'title',
          backgroundColor: 'backgroundColor',
        }}
        message={{
          today: 'آج',
          month: 'مہینہ',
          week: 'ہفتہ',
          day: 'دن',
          more: 'مزید',
        }}
        // selectedDate={new Date(2004, 7, 16)}
        views={['day', 'week']}
        onSlot={(props: onSlotType) => {
          const event = {
            _id: Math.random(),
            name: 'Hello',
            startDate: props.start,
            endDate: props.end,
            resourceId: props.resource?._id,
            // allDay: true,
            backgroundColor: '#1d1d1d',
          };
          console.log(event, 'event');

          setEvents((evs) => [...evs, event]);
        }}
        // onClickEvent={(props: onClickEventType) => console.log(props, 'props')}
        onDoubleClickEvent={(props: onDoubleClickEventType) =>
          console.log(props, 'props')
        }
        onEditEvent={(props: onEditEventType) => console.log(props, 'props')}
        onDeleteEvent={(props: onDeleteEventType) =>
          console.log(props, 'props')
        }
      />
    </div>
  );
}

export default App;
