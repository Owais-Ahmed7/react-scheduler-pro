import React from 'react';
import { traverseCrossingEvents } from '../utils/schedular';
import { areIntervalsOverlapping, differenceInMinutes, format } from 'date-fns';
import { CELL_HEIGHT } from '../helpers/constants/schedular';
import useStore from '../hooks/useStore';

interface Props {
  events: any[];
  day: Date;
}

const RenderEvents = ({ day, events }: Props) => {
  const { startHour: START_HOUR, endHour: END_HOUR, step } = useStore();

  const INTERVAL = step;
  return (
    <React.Fragment>
      {(events || []).map((event: any, idx) => {
        const getHour = new Date(event.startDate).getHours();
        const getMinutes = new Date(event.startDate).getMinutes();
        const computeMinutePercentage = (getMinutes / 60) * CELL_HEIGHT;

        //algorithm
        const crossingEvents = traverseCrossingEvents(events, event);

        let width;
        let left;

        let checkBigger = 0;
        let globalCrossingEvent: any = {};
        crossingEvents.forEach((e, j) => {
          const cEvents = traverseCrossingEvents(events, e);

          if (cEvents.length > checkBigger) {
            globalCrossingEvent = {
              parent: event,
              subParent: e,
              children: cEvents,
            };

            checkBigger = cEvents.length;
          }
        });

        let widthFactor: any[] = [];
        const totalEvents = globalCrossingEvent?.children || [];

        totalEvents.forEach((e: any) => {
          let index = null;

          for (let i = 0; i < widthFactor.length; i++) {
            let col = widthFactor[i];
            let overlaps = false;

            for (let j = 0; j < col.events.length; j++) {
              const event = col.events[j];

              if (
                areIntervalsOverlapping(
                  {
                    start: new Date(e.startDate),
                    end: new Date(e.endDate),
                  },
                  {
                    start: new Date(event.startDate),
                    end: new Date(event.endDate),
                  }
                )
              ) {
                overlaps = true;
                break;
              } // else overlaps = false;
            }

            if (!overlaps) {
              index = i;
              break;
            }
          }

          if (index !== null) {
            widthFactor[index].events.push(e);
          } else {
            widthFactor.push({ events: [e] });
          }
        });

        // const top =
        //   (getHour - START_HOUR) * CELL_HEIGHT + computeMinutePercentage;
        // const height =
        //   (differenceInMinutes(
        //     new Date(event.endDate),
        //     new Date(event.startDate)
        //   ) *
        //     CELL_HEIGHT) /
        //   60;
        const CELL_HEIGHT_INTERVAL = CELL_HEIGHT * (60 / INTERVAL);

        const top =
          (getHour - START_HOUR) * CELL_HEIGHT_INTERVAL +
          computeMinutePercentage * (60 / INTERVAL);

        const height =
          (differenceInMinutes(
            new Date(event.endDate),
            new Date(event.startDate)
          ) *
            CELL_HEIGHT_INTERVAL) /
          60;
        width = (90 / widthFactor.length || 1) - 1;

        let leftFactor = null;
        let eventInColumn = null;
        for (let i = 0; i < widthFactor.length; i++) {
          eventInColumn = widthFactor[i].events.find(
            (e: any) => e._id === event._id
          );

          if (eventInColumn) {
            leftFactor = i;
            break;
          }
        }

        left = (leftFactor ?? 0) * (width + 1);
        return (
          <div
            key={`${event.startDate.toISOString()}-${idx}`}
            className="d-flex flex-wrap e-appointment p-1"
            style={{
              top: `${top}px`,
              left: `${left}%`, //computeLeft
              height: `${height}px`,
              width: `${width}%`,
              backgroundColor: 'rgb(196, 48, 129)',
            }}
            role="button"
            data-id={`appointment-${idx}`}
          >
            <h1 className="fs-12 mb-0">{event.name}</h1>
            <time className="fs-12">
              <span>{format(new Date(event.startDate), 'hh:mm a')}</span>
              <span className="mx-1">-</span>
              <span>{format(new Date(event.endDate), 'hh:mm a')}</span>
            </time>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default RenderEvents;
