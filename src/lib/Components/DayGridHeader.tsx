import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
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
  startOfWeek,
} from 'date-fns';
import { isToday } from '../utils/schedular';
import MultidayEvents from './Events/MultidayEvents';
import useStore from '../hooks/useStore';
import ShowMoreEvents from './Popovers/ShowMoreEvents';
import { usePopper } from 'react-popper';
import { Boundary } from '@popperjs/core';
import {
  EventColumn,
  MappedEvent,
  Resource,
  ResourceFields,
  ResourcedEventsEntry,
  ShowMoreEventsState,
  fieldsType,
} from '../types';

interface Props {
  hasResource: boolean;
  resources?: Resource[];
  resourceIndex?: number;
  resourceFields?: ResourceFields;
  weekDays: number[];
  startOfWk: Date;
  endOfWk: Date;
  locale: Locale;
  resourcedEvents: MappedEvent[] | ResourcedEventsEntry[];
  fields: fieldsType;
}

const DayGridHeader: React.FC<Props> = ({
  hasResource,
  resources,
  resourceFields,
  weekDays,
  startOfWk,
  endOfWk,
  locale,
  resourcedEvents,
  fields,
}) => {
  const { multiDayEventsHFactor, hourFormat } = useStore();

  const multiDayPlaceHFactor = useRef(0);
  multiDayPlaceHFactor.current = multiDayEventsHFactor || 0;

  const [showAllMultiDEvents, setShowMultiDEvents] = useState<ShowMoreEventsState>({
    date: null,
    events: [],
    resource: null,
  });

  const [boundary, setBoudnary] = useState<Boundary | null>(null);
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    const element = document?.querySelector('.scheduler');
    if (element) {
      setBoudnary(element);
    }
  }, []);

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
          boundary: boundary as Boundary,
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
        }}
        className="bs-all-day-cells border-0"
      >
        <div className="e-all-day-appointment text-center e-appointment-expand">
        </div>
      </div>
    );
  }, []);

  const renderEvents = useMemo(() => {
    return hasResource ? (
      (resources || []).map((rs, idx: number) => (
        <RenderHeader
          key={rs[resourceFields?.id || 'id'] as string}
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
        {renderEvents}
        <ShowMoreEvents
          dateAllEvents={showAllMultiDEvents}
          setDateAllEvents={setShowMultiDEvents}
          setPopperElement={setPopperElement}
          styles={styles}
          attributes={attributes}
        />
      </div>
    </React.Fragment>
  );
};

export default DayGridHeader;

interface RenderHeaderProps {
  resource?: Resource;
  index: number;
  weekDays: number[];
  startOfWk: Date;
  endOfWk: Date;
  hasResource: boolean;
  resources?: Resource[];
  resourceFields?: ResourceFields;
  locale: Locale;
  resourcedEvents: MappedEvent[] | ResourcedEventsEntry[];
  fields: fieldsType;
  setReferenceElement: Dispatch<SetStateAction<HTMLDivElement | null>>;
  setShowMultiDEvents: Dispatch<SetStateAction<ShowMoreEventsState>>;
}

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
}: RenderHeaderProps) => {
  const { resourceTemplate, view, message, timezone } = useStore();

  const renderMultiDayEvents = useMemo(() => {
    return (weekDays || []).map((e: number, i: number) => {
      const today = addDays(startOfWk, e);
      const eachFirstDayInCalcRow = isSameDay(startOfWk, today) ? today : null;

      let todayEvents: MappedEvent[] = [];
      let prevNextEvents: MappedEvent[] = [];

      const events = hasResource
        ? (resourcedEvents as ResourcedEventsEntry[])[index ?? 0]?.resourceEvents
        : (resourcedEvents as MappedEvent[]);

      events?.forEach((e: MappedEvent) => {
        const event = convertEventTimeZone(e, fields, timezone);
        if (
          differenceInDaysOmitTime(
            new Date(event[fields.start] as Date),
            new Date(event[fields.end] as Date)
          ) > 0 ||
          event[fields.allDay || '']
        ) {
          const doesIntervalOverlap = areIntervalsOverlapping(
            {
              start: startOfDay(event[fields.start] as Date),
              end: endOfDay(event[fields.end] as Date),
            },
            {
              start: startOfDay(today),
              end: endOfDay(today),
            }
          );

          if (
            (eachFirstDayInCalcRow && doesIntervalOverlap) ||
            isSameDay(event[fields.start] as Date, today)
          ) {
            todayEvents.push(event);
          }

          if (doesIntervalOverlap) {
            prevNextEvents.push(event);
          }
        }
      });

      let eventsIndexes: EventColumn[] = [];
      if (prevNextEvents.length)
        eventsIndexes = distributeEvents(
          prevNextEvents.sort(
            (a, b) =>
              new Date(a[fields.start] as Date).getTime() -
              new Date(b[fields.start] as Date).getTime()
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
            eventsIndexes={eventsIndexes}
            weekStart={startOfWk}
            weekEnd={endOfWk}
            hasResource={hasResource}
            today={today}
          />
          {prevNextEvents.length > 2 && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setReferenceElement(e.currentTarget);
                setShowMultiDEvents({
                  date: today,
                  events: prevNextEvents,
                  resource: resource || null,
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
    weekDays,
    startOfWk,
    resourcedEvents,
    resources,
    fields,
    endOfWk,
    hasResource,
    setShowMultiDEvents,
  ]);

  return (
    <div className="bs-min-width bs-row bs-column">
      <div
        style={{
          height: hasResource ? '40px' : 0,
        }}
        className="bs-resource-cell text-center"
      >
        {hasResource &&
          (resourceTemplate instanceof Function
            ? resourceTemplate({ resource: resource as Resource, view })
            : resource?.[resourceFields?.title || 'title'] as string)}
      </div>
      <div className="bs-row">
        <div className="bs-all-day-appointments">{renderMultiDayEvents}</div>
      </div>
      <div className="bs-time-header-cell bs-row">
        {(weekDays || []).map((e: number, i: number) => {
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
