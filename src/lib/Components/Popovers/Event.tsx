import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import useStore from '../../hooks/useStore';
import { format } from 'date-fns';
import { createPortal } from 'react-dom';
import Portal from '../Portal';
import { accessor } from '../../utils/accessor';

interface EventPopoverTypes {
  resource?: any;
  event: any;
  setPopover: any;
  setPopperElement: Dispatch<SetStateAction<HTMLDivElement | null>>;
  styles: any;
  attributes: any;
  timeFormat: string | undefined | null;
}

const EventPopover: React.FC<EventPopoverTypes> = ({
  resource,
  event,
  setPopover,
  setPopperElement,
  styles,
  attributes,
  timeFormat,
}) => {
  const {
    fields,
    locale,
    eventPopoverTemplate,
    resources,
    resourceFields,
    onEditEvent,
    onDeleteEvent,
    dispatch,
  }: any = useStore();

  // useEffect(() => {
  //   document.body.addEventListener('click', function (e) {
  //     const popoverContainer = document.querySelector('#event-popover');

  //     if (popoverContainer && !popoverContainer.contains(e.target as Node)) {
  //       // if (event) setPopover(null);
  //     }
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const togglePopover = () => setPopover(null);

  // Example usage:
  // console.log(nestedPropertyValue);

  return (
    <React.Fragment>
      {Boolean(event) && (
        <Portal node={document.querySelector('.scheduler')}>
          <div
            id="event-popover"
            className="popover-animation popover-shadow"
            ref={setPopperElement}
            style={{ ...styles.popper, zIndex: 2 }}
            {...attributes.popper}
          >
            <div className="popover">
              {createPortal(
                <div
                  className="popover-overlay"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopover(null);
                  }}
                />,
                document.body
              )}
              {eventPopoverTemplate instanceof Function ? (
                eventPopoverTemplate({ event, togglePopover })
              ) : (
                <>
                  <div
                    style={{
                      backgroundColor: resource
                        ? accessor(resourceFields.backgroundColor, resource)
                        : accessor(fields.backgroundColor, event),
                    }}
                    className="popover-head p-3"
                  >
                    <div>
                      <div className="d-flex justify-content-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePopover();
                            if (onEditEvent instanceof Function)
                              onEditEvent({ event, resource });
                            else
                              dispatch('eventDialog', {
                                date: null,
                                event: event,
                                resource,
                                isOpen: true,
                              });
                          }}
                          className="btn btn-sm btn-light me-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteEvent instanceof Function)
                              onDeleteEvent({ event, resource });
                            togglePopover();
                          }}
                          className="btn btn-sm btn-light me-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash3-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePopover();
                          }}
                          className="btn btn-sm btn-light"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-x-lg"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="text-start">
                      <h5 className="text-white mt-3">
                        {accessor(fields.subject, event)}
                      </h5>
                    </div>
                  </div>
                  <div className="popover-body text-start p-3">
                    <h6 className="d-flex align-items-center">
                      <span className="me-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className=""
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5m9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5M8.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM3 10.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
                        </svg>
                      </span>
                      <span className="fs-13">
                        {format(
                          accessor(fields.start, event),
                          timeFormat ? timeFormat : 'd MMM yyyy hh:mm a',
                          {
                            locale,
                          }
                        )}{' '}
                        -{' '}
                        {format(
                          accessor(fields.end, event),
                          timeFormat ? timeFormat : 'd MMM yyyy hh:mm a',
                          {
                            locale,
                          }
                        )}
                      </span>
                    </h6>
                    {resource && (
                      <h6 className="d-flex align-items-center mt-2">
                        <span className="me-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className=""
                            viewBox="0 0 16 16"
                          >
                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                          </svg>
                        </span>
                        <span className="fs-13">
                          {resource
                            ? accessor(resourceFields.title, resource)
                            : ''}
                        </span>
                      </h6>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Portal>
      )}
    </React.Fragment>
  );
};

export default EventPopover;
