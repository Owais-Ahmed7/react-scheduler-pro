import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import LiveRegion from './LiveRegion';
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
  } = useStore();
  const SELECTED_DATE = 'selectedDate';

  const handleNext = useCallback(() => {
    let date = null;
    let start = null;
    let end = null;
    if (view === 'month') {
      date = addMonths(selectedDate, 1);

      const monthStart = startOfMonth(date);
      const weekStart = startOfWeek(monthStart);
      const monthEnd = endOfMonth(date);
      const weekEnd = endOfWeek(monthEnd);

      start = startOfDay(weekStart);
      end = endOfDay(weekEnd);
    } else if (view === 'week' || view === 'workweek') {
      date = addWeeks(selectedDate, 1);
      dispatch('multiDayEventsHFactor', 0);

      const weekStart = startOfWeek(date);
      const weekEnd = endOfWeek(date);
      start = startOfDay(weekStart);
      end = endOfDay(weekEnd);
    } else if (view === 'day') {
      date = addDays(selectedDate, 1);
      dispatch('multiDayEventsHFactor', 0);

      start = startOfDay(date);
      end = endOfDay(date);
    }
    // Always dispatch - the provider will ignore it if selectedDate is controlled
    dispatch(SELECTED_DATE, date);
    onNavigate instanceof Function && onNavigate({ date, start, end, view });
  }, [dispatch, onNavigate, selectedDate, view]);

  const handlePrevios = useCallback(() => {
    let date = null;
    let start = null;
    let end = null;
    if (view === 'month') {
      date = subMonths(selectedDate, 1);

      const monthStart = startOfMonth(date);
      const weekStart = startOfWeek(monthStart);
      const monthEnd = endOfMonth(date);
      const weekEnd = endOfWeek(monthEnd);

      start = startOfDay(weekStart);
      end = endOfDay(weekEnd);
    } else if (view === 'week' || view === 'workweek') {
      date = subWeeks(selectedDate, 1);
      dispatch('multiDayEventsHFactor', 0);

      const weekStart = startOfWeek(date);
      const weekEnd = endOfWeek(date);
      start = startOfDay(weekStart);
      end = endOfDay(weekEnd);
    } else if (view === 'day') {
      date = subDays(selectedDate, 1);
      dispatch('multiDayEventsHFactor', 0);

      start = startOfDay(date);
      end = endOfDay(date);
    }
    // Always dispatch - the provider will ignore it if selectedDate is controlled
    dispatch(SELECTED_DATE, date);
    onNavigate instanceof Function && onNavigate({ date, start, end, view });
  }, [dispatch, onNavigate, selectedDate, view]);

  const handleTodayDate = useCallback(() => {
    const today = new Date();
    dispatch(SELECTED_DATE, today);
    onNavigate instanceof Function &&
      onNavigate({
        date: today,
        start: startOfDay(today),
        end: endOfDay(today),
        view,
      });
  }, [dispatch, onNavigate, view]);

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
        const workweekDays = weekDays?.workweek || [1, 2, 3, 4, 5];
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
    (newView: string) => {
      // Always dispatch - the provider will ignore it if view is controlled
      dispatch('view', newView);
      onView instanceof Function && onView({ view: newView });
    },
    [dispatch, onView]
  );

  const [navAnnouncement, setNavAnnouncement] = useState('');

  const handleNextWithAnnouncement = useCallback(() => {
    handleNext();
    setNavAnnouncement(`Navigated forward. Now showing ${date()}`);
  }, [handleNext, date]);

  const handlePrevWithAnnouncement = useCallback(() => {
    handlePrevios();
    setNavAnnouncement(`Navigated backward. Now showing ${date()}`);
  }, [handlePrevios, date]);

  const handleTodayWithAnnouncement = useCallback(() => {
    handleTodayDate();
    setNavAnnouncement('Navigated to today');
  }, [handleTodayDate]);

  return (
    <React.Fragment>
      <div>
        <LiveRegion message={navAnnouncement} />
        <div className="align-items-center">
          {/* <div>{title || "Brand Title"}</div> */}
          <div>
            <div className="row justify-content-center">
              <div className="col-12 col-md-6 align-items-center">
                <div className="d-flex align-items-center justify-content-center" role="toolbar" aria-label="Calendar navigation">
                  <button
                    className="btn btn-sm d-flex align-items-center"
                    onClick={handlePrevWithAnnouncement}
                    aria-label="Previous"
                  >
                    <svg
                      className="fs-14 m-auto"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="ArrowBackIosNewIcon"
                      fill="currentColor"
                      width={20}
                      height={20}
                    >
                      <path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z"></path>
                    </svg>
                  </button>
                  <span className="mx-3 text-primary text-center" aria-live="polite">
                    {date()}
                  </span>
                  <button
                    className="btn btn-sm d-flex align-items-center"
                    onClick={handleNextWithAnnouncement}
                    aria-label="Next"
                  >
                    <svg
                      className="fs-14 m-auto"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="ArrowForwardIosIcon"
                      fill="currentColor"
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
                      onClick={handleTodayWithAnnouncement}
                      aria-label="Today"
                      className={
                        view === 'day' && isToday(selectedDate)
                          ? 'btn btn-sm btn-light text-primary'
                          : 'btn btn-sm btn-light'
                      }
                    >
                      {message.today}
                    </button>
                  </div>
                  <div className="d-flex align-items-center" aria-hidden="true">|</div>
                  <div className="ms-3">
                    <div className="btn-group" role="toolbar" aria-label="View switcher">
                      {views.map((v: view) => (
                        <button
                          key={v}
                          onClick={() => changeView(v)}
                          aria-label={`Switch to ${v} view`}
                          aria-current={view === v ? 'true' : undefined}
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
