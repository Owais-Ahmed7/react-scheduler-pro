import React from 'react';
import moment from 'moment';
import _ from 'lodash';

const Month = (props) => {
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
              {_.chunk(props.dates || [], 7).map((chunk) => {
                return (
                  <tr key={chunk[0]}>
                    {chunk.map((date, idx) => (
                      <td
                        onClick={props.toggle}
                        className='calendar-td calendar-td-h calendar-td-w pe-auto'
                        key={date + idx}
                      >
                        <span
                          className={
                            moment(date).format('DD-MM-YYYY') ===
                            moment(props.currentDate).format('DD-MM-YYYY')
                              ? 'p-1 ps-2 pe-2 rounded-circle font-size-14 text-white bg-primary'
                              : 'p-1 rounded-circle font-size-14'
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
