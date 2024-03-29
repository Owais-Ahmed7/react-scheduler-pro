import React, { useMemo, useRef, useState } from 'react';
import {
  convertEventTimeZone,
  differenceInDaysOmitTime,
  distributeEvents,
} from '../utils/schedular';
import {
  addDays,
  areIntervalsOverlapping,
  endOfDay,
  format,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { isToday } from '../utils/schedular';
import MultidayEvents from './Events/MultidayEvents';
import useStore from '../hooks/useStore';
import ShowMoreEvents from './Popovers/ShowMoreEvents';
import { usePopper } from 'react-popper';
import { Boundary } from '@popperjs/core';

interface Props {
  hasResource: boolean;
  resources?: any;
  resourceIndex?: number;
  resourceFields?: any;
  weekDays: number[];
  startOfWk: Date;
  endOfWk: Date;
  locale: Locale;
  // multiDayPlaceHFactor: { current: number };
  // showAllMultiDEvents: boolean;
  resourcedEvents: any[];
  fields: any;
  // setShowMultiDEvents: Dispatch<SetStateAction<boolean>>;
}

const DayGridHeader: React.FC<Props> = ({
  hasResource,
  resources,
  resourceFields,
  weekDays,
  startOfWk,
  endOfWk,
  locale,
  // multiDayPlaceHFactor,
  // showAllMultiDEvents,
  resourcedEvents,
  fields,
  // setShowMultiDEvents,
}) => {
  const { multiDayEventsHFactor, hourFormat }: any = useStore();

  const multiDayPlaceHFactor = useRef(0);
  multiDayPlaceHFactor.current = multiDayEventsHFactor;
  // let eventsIndexes: any[] = [];

  const [showAllMultiDEvents, setShowMultiDEvents] = useState<{
    date: Date | null;
    events: any[] | null;
    resource: any | null;
  }>({
    date: null,
    events: [],
    resource: null,
  }); //useState<boolean>(false);

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['bottom'],
        },
      },
      {
        name: 'preventOverflow',
        options: {
          altAxis: true,
          mainAxis: true,
          boundary: document.querySelector('.scheduler') as Boundary,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [120, 5],
        },
      },
      {
        name: 'popperOffset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const renderToggleButton = useMemo(() => {
    return (
      <div
        style={{
          height: '50px',
          // `${computeMultiDPHeight(
          //   multiDayPlaceHFactor.current,
          //   showAllMultiDEvents
          // )}px`,
        }}
        className="bs-all-day-cells border-0"
      >
        <div className="e-all-day-appointment text-center e-appointment-expand">
          {/* <ToggleMultiDayEvents
            multiDayPlaceHFactor={multiDayPlaceHFactor.current}
            show={showAllMultiDEvents}
            setShowMultiDEvents={setShowMultiDEvents}
          /> */}
        </div>
      </div>
    );
  }, []);

  const renderEvents = useMemo(() => {
    return hasResource ? (
      resources.map((rs: any, idx: number) => (
        <RenderHeader
          key={rs[resourceFields.id]}
          resource={rs}
          index={idx}
          weekDays={weekDays}
          startOfWk={startOfWk}
          endOfWk={endOfWk}
          hasResource={hasResource}
          resources={resources}
          resourceFields={resourceFields}
          locale={locale}
          resourcedEvents={resourcedEvents}
          fields={fields}
          setReferenceElement={setReferenceElement}
          setShowMultiDEvents={setShowMultiDEvents}
        />
      ))
    ) : (
      <RenderHeader
        index={0}
        weekDays={weekDays}
        startOfWk={startOfWk}
        endOfWk={endOfWk}
        hasResource={hasResource}
        resources={resources}
        resourceFields={resourceFields}
        locale={locale}
        resourcedEvents={resourcedEvents}
        fields={fields}
        setReferenceElement={setReferenceElement}
        setShowMultiDEvents={setShowMultiDEvents}
      />
    );
  }, [
    endOfWk,
    fields,
    hasResource,
    locale,
    resourceFields,
    resourcedEvents,
    resources,
    startOfWk,
    weekDays,
  ]);

  return (
    <React.Fragment>
      <div className="bs-left-indent">
        <div className="bs-left-indent-wrapper">
          <div
            style={{
              height: hasResource ? '40px' : 0,
              padding: hasResource ? '8px' : 0,
            }}
            className="bs-resource-cell border-0"
          ></div>
          <div className="bs-header-cells border-0"></div>
          <div>{renderToggleButton}</div>
        </div>
      </div>

      <div className="bs-time-header-content bs-row">
        {/* <div className="overflow-hidden"> */}
        {renderEvents}
        <ShowMoreEvents
          dateAllEvents={showAllMultiDEvents}
          setDateAllEvents={setShowMultiDEvents}
          setPopperElement={setPopperElement}
          styles={styles}
          attributes={attributes}
          // timeFormat={hourFormat === 12 ? '' :}
        />
        {/* </div> */}
      </div>
    </React.Fragment>
  );
};

export default DayGridHeader;

const RenderHeader = ({
  resource,
  index,
  weekDays,
  startOfWk,
  endOfWk,
  hasResource,
  resources,
  resourceFields,
  locale,
  resourcedEvents,
  fields,
  setReferenceElement,
  setShowMultiDEvents,
}: any) => {
  const { resourceTemplate, view, message, timezone }: any = useStore();

  const renderMultiDayEvents = useMemo(() => {
    return (weekDays || []).map((e: any, i: number) => {
      const today = addDays(startOfWk, e);
      const eachFirstDayInCalcRow = isSameDay(startOfWk, today) ? today : null;

      let todayEvents: any[] = [];
      let prevNextEvents: any[] = [];

      const events = hasResource
        ? resourcedEvents[index ?? 0]?.resourceEvents
        : resourcedEvents;

      events?.forEach((e: any) => {
        const event = convertEventTimeZone(e, fields, timezone);
        if (
          differenceInDaysOmitTime(
            new Date(event[fields.start]),
            new Date(event[fields.end])
          ) > 0 ||
          event[fields.allDay]
        ) {
          const doesIntervalOverlap = areIntervalsOverlapping(
            {
              start: startOfDay(event[fields.start]),
              end: endOfDay(event[fields.end]),
            },
            {
              start: startOfDay(today),
              end: endOfDay(today),
            }
          );

          if (
            (eachFirstDayInCalcRow && doesIntervalOverlap) ||
            isSameDay(event[fields.start], today)
          ) {
            todayEvents.push(event);
          }

          if (doesIntervalOverlap) {
            prevNextEvents.push(event);
          }
        }
      });

      let eventsIndexes: any = [];
      if (prevNextEvents.length)
        eventsIndexes = distributeEvents(
          prevNextEvents.sort(
            (a: any, b: any) =>
              new Date(a[fields.start]).getTime() -
              new Date(b[fields.start]).getTime()
          ),
          eventsIndexes || [],
          fields,
          timezone,
          3
        );

      return (
        <div className="bs-all-day-appointment-wrapper" key={i}>
          <MultidayEvents
            multiDayEvents={todayEvents}
            prevNextEvents={prevNextEvents}
            resource={resource}
            // showMultiDEvents={showAllMultiDEvents}
            eventsIndexes={eventsIndexes}
            weekStart={startOfWk}
            weekEnd={endOfWk}
            hasResource={hasResource}
            today={today}
          />
          {prevNextEvents.length > 2 && ( //&& !showAllMultiDEvents
            <div
              onClick={(e) => {
                e.stopPropagation();
                setReferenceElement(e.currentTarget);
                setShowMultiDEvents({
                  date: today,
                  events: prevNextEvents,
                  resource,
                });
              }}
              className="btn bs-more-indicator position-absolute p-0 w-100 text-start"
              data-count="1"
              data-group-index="0"
              style={{
                top: `${85}px`,
                left: 0,
                width: '100%',
              }}
            >
              +{prevNextEvents.length - 2}&nbsp;{message.more}
            </div>
          )}
        </div>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // multiDayPlaceHFactor,
    weekDays,
    startOfWk,
    resourcedEvents,
    resources,
    fields,
    // showAllMultiDEvents,
    endOfWk,
    hasResource,
    setShowMultiDEvents,
  ]);

  return (
    <div className="bs-min-width bs-row bs-column">
      <div
        style={{
          height: hasResource ? '40px' : 0,
          // padding: hasResource ? '8px' : 0,
        }}
        className="bs-resource-cell text-center"
      >
        {hasResource &&
          (resourceTemplate instanceof Function
            ? resourceTemplate({ resource, view })
            : resource[resourceFields.title])}
      </div>
      <div className="bs-row">
        <div className="bs-all-day-appointments">{renderMultiDayEvents}</div>
      </div>
      <div className="bs-time-header-cell bs-row">
        {(weekDays || []).map((e: any, i: number) => {
          const date = addDays(startOfWk, e);
          return (
            <div key={i} className="bs-header-cells">
              <div
                className={
                  isToday(date, timezone)
                    ? 'date-cell text-center text-primary'
                    : 'date-cell text-center'
                }
              >
                <div>
                  {format(date, 'd', {
                    locale,
                  })}
                </div>
                <div>
                  {format(date, 'EEE', {
                    locale,
                  })}
                </div>
              </div>
              <div className="bs-all-day-cells"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
