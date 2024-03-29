import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import useStore from '../../hooks/useStore';
import { usePopper } from 'react-popper';
import { Boundary } from '@popperjs/core';
import EventPopover from '../Popovers/Event';
import { accessor } from '../../utils/accessor';

interface EventItemProps {
  hasPrevious?: boolean;
  className?: string;
  hasNext?: boolean;
  event: any;
  resource?: any;
  timeFormat?: string;
  showTime?: boolean;
  eventStyles: {};
  idx: number;
}

const EventItem: React.FC<EventItemProps> = ({
  className = '',
  hasPrevious = false,
  hasNext = false,
  event,
  resource,
  timeFormat = 'dd MMM yyyy hh:mm a',
  showTime = true,
  eventStyles,
  idx,
}) => {
  const {
    fields,
    resourceFields,
    eventTemplate,
    locale,
    dispatch,
    view,
    onClickEvent,
    onDoubleClickEvent,
  }: any = useStore();

  // const [boundary, setBoudnary] = useState<Boundary | null>(null);
  const [popover, setPopover] = useState<HTMLElement | null>(null);
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  // useEffect(() => {
  //   const element = document.querySelector('.scheduler');
  //   setBoudnary(element);
  // }, []);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'left-start',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['right-start', 'bottom', 'top'],
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
          offset: [0, 10],
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

  const onClick = () => {
    setPopover(event);
  };

  const onDoubleClck = () => {
    dispatch('eventDialog', {
      date: null,
      event: event,
      resource,
      isOpen: true,
    });
  };

  const timer: any = useRef(); // { current: number }

  const onClickHandler = (e: any) => {
    clearTimeout(timer.current);

    if (e.detail === 1) {
      timer.current = setTimeout(
        onClickEvent instanceof Function
          ? () => onClickEvent({ event, resource })
          : onClick,
        200
      );
    } else if (e.detail === 2) {
      onDoubleClickEvent instanceof Function
        ? onDoubleClickEvent({ event, resource })
        : onDoubleClck();
    }
  };

  const renderEvent = useMemo(() => {
    return (
      <div
        className={`d-flex flex-wrap bs-appointment p-0 ${className}`}
        style={{
          ...eventStyles,
          backgroundColor: resource
            ? resource[resourceFields.backgroundColor]
            : event[fields.backgroundColor],
        }}
        role="button"
        data-id={`appointment-${idx}`}
        onClick={(e) => {
          e.stopPropagation();
          onClickHandler(e);
        }}
      >
        <div ref={setReferenceElement} className="bs-appointment-details">
          <div className="d-flex">
            {hasPrevious && (
              <div className="d-flex align-items-center mx-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="12"
                  width="7.5"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill="#ffffff"
                    d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                  />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="12"
                  width="7.5"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill="#ffffff"
                    d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                  />
                </svg>
              </div>
            )}
            <div className="">
              {eventTemplate instanceof Function ? (
                eventTemplate({ event, view })
              ) : (
                <div>
                  <h6 className="fs-12 mb-0 e-subject">
                    {accessor(fields.subject, event)}{' '}
                    {event[fields.allDay] ? '(All Day)' : ''}
                  </h6>
                  {showTime && (
                    <div>
                      <time className="fs-12">
                        <span>
                          {format(new Date(event[fields.start]), timeFormat, {
                            locale,
                          })}
                        </span>
                        <span className="mx-1">-</span>
                        <span>
                          {format(new Date(event[fields.end]), timeFormat, {
                            locale,
                          })}
                        </span>
                      </time>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {hasNext && (
            <div className="d-flex align-items-center mx-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="12"
                width="7.5"
                viewBox="0 0 320 512"
              >
                <path
                  fill="#ffffff"
                  d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="12"
                width="7.5"
                viewBox="0 0 320 512"
                className="ms-n2"
              >
                <path
                  fill="#ffffff"
                  d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasPrevious,
    hasNext,
    event,
    className,
    dispatch,
    eventStyles,
    eventTemplate,
    fields,
    showTime,
    timeFormat,
    resource,
  ]);

  return (
    <React.Fragment>
      <EventPopover
        resource={resource}
        event={popover}
        setPopover={setPopover}
        setPopperElement={setPopperElement}
        styles={styles}
        attributes={attributes}
        timeFormat={timeFormat}
      />
      {renderEvent}
    </React.Fragment>
  );
};

export default EventItem;
