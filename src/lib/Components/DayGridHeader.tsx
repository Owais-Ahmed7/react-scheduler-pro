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
import MultidayEvents from './MultidayEvents';
import useStore from '../hooks/useStore';
import ShowMoreEvents from './Popovers/ShowMoreEvents';
import { usePopper } from 'react-popper';

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
    events: any[];
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
      <td
        style={{
          height: '50px',
          // `${computeMultiDPHeight(
          //   multiDayPlaceHFactor.current,
          //   showAllMultiDEvents
          // )}px`,
        }}
        className="e-all-day-cells border-0"
      >
        <div className="e-all-day-appointment text-center e-appointment-expand">
          {/* <ToggleMultiDayEvents
            multiDayPlaceHFactor={multiDayPlaceHFactor.current}
            show={showAllMultiDEvents}
            setShowMultiDEvents={setShowMultiDEvents}
          /> */}
        </div>
      </td>
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
      <td className="e-left-indent">
        <div className="e-left-indent-wrapper">
          <table className="e-schedule-table border-end">
            <tbody>
              <tr>
                <td
                  style={{
                    height: hasResource ? '40px' : 0,
                    padding: hasResource ? '8px' : 0,
                  }}
                  className="e-resource-cell border-0"
                ></td>
              </tr>
              <tr>
                <td className="e-header-cells border-0"></td>
              </tr>
              <tr>{renderToggleButton}</tr>
            </tbody>
          </table>
        </div>
      </td>

      <td>
        <div className="e-date-header-container">
          <div className="e-date-header-wrapper overflow-hidden">
            <table className="e-schedule-table" style={{ tableLayout: 'auto' }}>
              <tbody>
                <tr>
                  {renderEvents}
                  <ShowMoreEvents
                    dateAllEvents={showAllMultiDEvents}
                    setDateAllEvents={setShowMultiDEvents}
                    setPopperElement={setPopperElement}
                    styles={styles}
                    attributes={attributes}
                    // timeFormat={hourFormat === 12 ? '' :}
                  />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </td>
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
        <td className="e-all-day-appointment-wrapper" key={i}>
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
              className="btn e-more-indicator position-absolute p-0 w-100 text-start"
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
        </td>
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
    <td style={{ minWidth: '300px' }} colSpan={7}>
      <div
        style={{
          height: hasResource ? '40px' : 0,
          // padding: hasResource ? '8px' : 0,
        }}
        className="e-resource-cell text-center"
      >
        {hasResource &&
          (resourceTemplate instanceof Function
            ? resourceTemplate({ resource, view })
            : resource[resourceFields.title])}
      </div>
      <div className="e-events-header">
        <table className="e-schedule-table">
          <tbody>
            <tr>{renderMultiDayEvents}</tr>
          </tbody>
        </table>
      </div>
      <div className="text-center">
        <table className="e-schedule-table">
          <tbody>
            <tr>
              {(weekDays || []).map((e: any, i: number) => {
                const date = addDays(startOfWk, e);
                return (
                  <td key={i} colSpan={1} className="e-header-cells">
                    <div
                      className={
                        isToday(date, timezone)
                          ? 'e-header-cells text-primary'
                          : 'e-header-cells'
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
                    <div
                      className="e-all-day-cells"
                      style={{
                        height: '50px',
                        // `${computeMultiDPHeight(
                        //   multiDayPlaceHFactor.current,
                        //   showAllMultiDEvents
                        // )}px`,
                      }}
                    ></div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </td>
  );
};
