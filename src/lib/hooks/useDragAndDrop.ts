import { useCallback, useEffect, useRef, useState, CSSProperties } from 'react';
import { CELL_HEIGHT } from '../helpers/constants/schedular';
import { addMinutes, addDays, differenceInMinutes } from 'date-fns';
import useStore from './useStore';
import { MappedEvent, Resource } from '../types';

type DragMode = 'drag' | 'resize' | null;

interface DragState {
  mode: DragMode;
  event: MappedEvent;
  resource: Resource | undefined;
  startMouseY: number;
  startMouseX: number;
  eventTop: number;
  eventLeft: number;
  eventHeight: number;
  eventWidth: number;
  containerRect: DOMRect | null;
  dayColumnWidth: number;
  dayColumnCount: number;
  dayStartIndex: number;
  originalEvent: MappedEvent;
}

export interface DragAndDropResult {
  isDragging: boolean;
  isResizing: boolean;
  draggedEvent: MappedEvent | null;
  previewStyle: CSSProperties | null;
  previewTitle: string;
  handleDragStart: (
    event: MappedEvent,
    mouseEvent: React.MouseEvent | React.TouchEvent,
    resource?: Resource,
    eventElement?: HTMLElement
  ) => void;
  handleResizeStart: (
    event: MappedEvent,
    mouseEvent: React.MouseEvent | React.TouchEvent,
    resource?: Resource,
    eventElement?: HTMLElement
  ) => void;
}

function getClientPos(e: MouseEvent | TouchEvent) {
  if ('touches' in e) {
    const touch = e.touches[0] || e.changedTouches[0];
    return { clientX: touch.clientX, clientY: touch.clientY };
  }
  return { clientX: e.clientX, clientY: e.clientY };
}

const useDragAndDrop = (): DragAndDropResult => {
  const {
    fields,
    step,
    startHour,
    endHour,
    onEventDrop,
    onEventResize,
    draggable,
    resizable,
    timezone,
  } = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<MappedEvent | null>(null);
  const [previewStyle, setPreviewStyle] = useState<CSSProperties | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');

  const dragStateRef = useRef<DragState | null>(null);
  const schedulerDragClass = useRef(false);

  const CELL_HEIGHT_INTERVAL = CELL_HEIGHT * (60 / step);
  const SNAP_PX = (step >= 60) ? CELL_HEIGHT : CELL_HEIGHT * (step / 60);

  const snapToGrid = useCallback(
    (value: number, snapSize: number): number => {
      return Math.round(value / snapSize) * snapSize;
    },
    []
  );

  const addSchedulerDragClass = useCallback(() => {
    if (!schedulerDragClass.current) {
      const el = document.querySelector('.scheduler');
      if (el) {
        el.classList.add('bs-dragging');
        schedulerDragClass.current = true;
      }
    }
  }, []);

  const removeSchedulerDragClass = useCallback(() => {
    if (schedulerDragClass.current) {
      const el = document.querySelector('.scheduler');
      if (el) {
        el.classList.remove('bs-dragging');
        schedulerDragClass.current = false;
      }
    }
  }, []);

  const getContainerAndColumns = useCallback((): {
    container: HTMLElement | null;
    containerRect: DOMRect | null;
    dayColumnWidth: number;
    dayColumnCount: number;
  } => {
    const container = document.querySelector('.bs-content-wrap') as HTMLElement;
    if (!container) return { container: null, containerRect: null, dayColumnWidth: 0, dayColumnCount: 0 };
    const containerRect = container.getBoundingClientRect();
    // Find day wrappers
    const dayWrappers = container.querySelectorAll('.e-day-wrapper');
    const dayColumnCount = dayWrappers.length || 1;
    const dayColumnWidth = dayColumnCount > 0
      ? (dayWrappers[0] as HTMLElement)?.getBoundingClientRect().width || (containerRect.width / dayColumnCount)
      : containerRect.width;
    return { container, containerRect, dayColumnWidth, dayColumnCount };
  }, []);

  const findClosestCell = useCallback(
    (clientX: number, clientY: number) => {
      const cells = document.querySelectorAll('.bs-date-cells');
      let closest: Element | null = null;
      let closestDist = Infinity;
      cells.forEach((cell) => {
        const rect = cell.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(clientX - cx, clientY - cy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = cell;
        }
      });
      return closest;
    },
    []
  );

  const calculateNewTimes = useCallback(
    (
      deltaY: number,
      deltaX: number,
      state: DragState,
      mode: DragMode
    ): { newTop: number; newHeight: number; dayOffset: number } => {
      if (mode === 'resize') {
        const newHeight = Math.max(SNAP_PX, snapToGrid(state.eventHeight + deltaY, SNAP_PX));
        return { newTop: state.eventTop, newHeight, dayOffset: 0 };
      }
      // drag mode
      const rawTop = state.eventTop + deltaY;
      const snappedTop = snapToGrid(rawTop, SNAP_PX);
      // Clamp to valid range
      const maxTop = (endHour - startHour) * CELL_HEIGHT_INTERVAL - state.eventHeight;
      const clampedTop = Math.max(0, Math.min(snappedTop, maxTop));

      // Calculate horizontal day offset
      let dayOffset = 0;
      if (state.dayColumnWidth > 0) {
        dayOffset = Math.round(deltaX / state.dayColumnWidth);
      }

      return { newTop: clampedTop, newHeight: state.eventHeight, dayOffset };
    },
    [SNAP_PX, CELL_HEIGHT_INTERVAL, endHour, startHour, snapToGrid]
  );

  const topToDate = useCallback(
    (top: number, baseDate: Date): Date => {
      const totalMinutesFromStart = (top / CELL_HEIGHT_INTERVAL) * 60;
      const hours = Math.floor(totalMinutesFromStart / 60);
      const minutes = Math.round(totalMinutesFromStart % 60);
      const date = new Date(baseDate);
      date.setHours(startHour + hours, minutes, 0, 0);
      return date;
    },
    [CELL_HEIGHT_INTERVAL, startHour]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const state = dragStateRef.current;
      if (!state) return;

      const { clientX, clientY } = getClientPos(e);
      const deltaY = clientY - state.startMouseY;
      const deltaX = clientX - state.startMouseX;

      const { newTop, newHeight, dayOffset } = calculateNewTimes(
        deltaY,
        deltaX,
        state,
        state.mode
      );

      // Calculate preview left position based on day offset
      const newLeftPx = state.dayStartIndex * state.dayColumnWidth + dayOffset * state.dayColumnWidth;

      setPreviewStyle({
        position: 'absolute',
        top: `${newTop}px`,
        left: `${newLeftPx}px`,
        width: `${state.dayColumnWidth - 4}px`,
        height: `${newHeight}px`,
        pointerEvents: 'none',
        zIndex: 100,
        opacity: 0.7,
        border: '2px dashed #0079ff',
        background: 'rgba(0, 121, 255, 0.15)',
        borderRadius: '4px',
        transition: 'top 0.1s ease, left 0.1s ease',
      });

      addSchedulerDragClass();

      if (state.mode === 'drag') {
        setIsDragging(true);
      } else {
        setIsResizing(true);
      }
    },
    [calculateNewTimes, addSchedulerDragClass]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const state = dragStateRef.current;
      if (!state) return;

      const { clientX, clientY } = getClientPos(e);
      const deltaY = clientY - state.startMouseY;
      const deltaX = clientX - state.startMouseX;

      const { newTop, newHeight, dayOffset } = calculateNewTimes(
        deltaY,
        deltaX,
        state,
        state.mode
      );

      // Get the event's original start date
      const originalStart = new Date(state.event[fields.start] as Date);
      const originalEnd = new Date(state.event[fields.end] as Date);
      const duration = differenceInMinutes(originalEnd, originalStart);

      if (state.mode === 'drag') {
        const newStart = topToDate(newTop, originalStart);
        // Apply day offset
        const adjustedStart = dayOffset !== 0 ? addDays(newStart, dayOffset) : newStart;
        const adjustedEnd = addMinutes(adjustedStart, duration);

        if (onEventDrop instanceof Function) {
          onEventDrop({
            event: state.event,
            start: adjustedStart,
            end: adjustedEnd,
            resource: state.resource,
            originalEvent: state.originalEvent,
          });
        }
      } else if (state.mode === 'resize') {
        const newEnd = topToDate(newTop + newHeight, originalStart);
        if (onEventResize instanceof Function) {
          onEventResize({
            event: state.event,
            start: originalStart,
            end: newEnd,
            originalEvent: state.originalEvent,
          });
        }
      }

      // Cleanup
      dragStateRef.current = null;
      setIsDragging(false);
      setIsResizing(false);
      setDraggedEvent(null);
      setPreviewStyle(null);
      setPreviewTitle('');
      removeSchedulerDragClass();

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    },
    [
      calculateNewTimes,
      fields,
      onEventDrop,
      onEventResize,
      topToDate,
      removeSchedulerDragClass,
      handleMouseMove,
    ]
  );

  const initDrag = useCallback(
    (
      mode: DragMode,
      event: MappedEvent,
      mouseEvent: React.MouseEvent | React.TouchEvent,
      resource?: Resource,
      eventElement?: HTMLElement
    ) => {
      mouseEvent.stopPropagation();
      mouseEvent.preventDefault();

      const nativeEvent = mouseEvent.nativeEvent;
      const { clientX, clientY } = getClientPos(nativeEvent as MouseEvent | TouchEvent);

      // Get event element positioning
      let eventTop = 0;
      let eventHeight = 0;
      let eventLeft = 0;
      let eventWidth = 0;

      if (eventElement) {
        eventTop = parseFloat(eventElement.style.top) || 0;
        eventHeight = parseFloat(eventElement.style.height) || 0;
        eventLeft = parseFloat(eventElement.style.left) || 0;
        eventWidth = parseFloat(eventElement.style.width) || 0;
      }

      const { container, containerRect, dayColumnWidth, dayColumnCount } =
        getContainerAndColumns();

      // Determine which day column the event is in
      let dayStartIndex = 0;
      if (eventElement && containerRect) {
        const eventRect = eventElement.getBoundingClientRect();
        // Find the closest day wrapper
        const dayWrappers = container?.querySelectorAll('.e-day-wrapper') || [];
        dayWrappers.forEach((wrapper, idx) => {
          const wrapperRect = wrapper.getBoundingClientRect();
          if (
            eventRect.left >= wrapperRect.left &&
            eventRect.left < wrapperRect.right
          ) {
            dayStartIndex = idx;
          }
        });
      }

      const originalEvent = { ...event };

      dragStateRef.current = {
        mode,
        event,
        resource,
        startMouseY: clientY,
        startMouseX: clientX,
        eventTop,
        eventLeft,
        eventHeight,
        eventWidth,
        containerRect,
        dayColumnWidth,
        dayColumnCount,
        dayStartIndex,
        originalEvent,
      };

      setDraggedEvent(event);
      setPreviewTitle((event[fields.subject] as string) || '');

      // Set initial preview
      const leftPx = dayStartIndex * dayColumnWidth;
      setPreviewStyle({
        position: 'absolute',
        top: `${eventTop}px`,
        left: `${leftPx}px`,
        width: `${dayColumnWidth - 4}px`,
        height: `${eventHeight}px`,
        pointerEvents: 'none',
        zIndex: 100,
        opacity: 0.7,
        border: '2px dashed #0079ff',
        background: 'rgba(0, 121, 255, 0.15)',
        borderRadius: '4px',
        transition: 'top 0.1s ease, left 0.1s ease',
      });

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
    },
    [fields, getContainerAndColumns, handleMouseMove, handleMouseUp]
  );

  const handleDragStart = useCallback(
    (
      event: MappedEvent,
      mouseEvent: React.MouseEvent | React.TouchEvent,
      resource?: Resource,
      eventElement?: HTMLElement
    ) => {
      if (!draggable) return;
      initDrag('drag', event, mouseEvent, resource, eventElement);
    },
    [draggable, initDrag]
  );

  const handleResizeStart = useCallback(
    (
      event: MappedEvent,
      mouseEvent: React.MouseEvent | React.TouchEvent,
      resource?: Resource,
      eventElement?: HTMLElement
    ) => {
      if (!resizable) return;
      initDrag('resize', event, mouseEvent, resource, eventElement);
    },
    [resizable, initDrag]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      removeSchedulerDragClass();
    };
  }, [handleMouseMove, handleMouseUp, removeSchedulerDragClass]);

  return {
    isDragging,
    isResizing,
    draggedEvent,
    previewStyle,
    previewTitle,
    handleDragStart,
    handleResizeStart,
  };
};

export default useDragAndDrop;
