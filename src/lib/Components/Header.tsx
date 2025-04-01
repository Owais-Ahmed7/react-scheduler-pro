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

import { view } from '../types';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const {
    views,
    view,
    selectedDate,
    dispatch,
    message,
    onView,
    locale,
    onNavigate,
    weekDays,
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
    } else if (view === 'week' || view === 'workweek') {
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
    } else if (view === 'week' || view === 'workweek') {
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
      case 'workweek':
        const workweekDays = weekDays?.workweek;
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
        const firstDay = addDays(weekStart, workweekDays[0]);
        const lastDay = addDays(
          weekStart,
          workweekDays[workweekDays.length - 1]
        );
        return (
          format(firstDay, 'dd MMM yyyy', { locale }) +
          ' - ' +
          format(lastDay, 'dd MMM yyyy', { locale })
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
    [view]
  );

  return (
    <React.Fragment>
      <div>
        <div className="align-items-center">
          {/* <div>{title || "Brand Title"}</div> */}
          <div>
            <div className="row justify-content-center">
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
                      className="fs-14 m-auto"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="ArrowForwardIosIcon"
                      fill="#212529"
                      width={20}
                      height={20}
                    >
                      <path d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="col-12 col-md-6 align-items-center text-end">
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
                      {message.today}
                    </button>
                  </div>
                  <div className="d-flex align-items-center">|</div>
                  <div className="ms-3">
                    <div className="btn-group" role="group">
                      {views.map((v: view) => (
                        <button
                          key={v}
                          onClick={() => changeView(v)}
                          className={
                            view === v
                              ? 'btn btn-sm btn-light text-primary'
                              : 'btn btn-sm btn-light'
                          }
                        >
                          {message[v]}
                        </button>
                      ))}
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
