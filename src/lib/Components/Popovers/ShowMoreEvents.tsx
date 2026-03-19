import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import Portal from '../Portal';
import useStore from '../../hooks/useStore';
import { usePopper } from 'react-popper';
import EventPopover from './Event';
import { format } from 'date-fns';
import { accessor } from '../../utils/accessor';
import { Boundary } from '@popperjs/core';
import useClickAway from '../../hooks/useClickAway';
import useFocusTrap from '../../hooks/useFocusTrap';
import { MappedEvent, Resource, ShowMoreEventsState } from '../../types';

interface ShowMoreEventsProps {
  dateAllEvents: ShowMoreEventsState;
  setDateAllEvents: Dispatch<SetStateAction<ShowMoreEventsState>>;
  setPopperElement: Dispatch<SetStateAction<HTMLDivElement | null>>;
  styles: Record<string, React.CSSProperties>;
  attributes: Record<string, Record<string, string> | undefined>;
  timeFormat?: string | null;
}

const ShowMoreEvents: React.FC<ShowMoreEventsProps> = ({
  dateAllEvents: { events, date, resource },
  setDateAllEvents,
  setPopperElement,
  styles,
  attributes,
  timeFormat,
}) => {
  const {
    fields,
    view,
    allEventsPopoverTemplate,
    resourceFields,
    onDoubleClickEvent,
    dispatch,
  } = useStore();

  const [popover, setPopover] = useState<MappedEvent | null>(null);

  const [boundary, setBoudnary] = useState<Boundary | null>(null);
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setEventPopperElement] =
    useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = document?.querySelector('.scheduler');
    if (element) {
      setBoudnary(element);
    }
  }, []);

  const { styles: eventStyles, attributes: eventAttributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'left-start',
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['right-start', 'bottom', 'top', 'left-start'],
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 10],
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
          name: 'popperOffset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  );

  const togglePopover = () => {
    setPopover(null);
    setDateAllEvents({
      events: [],
      date: null,
      resource: null,
    });
  };

  const onClick = (event: MappedEvent) => {
    setPopover(event);
  };

  const onDoubleClck = ({ event, resource }: { event: MappedEvent; resource: Resource | null }) => {
    dispatch('eventDialog', {
      date: null,
      event: event,
      resource,
      isOpen: true,
    });
  };

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClickHandler = (e: React.MouseEvent, event: MappedEvent) => {
    if (timer.current) clearTimeout(timer.current);

    if (e.detail === 1) {
      timer.current = setTimeout(() => onClick(event), 200);
    } else if (e.detail === 2) {
      onDoubleClickEvent instanceof Function
        ? onDoubleClickEvent({ event, resource })
        : onDoubleClck({ event, resource });
    }
  };

  const popperRef = useClickAway(() => {
    setDateAllEvents({ events: null, date: null, resource: null });
    setPopover(null);
  }) as React.RefObject<HTMLDivElement>;

  const focusTrapRef = useFocusTrap(Boolean(events?.length));

  return (
    <React.Fragment>
      {Boolean(events?.length) && (
        <Portal node={document.querySelector('.scheduler')}>
          <div
            className="more-events-popover popover-animation popover-shadow"
            ref={(ref) => {
              setPopperElement(ref);
            }}
            style={{
              ...styles.popper,
              zIndex: 2,
            }}
            {...attributes.popper}
          >
            <div
              ref={(el) => {
                (popperRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                (focusTrapRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
              }}
              role="dialog"
              aria-modal="true"
              aria-label={`Events for ${date ? format(date, 'd MMM') : ''}`}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.stopPropagation();
                  togglePopover();
                }
              }}
            >
              {allEventsPopoverTemplate instanceof Function ? (
                allEventsPopoverTemplate({ date, events, view, togglePopover })
              ) : (
                <div className="popover p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h6 className="popper-date text-start">
                        {date && format(date, 'd MMM')}
                      </h6>
                    </div>
                    <div>
                      <button
                        aria-label="Close"
                        onClick={() => {
                          togglePopover();
                        }}
                        className="btn btn-sm btn-secondary"
                      >
                        X
                      </button>
                    </div>
                  </div>
                  <div className="events">
                    {(events || []).map((e, idx) => (
                      <div
                        onClick={(ev) => {
                          onClickHandler(ev, e);
                          setReferenceElement(ev.currentTarget);
                        }}
                        key={idx}
                        style={{
                          backgroundColor: (resource
                            ? accessor(resourceFields.backgroundColor || '', resource)
                            : accessor(fields.backgroundColor || '', e)) as string,
                        }}
                        className="btn btn-sm btn-primary border-0 text-start mb-1 py-1 px-2 text-white w-100"
                      >
                        <h6 className="fs-10 text-start">
                          {accessor(fields.subject, e) as string}
                        </h6>
                      </div>
                    ))}
                    <EventPopover
                      timeFormat={timeFormat}
                      event={popover}
                      resource={resource}
                      setPopover={setPopover}
                      setPopperElement={setEventPopperElement}
                      styles={eventStyles}
                      attributes={eventAttributes}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </React.Fragment>
  );
};

export default ShowMoreEvents;
