import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
// import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
//import date-fns helpers
import {
  addDays,
  addMonths,
  subDays,
  subMonths,
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  isToday,
  startOfMonth,
  startOfDay,
  endOfDay,
  endOfMonth,
} from 'date-fns';

//utility functions
import useStore from '../hooks/useStore';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const {
    views,
    view,
    selectedDate,
    dispatch,
    message: { month, week, day, today },
    onView,
    locale,
    onNavigate,
  }: any = useStore();
  const SELECTED_DATE = 'selectedDate';

  const handleNext = useCallback(() => {
    let date = null;
    let start = null;
    let end = null;
    if (view === 'month') {
      date = addMonths(selectedDate, 1);
      dispatch(SELECTED_DATE, date);

      const monthStart = startOfMonth(date);
      const weekStart = startOfWeek(monthStart);
      const monthEnd = endOfMonth(date);
      const weekEnd = endOfWeek(monthEnd);

      start = startOfDay(weekStart);
      end = endOfDay(weekEnd);
    } else if (view === 'week') {
      date = addWeeks(selectedDate, 1);
      dispatch('multiDayEventsHFactor', 0);
      dispatch(SELECTED_DATE, date);

      const weekStart = startOfWeek(date);
      const weekEnd = endOfWeek(date);
      start = startOfDay(weekStart);
      end = endOfDay(weekEnd);
    } else if (view === 'day') {
      date = addDays(selectedDate, 1);
      dispatch('multiDayEventsHFactor', 0);
      dispatch(SELECTED_DATE, date);

      start = startOfDay(date);
      end = endOfDay(date);
    }
    onNavigate instanceof Function && onNavigate({ date, start, end, view });
  }, [dispatch, onNavigate, selectedDate, view]);

  const handlePrevios = useCallback(() => {
    let date = null;
    let start = null;
    let end = null;
    if (view === 'month') {
      date = subMonths(selectedDate, 1);
      dispatch(SELECTED_DATE, date);

      const monthStart = startOfMonth(date);
      const weekStart = startOfWeek(monthStart);
      const monthEnd = endOfMonth(date);
      const weekEnd = endOfWeek(monthEnd);

      start = startOfDay(weekStart);
      end = endOfDay(weekEnd);
      start = weekStart;
    } else if (view === 'week') {
      date = subWeeks(selectedDate, 1);
      dispatch('multiDayEventsHFactor', 0);
      dispatch(SELECTED_DATE, date);

      const weekStart = startOfWeek(date);
      const weekEnd = endOfWeek(date);
      start = startOfDay(weekStart);
      end = endOfDay(weekEnd);
    } else if (view === 'day') {
      date = subDays(selectedDate, 1);
      dispatch('multiDayEventsHFactor', 0);
      dispatch(SELECTED_DATE, date);

      start = startOfDay(date);
      end = endOfDay(date);
    }
    onNavigate instanceof Function && onNavigate({ date, start, end, view });
  }, [dispatch, onNavigate, selectedDate, view]);

  const handleTodayDate = useCallback(() => {
    dispatch(SELECTED_DATE, new Date());
  }, [dispatch]);

  const date = () => {
    switch (view) {
      case 'month':
        return format(selectedDate, 'MMMM yyyy', { locale });
      case 'week':
        return (
          format(
            startOfWeek(selectedDate, { weekStartsOn: 0 }),
            'dd MMM yyyy',
            { locale }
          ) +
          ' - ' +
          format(
            addDays(startOfWeek(selectedDate, { weekStartsOn: 0 }), 6),
            'dd MMM yyyy',
            { locale }
          )
        );
      case 'day':
        return format(selectedDate, 'dd MMMM yyyy', { locale });
      default:
        return;
    }
  };

  const changeView = useCallback(
    (view: string) => {
      dispatch('view', view);
      onView instanceof Function && onView({ view });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [view]
  );

  return (
    <React.Fragment>
      <div>
        <div className="align-items-center">
          {/* <div>{title || "Brand Title"}</div> */}
          <div>
            <div className="d-flex justify-content-between">
              <div className="col-12 col-md-6 align-items-center">
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    className="btn btn-sm d-flex align-items-center"
                    onClick={handlePrevios}
                  >
                    <svg
                      className="fs-14 m-auto"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="ArrowBackIosNewIcon"
                      fill="#212529"
                      width={20}
                      height={20}
                    >
                      <path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z"></path>
                    </svg>
                  </button>
                  <span className="mx-3 text-primary text-center">
                    {date()}
                  </span>
                  <button
                    className="btn btn-sm d-flex align-items-center"
                    onClick={handleNext}
                  >
                    <svg
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-1shn170"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="#212529"
                      width={20}
                      height={20}
                    >
                      <path d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"></path>
                    </svg>
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-caret-right"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                    </svg> */}
                  </button>
                </div>
              </div>
              <div className="text-end">
                <div className="d-flex justify-content-center">
                  <div className="ms-3">
                    <button
                      onClick={() => {
                        handleTodayDate();
                      }}
                      className={
                        view === 'day' && isToday(selectedDate)
                          ? 'btn btn-sm btn-light text-primary'
                          : 'btn btn-sm btn-light'
                      }
                    >
                      {today}
                    </button>
                  </div>
                  <div className="d-flex align-items-center">|</div>
                  <div className="ms-3">
                    <div className="btn-group" role="group">
                      {views.includes('day') && (
                        <button
                          onClick={() => changeView('day')}
                          className={
                            view === 'day'
                              ? 'btn btn-sm btn-light text-primary'
                              : 'btn btn-sm btn-light'
                          }
                        >
                          {day}
                        </button>
                      )}
                      {views.includes('week') && (
                        <button
                          onClick={() => changeView('week')}
                          className={
                            view === 'week'
                              ? 'btn btn-sm btn-light text-primary'
                              : 'btn btn-sm btn-light'
                          }
                        >
                          {week}
                        </button>
                      )}
                      {views.includes('month') && (
                        <button
                          onClick={() => changeView('month')}
                          className={
                            view === 'month'
                              ? 'btn btn-sm btn-light text-primary'
                              : 'btn btn-sm btn-light'
                          }
                        >
                          {month}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Header;
