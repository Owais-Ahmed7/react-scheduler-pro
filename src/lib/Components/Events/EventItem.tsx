import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import useStore from '../../hooks/useStore';
import { usePopper } from 'react-popper';
import { Boundary } from '@popperjs/core';
import EventPopover from '../Popovers/Event';
import { accessor } from '../../utils/accessor';
import { MappedEvent, Resource } from '../../types';

interface EventItemProps {
  hasPrevious?: boolean;
  className?: string;
  hasNext?: boolean;
  event: MappedEvent;
  resource?: Resource;
  timeFormat?: string;
  showTime?: boolean;
  eventStyles: CSSProperties;
  idx: number;
  onDragStart?: (
    event: MappedEvent,
    mouseEvent: React.MouseEvent | React.TouchEvent,
    resource?: Resource,
    eventElement?: HTMLElement
  ) => void;
  onResizeStart?: (
    event: MappedEvent,
    mouseEvent: React.MouseEvent | React.TouchEvent,
    resource?: Resource,
    eventElement?: HTMLElement
  ) => void;
  isDraggedEvent?: boolean;
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
  onDragStart,
  onResizeStart,
  isDraggedEvent = false,
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
    draggable,
    resizable,
  } = useStore();

  const [boundary, setBoudnary] = useState<Boundary | null>(null);
  const [popover, setPopover] = useState<MappedEvent | null>(null);
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const dragPending = useRef(false);
  const appointmentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const element = document.querySelector('.scheduler');
      if (element) {
        setBoudnary(element);
      }
    }
  }, []);

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
          boundary: boundary as Boundary,
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

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClickHandler = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Don't fire click if a drag just ended
    if (dragPending.current) {
      dragPending.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);

    if ('detail' in e && e.detail === 1) {
      timer.current = setTimeout(
        onClickEvent instanceof Function
          ? () => onClickEvent({ event, resource: resource || null })
          : onClick,
        200
      );
    } else if ('detail' in e && e.detail === 2) {
      onDoubleClickEvent instanceof Function
        ? onDoubleClickEvent({ event, resource: resource || null })
        : onDoubleClck();
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    // Ignore right-click
    if ('button' in e && e.button !== 0) return;

    const el = appointmentRef.current;
    if (el && onDragStart) {
      dragPending.current = true;
      onDragStart(event, e, resource, el);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!resizable) return;
    e.stopPropagation();
    if ('button' in e && e.button !== 0) return;

    const el = appointmentRef.current;
    if (el && onResizeStart) {
      dragPending.current = true;
      onResizeStart(event, e, resource, el);
    }
  };

  const draggingClass = isDraggedEvent ? 'bs-event-dragging' : '';

  const eventSubject = accessor(fields.subject, event) || 'Event';
  const eventStartFormatted = format(new Date(event[fields.start] as Date), timeFormat, { locale });
  const eventEndFormatted = format(new Date(event[fields.end] as Date), timeFormat, { locale });
  const eventAriaLabel = `${eventSubject}, ${eventStartFormatted} to ${eventEndFormatted}${event[fields.allDay || ''] ? ', All Day' : ''}`;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onClickHandler(e);
    } else if (e.key === 'Escape') {
      if (popover) {
        setPopover(null);
      }
    }
  }, [popover]);

  const renderEvent = useMemo(() => {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={eventAriaLabel}
        aria-haspopup="dialog"
        aria-expanded={Boolean(popover)}
        className={`bs-appointment ${draggingClass}`}
        data-id={`appointment-${idx}`}
        onClick={(e) => {
          e.stopPropagation();
          onClickHandler(e);
        }}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{
          ...eventStyles,
          cursor: draggable ? 'grab' : 'pointer',
        }}
        ref={(el) => {
          setReferenceElement(el);
          appointmentRef.current = el;
        }}
      >
        {eventTemplate instanceof Function ? (
          eventTemplate({
            event,
            view,
            hasNext,
            hasPrevious,
            styles: eventStyles,
            resource: resource || null,
          })
        ) : (
          <div
            className={`bs-default-event-template d-flex flex-wrap h-100 p-0 ${className}`}
            style={{
              backgroundColor: resource
                ? (resource[resourceFields.backgroundColor || ''] as string)
                : (event[fields.backgroundColor || ''] as string),
            }}
          >
            <div className="bs-appointment-details">
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
                        fill="currentColor"
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
                        fill="currentColor"
                        d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                      />
                    </svg>
                  </div>
                )}
                <div className="">
                  <div>
                    <h6 className="fs-12 mb-0 e-subject">
                      {accessor(fields.subject, event) as string}{' '}
                      {event[fields.allDay || ''] ? '(All Day)' : ''}
                    </h6>
                    {showTime && (
                      <div>
                        <time className="fs-12">
                          <span>
                            {format(new Date(event[fields.start] as Date), timeFormat, {
                              locale,
                            })}
                          </span>
                          <span className="mx-1">-</span>
                          <span>
                            {format(new Date(event[fields.end] as Date), timeFormat, {
                              locale,
                            })}
                          </span>
                        </time>
                      </div>
                    )}
                  </div>
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
                      fill="currentColor"
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
                      fill="currentColor"
                      d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}
        {resizable && (
          <div
            className="bs-resize-handle"
            onMouseDown={handleResizeMouseDown}
            onTouchStart={handleResizeMouseDown}
          />
        )}
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
    draggable,
    resizable,
    isDraggedEvent,
    draggingClass,
    eventAriaLabel,
    handleKeyDown,
    popover,
  ]);

  return (
    <React.Fragment>
      <EventPopover
        resource={resource || null}
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
