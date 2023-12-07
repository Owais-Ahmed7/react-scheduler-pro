import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getAppointmentsByDates } from '../Components/data';
// import AppointmentWidget from './AppointmentWidget';
import { eachMinuteOfInterval, format } from 'date-fns';
import {
  CELL_HEIGHT,
  DEFAULT_SHEDULAR_HEIGHT,
} from '../helpers/constants/schedular';
import { enUS } from 'date-fns/locale';
import useStore from '../hooks/useStore';

import RenderEvents from '../Components/RenderEvents';
import { filterMultiDaySlot } from '../utils/schedular';

interface Props {
  // setIsAppointInfo: Dispatch<SetStateAction<boolean>>;
  // isAppointInfo: boolean;
  events: any[];
  day: Date;
  toggleForm: () => void;
  setDateTime: Dispatch<SetStateAction<{ date: Date; time: string }>>;
}

const Day = ({
  // setIsAppointInfo,
  // isAppointInfo,
  day,
  toggleForm,
  setDateTime,
  events,
  ...rest
}: Props) => {
  const { startHour: START_HOUR, endHour: END_HOUR, step } = useStore();
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [multiDayEvents, setMultiDayEvents] = useState<any[]>([]);

  useEffect(() => {
    // Get references to the content wrap and time cells wrap
    const contentWrap = document.querySelector('.e-content-wrap');
    const timeCellsWrap = document.querySelector('.e-time-cells-wrap');
    // Add a scroll event listener to the content wrap
    contentWrap?.addEventListener('scroll', function () {
      // Get the current scroll position of the content wrap
      const scrollTop = contentWrap.scrollTop;

      // Set the scroll position of the time cells wrap to match the content wrap
      timeCellsWrap?.scrollTo(0, scrollTop);
    });
  }, []);

  const hours = eachMinuteOfInterval(
    {
      start: new Date(new Date().setHours(START_HOUR)).setMinutes(0),
      end: new Date(new Date().setHours(END_HOUR)).setMinutes(0),
    },
    { step }
  );

  useEffect(() => {
    const filterEvents = getAppointmentsByDates(day, events);
    const todayMulti = filterMultiDaySlot(events, day, 'enUS');
    setMultiDayEvents(todayMulti);
    setTodayEvents(filterEvents);
  }, [day, events]);

  // const todayEvents = useRef<any[]>([]);
  // const getEvents = useCallback(() => {
  //   todayEvents.current = getAppointmentsByDates(day, events);
  // }, [day, events]);

  // useEffect(() => {
  //   getEvents();
  // }, [getEvents]);

  return (
    <React.Fragment>
      <div className="w-100">
        <div id="day-layout-table" className="mt-3">
          <table className="table table-bordered mb-0">
            <tbody style={{ height: 'calc(100vh - 150px)', overflow: 'auto' }}>
              <tr>
                <td className="fw-normal text-center align-middle day-time-w"></td>
                <td className="fw-normal text-center py-0 fs-8 align-middle text-primary day-block-w">
                  {format(day, 'EEEE')}
                </td>
              </tr>
              <tr className="fs-10">
                <td className="p-0">
                  <div
                    className="e-time-cells-wrap overflow-hidden"
                    style={{ height: DEFAULT_SHEDULAR_HEIGHT }}
                  >
                    <table className="table mb-0">
                      <tbody>
                        {(hours || []).map((time, idx) => (
                          <tr key={`${time}-${idx}`}>
                            <td
                              key={time.toISOString() + idx}
                              style={{ height: CELL_HEIGHT }}
                              className="calendar-td calendar-td-w text-nowrap day-time-w fs-8 py-0 align-middle"
                            >
                              {format(time, 'h:mm a', { locale: enUS })}
                            </td>
                          </tr>
                        ))}
                        <div>
                          {(multiDayEvents || []).map((e, idx) => {
                            return (
                              <div
                                key={e._id}
                                className="d-flex flex-wrap e-appointment p-1"
                                style={{
                                  // top: `${top}px`,
                                  // left: `${left}%`, //computeLeft
                                  // height: `${height}px`,
                                  // width: `${width}%`,
                                  backgroundColor: 'rgb(196, 48, 129)',
                                }}
                                role="button"
                                data-id={`appointment-${idx}`}
                              >
                                <h1 className="fs-12 mb-0">{e.name}</h1>
                                <time className="fs-12">
                                  <span>
                                    {format(new Date(e.startDate), 'hh:mm a')}
                                  </span>
                                  <span className="mx-1">-</span>
                                  <span>
                                    {format(new Date(e.endDate), 'hh:mm a')}
                                  </span>
                                </time>
                              </div>
                            );
                          })}
                        </div>
                      </tbody>
                    </table>
                  </div>
                </td>

                <td className="p-0">
                  <div
                    className="e-content-wrap position-relative"
                    style={{ height: DEFAULT_SHEDULAR_HEIGHT }}
                  >
                    <table className="table schedule-content-table">
                      <thead>
                        <tr>
                          <td
                            className="e-day-wrapper w-100 p-0"
                            data-date=""
                            data-group-index="0"
                          >
                            <div
                              className="e-appointment-wrapper"
                              id="e-appointment-wrapper-0"
                            >
                              <RenderEvents day={day} events={todayEvents} />
                            </div>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {(hours || []).map((time, idx) => (
                          <tr key={`${time}-${idx}`}>
                            <td
                              key={time.toISOString() + idx}
                              style={{ height: CELL_HEIGHT }}
                              className="calendar-td calendar-td-w day-time-w font-size-14"
                            ></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Day;
