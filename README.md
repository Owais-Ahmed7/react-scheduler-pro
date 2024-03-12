# React Scheduler Pro

React Scheduler Pro is a lightweight and powerful event Calender. React Scheduler Pro – your essential toolkit for effortlessly managing schedules and events within your React applications.

## Installation

```jsx
npm i react-scheduler-pro
```

or

```jsx
yarn add react-scheduler-pro
```

## Documenation

[Documenatation](https://react-scheduler-pro.vercel.app/docs)

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

  return (
    <div className="App p-2">
      <Scheduler
        events={events}
        fields={{
          id: '_id',
          subject: 'name',
          start: 'startDate',
          end: 'endDate',
          allDay: 'isAllDay',
        }}
      />
    </div>
  );
}
```
