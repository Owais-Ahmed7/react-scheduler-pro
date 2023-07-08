import React from 'react';
import moment from 'moment';
import chunk from '../../utils/chunk';

interface MonthProps {
    monthDates: string[];
    toggleForm: () => void;
    currentDate: string;
}

const Month: React.FC<MonthProps> = ({ monthDates, toggleForm, currentDate }) => {
  return (
    <React.Fragment>
      <div>
        <div className='mt-3'>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th className='fw-normal'>SUN</th>
                <th className='fw-normal'>MON</th>
                <th className='fw-normal'>TUE</th>
                <th className='fw-normal'>WED</th>
                <th className='fw-normal'>THU</th>
                <th className='fw-normal'>FRI</th>
                <th className='fw-normal'>SAT</th>
              </tr>
            </thead>
            <tbody>
              {chunk(monthDates || [], 7).map((chunk) => {
                return (
                  <tr key={chunk[0]}>
                    {chunk.map((date, idx) => (
                      <td
                        onClick={toggleForm}
                        className='calendar-td calendar-td-h calendar-td-w text-end'
                        key={date + idx}
                      >
                        <span
                          className={
                            moment(date).format('DD-MM-YYYY') ===
                            moment(currentDate).format('DD-MM-YYYY')
                              ? 'p-1 rounded-circle font-size-14 text-white bg-primary'
                              : 'p-1 rounded-circle font-size-14 ms-auto'
                          }
                        >
                          {moment(date).format('D')}
                        </span>
                      </td>
                    ))}
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
