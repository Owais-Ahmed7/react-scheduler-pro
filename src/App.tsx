import { useState } from 'react';
import './App.scss';
import { Scheduler } from './lib';
// import { div, Form, Row, h6, input, div, button } from 'reactstrap';

import 'flatpickr/dist/themes/material_green.css';

import Flatpickr from 'react-flatpickr';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import { addMinutes } from 'date-fns';
import { generateRandomEvents, getTimeZonedDate } from './lib/utils/schedular';
import { ar, enUS } from 'date-fns/locale';
import {
  allEventsPopoverType,
  eventFormContextType,
  eventItemType,
  eventPopoverType,
  onDeleteType,
  onDoubleClickType,
  onNavigateType,
  onSlotType,
  onViewType,
} from './lib/types';

const EventFormContext = ({
  event,
  events,
  resource,
  toggleForm,
  setEvents,
  start,
  end,
}: any) => {
  console.log(start, 'start');
  console.log(end, 'end');

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: event ? event.name : '',
      startDate: event ? event.startDate : start, //getTimeZonedDate(start, 'Asia/Karachi'),
      endDate: event ? event.endDate : end, //getTimeZonedDate(end, 'Asia/Karachi'),
      resourceId: event ? event.resourceId : resource?.resourceId,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please Enter Title'),
      startDate: Yup.date().required('Please Select Start Date'),
      endDate: Yup.date().required('Please Select End Date'),
    }),
    onSubmit: (values) => {
      const checkInterval =
        values.startDate.getTime() > values.endDate.getTime();

      if (checkInterval) {
        validation.setFieldError('startDate', 'Invalid interval');
        validation.setFieldError('endDate', 'Invalid interval');
        return;
      }
      const colors: any = {
        1: '#0079FF',
        2: '#FFA447',
        3: '#F31559',
        4: '#65C18C',
      };

      const backgroundColor = colors[values.resourceId];

      if (event) {
        const evnts = [...events];
        const index = evnts.findIndex((ev) => ev._id === event._id);
        evnts[index] = { ...event, ...values };
        setEvents(evnts);
      } else {
        setEvents((prevValue: any[]) => [
          ...prevValue,
          { _id: uuid(), ...values, backgroundColor },
        ]);
        console.log({ _id: uuid(), ...values, backgroundColor });
      }
      toggleForm();
    },
  });

  return (
    <>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            // toggle();
            return false;
          }}
          className="needs-validation"
          action="#"
        >
          <div className="row">
            <div className="mb-5 col-12">
              <div>
                <h6>Title</h6>
                <input
                  type="text"
                  name="name"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.name || ''}
                />
              </div>
              {validation.touched.name && validation.errors.name ? (
                <div>{/* <div>{validation.errors.name}</div> */}</div>
              ) : null}
            </div>
            <div className="col-12 col-md-6">
              <h6>Start</h6>
              <div>
                <Flatpickr
                  name="startDate"
                  value={validation.values.startDate || ''}
                  onChange={([e]: any) => {
                    validation.setFieldValue('startDate', e);
                  }}
                  options={{
                    enableTime: true,
                    dateFormat: 'd M, Y G:i:S K',
                    // minDate: new Date(reportDate.start),
                  }}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <h6>End</h6>
              <div>
                <Flatpickr
                  name="startDate"
                  value={validation.values.endDate || ''}
                  onChange={([e]: any) => {
                    validation.setFieldValue('endDate', e);
                  }}
                  options={{
                    enableTime: true,
                    dateFormat: 'd M, Y G:i:S K',
                    // minDate: new Date(reportDate.start),
                  }}
                />
              </div>
            </div>
            <div className="mt-5 col-12">
              <button color="btn btn-sm" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

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
    {
      _id: 1124,
      name: 'birthday party',
      startDate: new Date(
        new Date(new Date(new Date().setHours(1))).setDate(15)
      ),
      endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(18)),
      resourceId: 1,
      backgroundColor: '#0079FF',
    },
    {
      _id: 1125,
      name: 'ijk event',
      startDate: new Date(
        new Date(new Date(new Date().setHours(1))).setDate(15)
      ),
      endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(18)),
      resourceId: 2,
      backgroundColor: '#FFA447',
    },
    {
      _id: 1126,
      name: 'study',
      startDate: new Date(
        new Date(new Date(new Date().setHours(1))).setDate(5)
      ),
      endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(5)),
      resourceId: 2,
      backgroundColor: '#FFA447',
    },
    {
      _id: 1127,
      name: 'fire range practice',
      startDate: new Date(
        new Date(new Date(new Date().setHours(1))).setDate(20)
      ),
      endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(20)),
      resourceId: 2,
      backgroundColor: '#FFA447',
      isAllDay: true,
    },
    {
      _id: 1128,
      name: 'bike riding',
      startDate: new Date(
        new Date(new Date(new Date().setHours(1))).setDate(8)
      ),
      endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(8)),
      resourceId: 2,
      backgroundColor: '#FFA447',
      isAllDay: true,
    },
    {
      _id: 1129,
      name: 'study',
      startDate: new Date(
        new Date(new Date(new Date().setHours(1))).setDate(25)
      ),
      endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(25)),
      resourceId: 3,
      backgroundColor: '#F31559',
      isAllDay: true,
    },
    {
      _id: 1,
      name: 'subject 55',
      startDate: new Date(new Date(new Date().setHours(15)).setMinutes(30)),
      endDate: new Date(new Date().setHours(16)),
      resourceId: 3,
      backgroundColor: '#F31559',
    },
    {
      _id: 2,
      name: 'subject 44',
      startDate: new Date(new Date().setHours(2)),
      endDate: new Date(new Date().setHours(4)),
      resourceId: 3,
      backgroundColor: '#F31559',
    },
    {
      _id: 3,
      name: 'subject 33',
      startDate: new Date(new Date().setHours(2)),
      endDate: new Date(new Date().setHours(3)),
      resourceId: 3,
      backgroundColor: '#F31559',
    },
    {
      _id: 4,
      name: 'subject',
      startDate: new Date(new Date().setHours(2)),
      endDate: new Date(new Date().setHours(3)),
      resourceId: 4,
      backgroundColor: '#65C18C',
    },
    {
      _id: 5,
      name: 'subject',
      startDate: new Date(new Date().setHours(2)),
      endDate: new Date(new Date().setHours(3)),
      resourceId: 4,
      backgroundColor: '#65C18C',
    },
    {
      _id: 6,
      name: 'subject',
      startDate: new Date(new Date().setHours(3)),
      endDate: new Date(new Date().setHours(4)),
      resourceId: 4,
      backgroundColor: '#65C18C',
    },
    {
      _id: 7,
      name: 'subject',
      startDate: new Date(new Date().setHours(3)),
      endDate: new Date(new Date().setHours(4)),
      resourceId: 4,
      backgroundColor: '#65C18C',
    },
    {
      _id: 8,
      name: 'subject',
      startDate: new Date(new Date().setHours(3)),
      endDate: new Date(new Date().setHours(4)),
      resourceId: 4,
      backgroundColor: '#65C18C',
    },

    {
      _id: 9,
      name: 'subject test',
      startDate: new Date(new Date(new Date().setHours(8)).setMinutes(0)),
      endDate: new Date(new Date().setHours(9)),
      resourceId: 1,
      backgroundColor: '#0079FF',
    },
    {
      _id: 10,
      name: 'subject',
      startDate: new Date(new Date().setHours(2)),
      endDate: new Date(new Date().setHours(3)),
      resourceId: 2,
      backgroundColor: '#FFA447',
      isAllDay: true,
    },
    {
      _id: 11,
      name: 'subject 22',
      startDate: new Date(new Date().setHours(3)),
      endDate: new Date(new Date().setHours(4)),
      resourceId: 3,
      backgroundColor: '#F31559',
      isAllDay: true,
    },
    {
      _id: 12,
      name: 'subject',
      startDate: new Date(new Date().setHours(3)),
      endDate: new Date(new Date().setHours(4)),
      resourceId: 4,
      backgroundColor: '#65C18C',
      isAllDay: true,
    },
    {
      _id: 14,
      name: 'hiking',
      startDate: new Date(new Date().setHours(4)),
      endDate: new Date(new Date().setHours(5)),
      resourceId: 2,
      backgroundColor: '#FFA447',
    },
    {
      _id: 13,
      name: 'travleing',
      startDate: new Date(new Date(new Date().setHours(3)).setDate(15)),
      endDate: new Date(new Date(new Date().setHours(4)).setDate(15)),
      resourceId: 1,
      backgroundColor: '#0079FF',
      isAllDay: true,
    },
  ];

  const [events, setEvents] = useState<any[]>(evs);
  const resources = [
    { resourceId: 1, backgroundColor: '#0079FF', title: 'Board room' },
    { resourceId: 2, backgroundColor: '#FFA447', title: 'Training room' },
    { resourceId: 3, backgroundColor: '#F31559', title: 'Meeting room 1' },
    { resourceId: 4, backgroundColor: '#65C18C', title: 'Meeting room 2' },
  ];

  const [timezone, setTimezone] = useState('Asia/Karachi');
  const [view, setView] = useState('day');

  return (
    <div className="App p-2">
      <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
        <option>Canada/Atlantic</option>
        <option>Europe/Moscow</option>
        <option>Australia/Hobart</option>
        <option>Asia/Karachi</option>
      </select>
      {/* <Container className="p-5" fluid="md"> */}
      <Scheduler
        // schedulerHeight={500}
        // startHour={0}
        // endHour={23}
        // step={60}
        // hourFormat={24}
        // locale={enUS}
        // timezone={timezone}
        // modalSize={'lg'}
        resources={resources}
        resourceFields={{
          id: 'resourceId',
          title: 'title',
          backgroundColor: 'backgroundColor',
        }}
        events={generateRandomEvents(1000)}
        // onDoubleClick={(props: onDoubleClickType) =>
        //   console.log(props, 'double click props')
        // }
        // onSlot={(props: onSlotType) => console.log(props, 'slot clicked')}
        // fields={{
        //   id: '_id',
        //   subject: 'name',
        //   start: 'startDate',
        //   end: 'endDate',
        //   backgroundColor: 'backgroundColor',
        //   resourceId: 'resourceId',
        //   allDay: 'isAllDay',
        // }}
        // message={{
        //   today: 'آج',
        //   month: 'مہینہ',
        //   week: 'ہفتہ',
        //   day: 'دن',
        //   more: 'مزید',
        // }}
        // selectedDate={new Date()}
        // // onView={({ view }: onViewType) => {
        // //   setView(view);
        // // }}
        // views={['day', 'week', 'month']}
        // view={view}
        // onNavigate={(props: onNavigateType) => {
        //   console.log(props, 'props on navigate');
        // }}
        // onDeleteEvent={({ event }: onDeleteType) => {
        //   let evnts = [...events];
        //   evnts = evnts.filter((e) => e._id !== event._id);
        //   setEvents(evnts);
        // }}
        // eventTemplate={(props: eventItemType) => <div>{props.event.name}</div>}
        // allEventsPopoverTemplate={({
        //   date,
        //   events,
        //   view,
        //   togglePopover,
        // }: allEventsPopoverType) => <div>hello</div>}
        // resourceTemplate={({ resource }: any) => (
        //   <div
        //     style={{
        //       backgroundColor: resource.backgroundColor,
        //       height: '100%',
        //       color: 'white',
        //       fontWeight: '900',
        //       display: 'flex',
        //       alignItems: 'center',
        //       justifyContent: 'center',
        //     }}
        //   >
        //     {resource.title}1
        //   </div>
        // )}
        // eventFormContext={({
        //   toggle,
        //   start,
        //   end,
        //   event,
        //   resource,
        // }: eventFormContextType) => (
        //   <EventFormContext
        //     toggleForm={toggle}
        //     setEvents={setEvents}
        //     start={start}
        //     end={end}
        //     event={event}
        //     resource={resource}
        //     events={events}
        //   />
        // )}
        // eventPopoverTemplate={({ event, togglePopover }: eventPopoverType) => {
        //   return (
        //     <div className="d-flex justify-content-between">
        //       <div className="text-dark">{event.name}</div>
        //       <div
        //         onClick={(e) => {
        //           // e.stopPropagation();
        //           togglePopover();
        //         }}
        //         className="btn btn-sm btn-secondary"
        //       >
        //         X
        //       </div>
        //     </div>
        //   );
        // }}
      />
      {/* </Container> */}
    </div>
  );
}

export default App;

// [
//   {
//     _id: 1122,
//     name: 'abc event',
//     startDate: new Date(
//       new Date(new Date(new Date().setHours(1))).setDate(12)
//     ),
//     endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(15)),
//   },
//   {
//     _id: 1123,
//     name: 'xyz event',
//     startDate: new Date(
//       new Date(new Date(new Date().setHours(1))).setDate(13)
//     ),
//     endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(31)),
//   },
//   {
//     _id: 1124,
//     name: 'birthday party',
//     startDate: new Date(
//       new Date(new Date(new Date().setHours(1))).setDate(15)
//     ),
//     endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(18)),
//   },
//   {
//     _id: 1125,
//     name: 'ijk event',
//     startDate: new Date(
//       new Date(new Date(new Date().setHours(1))).setDate(15)
//     ),
//     endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(18)),
//   },
//   {
//     _id: 1126,
//     name: 'study',
//     startDate: new Date(
//       new Date(new Date(new Date().setHours(1))).setDate(5)
//     ),
//     endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(5)),
//   },
//   {
//     _id: 1127,
//     name: 'fire range practice',
//     startDate: new Date(
//       new Date(new Date(new Date().setHours(1))).setDate(20)
//     ),
//     endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(20)),
//   },
//   {
//     _id: 1128,
//     name: 'bike riding',
//     startDate: new Date(
//       new Date(new Date(new Date().setHours(1))).setDate(8)
//     ),
//     endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(8)),
//   },
//   {
//     _id: 1129,
//     name: 'study',
//     startDate: new Date(
//       new Date(new Date(new Date().setHours(1))).setDate(25)
//     ),
//     endDate: new Date(new Date(new Date(new Date().setHours(5))).setDate(25)),
//   },
//   {
//     _id: 1,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(1)),
//     endDate: new Date(new Date().setHours(5)),
//   },
//   {
//     _id: 2,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(2)),
//     endDate: new Date(new Date().setHours(4)),
//   },
//   {
//     _id: 3,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(2)),
//     endDate: new Date(new Date().setHours(3)),
//   },
//   {
//     _id: 4,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(2)),
//     endDate: new Date(new Date().setHours(3)),
//   },
//   {
//     _id: 5,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(2)),
//     endDate: new Date(new Date().setHours(3)),
//   },
//   {
//     _id: 6,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(3)),
//     endDate: new Date(new Date().setHours(4)),
//   },
//   {
//     _id: 7,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(3)),
//     endDate: new Date(new Date().setHours(4)),
//   },
//   {
//     _id: 8,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(3)),
//     endDate: new Date(new Date().setHours(4)),
//   },

//   {
//     _id: 9,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(2)),
//     endDate: new Date(new Date().setHours(3)),
//   },
//   {
//     _id: 10,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(2)),
//     endDate: new Date(new Date().setHours(3)),
//   },
//   {
//     _id: 11,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(3)),
//     endDate: new Date(new Date().setHours(4)),
//   },
//   {
//     _id: 12,
//     name: 'subject',
//     startDate: new Date(new Date().setHours(3)),
//     endDate: new Date(new Date().setHours(4)),
//   },
//   {
//     _id: 14,
//     name: 'hiking',
//     startDate: new Date(new Date().setHours(4)),
//     endDate: new Date(new Date().setHours(5)),
//   },
//   {
//     _id: 13,
//     name: 'travleing',
//     startDate: new Date(new Date(new Date().setHours(3)).setDate(15)),
//     endDate: new Date(new Date(new Date().setHours(4)).setDate(15)),
//   },
// ]
