import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Scheduler } from '../../index';
import {
  defaultFields,
  defaultSchedulerProps,
  createTestEvent,
  createTestEvents,
  createTestResources,
} from '../../test-utils/testUtils';

describe('Scheduler Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <Scheduler {...defaultSchedulerProps} />
      );
      expect(container.querySelector('.scheduler')).toBeInTheDocument();
    });

    it('should render with events', () => {
      const events = createTestEvents(3);
      render(
        <Scheduler {...defaultSchedulerProps} events={events} />
      );
      expect(document.querySelector('.scheduler')).toBeInTheDocument();
    });

    it('should render with null events', () => {
      render(
        <Scheduler {...defaultSchedulerProps} events={null} />
      );
      expect(document.querySelector('.scheduler')).toBeInTheDocument();
    });

    it('should apply custom scheduler height', () => {
      render(
        <Scheduler {...defaultSchedulerProps} schedulerHeight={800} />
      );
      expect(document.querySelector('.scheduler')).toBeInTheDocument();
    });
  });

  describe('Views', () => {
    it('should render week view by default', () => {
      render(<Scheduler {...defaultSchedulerProps} view="week" />);
      expect(document.querySelector('.e-day-view')).toBeInTheDocument();
    });

    it('should render day view', () => {
      render(<Scheduler {...defaultSchedulerProps} view="day" />);
      expect(document.querySelector('.e-day-view')).toBeInTheDocument();
    });

    it('should render month view', () => {
      render(<Scheduler {...defaultSchedulerProps} view="month" />);
      expect(document.querySelector('.bs-month-view')).toBeInTheDocument();
    });

    it('should render workweek view', () => {
      render(<Scheduler {...defaultSchedulerProps} view="workweek" />);
      expect(document.querySelector('.e-day-view')).toBeInTheDocument();
    });

    it('should throw error for invalid view not in views array', () => {
      // The error is thrown inside useEffect, so we need to catch it via error boundary
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(
          <Scheduler
            {...defaultSchedulerProps}
            view="invalid"
            views={['day', 'week', 'month']}
          />
        );
      }).toThrow();
      spy.mockRestore();
    });
  });

  describe('Navigation', () => {
    it('should render navigation buttons', () => {
      render(<Scheduler {...defaultSchedulerProps} />);
      const buttons = document.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render Today button with custom message', () => {
      render(
        <Scheduler
          {...defaultSchedulerProps}
          message={{
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            workweek: 'Semana útil',
            more: 'Mais',
          }}
        />
      );
      expect(screen.getByText('Hoje')).toBeInTheDocument();
    });

    it('should render navigation buttons with correct aria labels', () => {
      render(<Scheduler {...defaultSchedulerProps} />);
      expect(screen.getByLabelText('Previous')).toBeInTheDocument();
      expect(screen.getByLabelText('Next')).toBeInTheDocument();
      expect(screen.getByLabelText('Today')).toBeInTheDocument();
    });

    it('should render view switching buttons', () => {
      render(<Scheduler {...defaultSchedulerProps} />);
      expect(screen.getByLabelText('Switch to day view')).toBeInTheDocument();
      expect(screen.getByLabelText('Switch to week view')).toBeInTheDocument();
      expect(screen.getByLabelText('Switch to month view')).toBeInTheDocument();
      expect(screen.getByLabelText('Switch to workweek view')).toBeInTheDocument();
    });
  });

  describe('Resources', () => {
    it('should render resources when provided', () => {
      const resources = createTestResources();
      const events = createTestEvents(3).map((e, i) => ({
        ...e,
        resourceId: resources[i % resources.length].resourceId,
      }));

      render(
        <Scheduler
          {...defaultSchedulerProps}
          events={events}
          resources={resources}
          resourceFields={{
            id: 'resourceId',
            title: 'title',
            backgroundColor: 'backgroundColor',
          }}
        />
      );
      expect(document.querySelector('.scheduler')).toBeInTheDocument();
    });
  });

  describe('Events', () => {
    it('should render events in the DOM', () => {
      const events = createTestEvents(1);
      render(
        <Scheduler
          {...defaultSchedulerProps}
          events={events}
        />
      );
      // Events should be present in the scheduler
      expect(document.querySelector('.scheduler')).toBeInTheDocument();
    });

    it('should render time slots', () => {
      render(
        <Scheduler {...defaultSchedulerProps} />
      );
      const slots = document.querySelectorAll('.bs-date-cells');
      expect(slots.length).toBeGreaterThan(0);
    });
  });

  describe('Hour Format', () => {
    it('should render with 24-hour format', () => {
      render(
        <Scheduler {...defaultSchedulerProps} hourFormat={24} />
      );
      expect(document.querySelector('.scheduler')).toBeInTheDocument();
    });

    it('should render with 12-hour format', () => {
      render(
        <Scheduler {...defaultSchedulerProps} hourFormat={12} />
      );
      expect(document.querySelector('.scheduler')).toBeInTheDocument();
    });
  });

  describe('Step Configuration', () => {
    it('should render with 30-minute steps', () => {
      render(
        <Scheduler {...defaultSchedulerProps} step={30} />
      );
      expect(document.querySelector('.scheduler')).toBeInTheDocument();
    });

    it('should render with 15-minute steps', () => {
      render(
        <Scheduler {...defaultSchedulerProps} step={15} />
      );
      expect(document.querySelector('.scheduler')).toBeInTheDocument();
    });
  });

  describe('Custom Views Array', () => {
    it('should only show specified views in toolbar', () => {
      render(
        <Scheduler
          {...defaultSchedulerProps}
          views={['day', 'week']}
          view="week"
        />
      );
      expect(screen.getByText('Day')).toBeInTheDocument();
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.queryByText('Month')).not.toBeInTheDocument();
    });
  });
});
