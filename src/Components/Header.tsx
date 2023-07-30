import React, { Dispatch, SetStateAction, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from 'reactstrap';
//import date-fns helpers
import { addDays, addMonths, subDays, subMonths, format } from 'date-fns';

//utility functions
import { getDay, getWeekDates, getMonthDates } from '../utils/schedular';

interface HeaderProps {
  layout: string;
  setLayout: Dispatch<SetStateAction<string>>;
  trackMonth: Date;
  setTrackMonth: Dispatch<SetStateAction<Date>>;
  weekDates: Date[];
  day: Date;
  setDay: Dispatch<SetStateAction<Date>>;
  setMonthDates: Dispatch<SetStateAction<Date[]>>;
  setWeekDates: Dispatch<SetStateAction<Date[]>>;
}

const Header: React.FC<HeaderProps> = ({
  layout,
  setTrackMonth,
  trackMonth,
  weekDates,
  day,
  setDay,
  setLayout,
  setMonthDates,
  setWeekDates,
}) => {
  const handleNext = () => {
    if (layout === 'month') {
      const addMonth = addMonths(trackMonth, 1);
      setTrackMonth(addMonth);
      const dates = getMonthDates(addMonth, 'next');
      setMonthDates(dates);
    } else if (layout === 'week') {
      const dates = getWeekDates(
        addDays(weekDates[weekDates.length - 1], 1),
        'next'
      );
      setWeekDates(dates);
    } else if (layout === 'day') {
      const date = getDay(day, 'next');
      setDay(date);
    }
  };

  const handlePrevios = () => {
    if (layout === 'month') {
      const subMonth = subMonths(trackMonth, 1);
      setTrackMonth(subMonth);
      const dates = getMonthDates(subMonth, 'prev');
      setMonthDates(dates);
    } else if (layout === 'week') {
      const dates = getWeekDates(subDays(weekDates[0], 1), 'prev');
      setWeekDates(dates);
    } else if (layout === 'day') {
      const date = getDay(day, 'prev');
      setDay(date);
    }
  };

  const handleTodayDate = () => {
    setDay(new Date());
  };

  const currentMonth = () => {
    switch (layout) {
      case 'month':
        return format(trackMonth, 'MMMM yyyy');
      case 'week':
        return format(weekDates[0], 'MMMM yyyy');
      case 'day':
        return format(day, 'dd MMMM yyyy');
      default:
        return;
    }
  };

  /* settings dropdown */
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  /* filter appointments by doctor */
  const [filterDropdown, setFilterDropdown] = useState(false);
  const toggleFilterDropdown = () => setFilterDropdown(!filterDropdown);

  return (
    <React.Fragment>
      <div>
        <Row className="align-items-center">
          {/* <div>{title || "Brand Title"}</div> */}
          <Col className="mb-3" xs={12} md={6}>
            <Dropdown
              isOpen={filterDropdown}
              toggle={toggleFilterDropdown}
              direction={'down'}
            >
              <DropdownToggle size="sm" outline color="primary" caret>
                Filter Appointments
              </DropdownToggle>
              <DropdownMenu>hello</DropdownMenu>
            </Dropdown>
          </Col>
          <Col xs={12} md={6}>
            <Row>
              <Col xs={12} md={12} lg={4} className="mb-3 align-items-center">
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    className="btn btn-sm btn-light pe-auto"
                    onClick={handlePrevios}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-caret-left"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                    </svg>
                  </button>
                  <span className="ms-3 me-3 text-nowrap font-size-14 text-center">
                    {currentMonth()}
                  </span>
                  <button
                    className="btn btn-sm btn-light pe-auto"
                    onClick={handleNext}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-caret-right"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                    </svg>
                  </button>
                </div>
              </Col>
              <Col xs={12} md={12} lg={4} className="mb-3">
                <div className="d-flex justify-content-center">
                  <div className="ms-3">
                    <button
                      onClick={() => {
                        setLayout('day');
                        handleTodayDate();
                      }}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Today
                    </button>
                  </div>
                  <div className="ms-3">
                    <div className="btn-group" role="group">
                      <button
                        onClick={() => setLayout('day')}
                        style={{
                          backgroundColor: layout === 'day' ? '#1e90ff' : '',
                          color: layout === 'day' ? '#FFF' : '',
                        }}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Day
                      </button>
                      <button
                        onClick={() => setLayout('week')}
                        style={{
                          backgroundColor: layout === 'week' ? '#1e90ff' : '',
                          color: layout === 'week' ? '#FFF' : '',
                        }}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Week
                      </button>
                      <button
                        onClick={() => setLayout('month')}
                        style={{
                          backgroundColor: layout === 'month' ? '#1e90ff' : '',
                          color: layout === 'month' ? '#FFF' : '',
                        }}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Month
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col className="mb-3 text-center" xs={12} md={12} lg={4}></Col>
            </Row>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Header;
