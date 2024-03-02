import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Portal from '../Portal';
import useStore from '../../hooks/useStore';
import { usePopper } from 'react-popper';
import EventPopover from './Event';
import { format } from 'date-fns';

interface ShowMoreEventsProps {
  dateAllEvents: { events: any[]; date: Date | null; resource: any[] | null };
  setDateAllEvents: Dispatch<
    SetStateAction<{ events: any[]; date: Date | null; resource: any[] | null }>
  >;
  setPopperElement: Dispatch<SetStateAction<HTMLDivElement | null>>;
  styles: any;
  attributes: any;
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
  const { fields, view, allEventsPopoverTemplate, resourceFields }: any =
    useStore();

  const [popover, setPopover] = useState<{} | null>(null);

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setEventPopperElement] =
    useState<HTMLDivElement | null>(null);
  const { styles: eventStyles, attributes: eventAttributes }: any = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'left-start',
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['right-start'],
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

  return (
    <React.Fragment>
      {Boolean(events?.length) && (
        <Portal node={document.querySelector('.scheduler')}>
          <div
            className="more-events-popover popover-animation popover-shadow"
            ref={(ref) => setPopperElement(ref)}
            style={{
              ...styles.popper,
              zIndex: 2,
            }}
            {...attributes.popper}
          >
            {allEventsPopoverTemplate instanceof Function ? (
              allEventsPopoverTemplate({ date, events, view, togglePopover })
            ) : (
              <div className="popover p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h6 className="text-start">
                      {date && format(date, 'd MMM')}
                    </h6>
                  </div>
                  <div>
                    <button
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
                  {events.map((e, idx) => (
                    <div
                      onClick={(ev) => {
                        setPopover(e);
                        setReferenceElement(ev.currentTarget);
                      }}
                      key={idx}
                      style={{
                        backgroundColor: resource
                          ? resource[resourceFields.backgroundColor]
                          : e[fields.backgroundColor],
                      }}
                      className="btn btn-sm text-start background-primary mb-1 py-1 px-2 text-white w-100"
                    >
                      <h6 className="fs-10 text-start">{e[fields.subject]}</h6>
                      {/* <time className="">
                <span>
                  {format(e[fields.start], 'dd MMM yyyy')}
                </span>
                <span>-</span>
                <span>
                  {format(e[fields.end], 'dd MMM yyyy')}
                </span>
              </time> */}
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
        </Portal>
      )}
    </React.Fragment>
  );
};

export default ShowMoreEvents;
