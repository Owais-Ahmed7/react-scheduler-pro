# React Scheduler Pro

React Scheduler Pro is a lightweight and powerful event Calender. React Scheduler Pro – your essential toolkit for effortlessly managing schedules and events within your React applications.

## Demo

[Example](https://react-scheduler-pro.vercel.app/examples/simple)

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
      _id: 36,
      name: 'Owais',
      startDate: new Date(
        new Date(new Date(new Date().setHours(1))).setDate(12)
      ),
      endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(15)),
      resourceId: 2,
      backgroundColor: '#FFA447',
      isAllDay: true,
    },
    {
      _id: 47,
      name: 'B',
      startDate: new Date(
        new Date(new Date(new Date().setHours(1))).setDate(13)
      ),
      endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(31)),
      resourceId: 1,
      backgroundColor: '#0079FF',
    },
  ];
  const [events, setEvents] = useState<
    {
      _id: number;
      name: string;
      startDate: Date;
      endDate: Date;
      backgroundColor?: string;
      resourceId?: string | number;
      isAllDay?: boolean;
    }[]
  >(evs);

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
