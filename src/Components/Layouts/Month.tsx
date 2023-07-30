import React from 'react';
import { isSameDay, format, maxTime } from 'date-fns';
import chunk from '../../utils/chunk';
import { appointmentMap } from '../data';
import AppointmentWidget from '../EventWidget';
import { getEvents } from '../../utils/schedular';
import { Button } from 'reactstrap';

interface MonthProps {
  monthDates: Date[];
  toggleForm: () => void;
  currentDate: Date;
}

const Month: React.FC<MonthProps> = ({
  monthDates,
  toggleForm,
  currentDate,
}) => {
  const viewAllEvents = (e: any) => {
    e.stopPropagation();
  };

  return (
    <React.Fragment>
      <div>
        <div className="mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="fw-normal">SUN</th>
                <th className="fw-normal">MON</th>
                <th className="fw-normal">TUE</th>
                <th className="fw-normal">WED</th>
                <th className="fw-normal">THU</th>
                <th className="fw-normal">FRI</th>
                <th className="fw-normal">SAT</th>
              </tr>
            </thead>
            <tbody>
              {chunk(monthDates || [], 7).map((chunk, index) => {
                return (
                  <tr key={chunk[0]}>
                    {chunk.map((date, idx) => {
                      const event = getEvents(date);
                      return (
                        <td
                          onClick={toggleForm}
                          className="calendar-td calendar-td-h calendar-td-w text-end"
                          key={date + idx}
                        >
                          <span
                            className={
                              isSameDay(date, currentDate)
                                ? 'p-1 rounded-circle font-size-14 text-white bg-primary'
                                : 'p-1 rounded-circle font-size-14 ms-auto'
                            }
                          >
                            {format(date, 'd')}
                          </span>
                          <div className="text-start">
                            {(event?.events || [])
                              .slice(0, 2)
                              .map((event: any, id: any) => (
                                <AppointmentWidget key={id} item={event} />
                              ))}
                            {event?.events?.length > 2 && (
                              <Button
                                size="sm"
                                color="light"
                                className="w-75 text-start py-1 fs-10"
                                onClick={viewAllEvents}
                              >
                                See more +
                              </Button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Month;
