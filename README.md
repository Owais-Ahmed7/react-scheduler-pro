# React Scheduler Pro Component

## Installation

```jsx
npm i react-scheduler-pro
```

or

```jsx
yarn add react-scheduler-pro
```

## Usage

```jsx
import { Scheduler } from "react-scheduler-pro";
```

## Example

```jsx
function App() {
  const evs = [
    {
      _id: 1122,
      name: 'abc event',
      startDate: new Date(
        new Date(new Date(new Date().setHours(1))).setDate(12)
      ),
      endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(15)),
      resourceId: 2,
      backgroundColor: '#FFA447',
      isAllDay: true,
    },
    {
      _id: 1123,
      name: 'xyz event',
      startDate: new Date(
        new Date(new Date(new Date().setHours(1))).setDate(13)
      ),
      endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(31)),
      resourceId: 1,
      backgroundColor: '#0079FF',
    },
  ];

  const [events, setEvents] = useState<any[]>(evs);
  const resources = [
    { resourceId: 1, backgroundColor: '#0079FF', title: 'Board room' },
    { resourceId: 2, backgroundColor: '#FFA447', title: 'Training room' }];

  return (
    <div className="App p-2">
      <Scheduler
        schedulerHeight={500}
        startHour={0}
        endHour={23}
        step={60}
        locale={hi}
        timezone={'Asia/Karachi'}
        resources={resources}
        events={events}
        resourceFields={{
          id: 'resourceId',
          title: 'title',
          backgroundColor: 'backgroundColor',
        }}
        fields={{
          id: '_id',
          subject: 'name',
          start: 'startDate',
          end: 'endDate',
          backgroundColor: 'backgroundColor',
          resourceId: 'resourceId',
        }}
        selectedDate={new Date()}
        views={['day', 'week', 'month]}
        view={'day'}
      />
    </div>
  );
}
```

## Documenation

[![Documenatation](https://img.shields.io/twitter/url?label=%40aldabil&style=social&url=https%3A%2F%2Ftwitter.com%2Fintent%2Ffollow%3Fscreen_name%3Daldabil21)](https://twitter.com/intent/follow?screen_name=aldabil21)
