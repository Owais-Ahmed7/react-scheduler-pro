# Testing Guide — react-scheduler-pro

## Overview

This guide covers the complete testing strategy for react-scheduler-pro. We use **Jest** + **React Testing Library** for unit and integration tests, with a focus on testing behavior over implementation details.

---

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:ci

# Run a specific test file
npx jest src/lib/__tests__/utils/schedular.test.ts

# Run tests matching a pattern
npx jest --testPathPattern="Scheduler"
```

---

## Project Test Structure

```
src/lib/__tests__/
├── __mocks__/
│   └── styleMock.ts          # Mock for SCSS/CSS imports
├── helpers/
│   └── testUtils.tsx          # Shared test utilities & helpers
├── utils/
│   ├── schedular.test.ts      # Core scheduling algorithm tests
│   ├── accessor.test.ts       # Property accessor tests
│   └── chunk.test.ts          # Array chunking tests
├── components/
│   └── Scheduler.test.tsx     # Main Scheduler component tests
└── hooks/
    └── (future hook tests)
```

---

## Test Categories

### 1. Unit Tests — Utility Functions

**Location**: `src/lib/__tests__/utils/`

These test the pure functions that form the core scheduling logic. They run fast and don't need any DOM.

**What to test:**
- `filterTodayEvents()` — filtering events by date, excluding all-day/multi-day
- `traverseCrossingEvents()` — finding overlapping events
- `distributeEvents()` — column layout algorithm for overlapping events
- `distributeMonthEvents()` — month view row distribution (max 3 rows)
- `differenceInDaysOmitTime()` — day span calculation
- `getResourcedEvents()` — grouping events by resource
- `convertEventTimeZone()` — timezone conversion
- `isToday()` — date comparison with timezone
- `calculateTop()` — pixel position calculation for current time bar
- `sortEventsByTheLengthest()` — duration-based sorting

**Example:**
```typescript
import { filterTodayEvents } from '../../utils/schedular';

describe('filterTodayEvents', () => {
  const fields = {
    id: '_id',
    subject: 'name',
    start: 'startDate',
    end: 'endDate',
    allDay: 'allDay',
  };

  it('should return only same-day, non-all-day events', () => {
    const today = new Date(2026, 2, 19);
    const events = [
      { _id: '1', name: 'Meeting', startDate: new Date(2026, 2, 19, 10), endDate: new Date(2026, 2, 19, 11), allDay: false },
      { _id: '2', name: 'Tomorrow', startDate: new Date(2026, 2, 20, 10), endDate: new Date(2026, 2, 20, 11), allDay: false },
    ];
    const result = filterTodayEvents(today, events, fields, undefined);
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe('1');
  });
});
```

### 2. Component Tests — Integration

**Location**: `src/lib/__tests__/components/`

These test the Scheduler component as users interact with it — rendering, clicking, navigating.

**What to test:**
- Renders without crashing with various prop combinations
- Displays correct view (day/week/month/workweek)
- Navigation buttons work (prev/next/today)
- View switching works
- Event callbacks fire correctly (`onClickEvent`, `onSlot`, `onNavigate`, `onView`)
- Custom templates render
- Resources display correctly
- Locale/message customization works

**Example:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Scheduler } from '../../index';

it('should call onView when switching views', () => {
  const onView = jest.fn();
  render(
    <Scheduler
      events={[]}
      fields={{ id: '_id', subject: 'name', start: 'startDate', end: 'endDate' }}
      view="week"
      views={['day', 'week', 'month']}
      onView={onView}
    />
  );

  fireEvent.click(screen.getByText('Month'));
  expect(onView).toHaveBeenCalledWith({ view: 'month' });
});
```

### 3. Interaction Tests (Future)

**Location**: `src/lib/__tests__/components/`

For drag-and-drop and resize:

```typescript
it('should call onEventDrop when dragging an event', () => {
  const onEventDrop = jest.fn();
  render(<Scheduler events={events} onEventDrop={onEventDrop} draggable />);

  const event = document.querySelector('.bs-appointment');
  fireEvent.mouseDown(event, { clientX: 100, clientY: 200 });
  fireEvent.mouseMove(document, { clientX: 100, clientY: 300 });
  fireEvent.mouseUp(document);

  expect(onEventDrop).toHaveBeenCalledWith(
    expect.objectContaining({
      event: expect.any(Object),
      start: expect.any(Date),
      end: expect.any(Date),
    })
  );
});
```

### 4. Accessibility Tests (Future)

```typescript
it('should be keyboard navigable', () => {
  render(<Scheduler events={events} {...defaultProps} />);

  const cell = document.querySelector('.bs-date-cells');
  cell.focus();
  fireEvent.keyDown(cell, { key: 'ArrowRight' });

  // Next cell should be focused
  expect(document.activeElement).not.toBe(cell);
});

it('should have proper ARIA labels on events', () => {
  render(<Scheduler events={events} {...defaultProps} />);

  const eventEl = document.querySelector('.bs-appointment');
  expect(eventEl).toHaveAttribute('aria-label');
  expect(eventEl).toHaveAttribute('role', 'button');
});
```

---

## Test Utilities

### `testUtils.tsx` — Shared Helpers

```typescript
import { renderScheduler, createTestEvent, createTestEvents, createOverlappingEvents } from '../helpers/testUtils';

// Render scheduler with defaults (only pass what you're testing)
renderScheduler({ view: 'month', events: myEvents });

// Create a single event
const event = createTestEvent({ name: 'Custom Name' });

// Create N events
const events = createTestEvents(10);

// Create overlapping events for layout testing
const overlapping = createOverlappingEvents();
```

---

## Configuration

### Jest Config (`jest.config.ts`)

```typescript
{
  testEnvironment: 'jsdom',                // Browser-like environment
  transform: { '^.+\\.tsx?$': 'ts-jest' }, // TypeScript support
  moduleNameMapper: {
    '\\.(scss|css)$': 'styleMock',         // Mock CSS imports
  },
  collectCoverageFrom: ['src/lib/**/*.{ts,tsx}'],
  coverageThresholds: {
    global: { branches: 60, functions: 60, lines: 70, statements: 70 }
  }
}
```

### Style Mock

SCSS imports are mocked in tests since we don't need actual styles:

```typescript
// src/lib/__tests__/__mocks__/styleMock.ts
export default {};
```

---

## Coverage

### Running Coverage

```bash
npm run test:ci
# Outputs:
#   - Terminal: text summary
#   - coverage/lcov-report/index.html: browseable HTML report
#   - coverage/cobertura-coverage.xml: for CI integration
```

### Coverage Targets

| Metric     | Target | Priority |
|-----------|--------|----------|
| Lines     | 70%    | High     |
| Functions | 60%    | High     |
| Branches  | 60%    | Medium   |
| Statements| 70%    | High     |

### What to prioritize for coverage:

1. **Core algorithms** (`utils/schedular.ts`) — these are the most critical, aim for 90%+
2. **Event callbacks** — ensure all user-facing callbacks fire correctly
3. **View rendering** — each view renders without errors
4. **Edge cases** — empty events, null resources, invalid dates

---

## CI/CD Integration

### GitHub Actions (`.github/workflows/ci.yml`)

The CI pipeline runs on every push to `main` and every PR:

1. **Lint & Type Check** — `tsc --noEmit` + ESLint
2. **Tests** — Jest with coverage report
3. **Build** — Verify the package builds successfully

Coverage reports are uploaded as artifacts for review.

---

## Writing New Tests

### Checklist for new features:

1. [ ] Add unit tests for any new utility functions
2. [ ] Add component tests for new UI behavior
3. [ ] Test edge cases (empty arrays, null values, boundary conditions)
4. [ ] Test callback props fire with correct arguments
5. [ ] Test accessibility (ARIA attributes, keyboard interaction)
6. [ ] Run `npm run test:ci` and verify coverage doesn't drop

### Naming Convention:

```
describe('ComponentOrFunction', () => {
  describe('feature or scenario', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange → Act → Assert
    });
  });
});
```

### Best Practices:

- **Test behavior, not implementation** — Don't test internal state; test what the user sees
- **Use Testing Library queries** — `screen.getByText()`, `screen.getByRole()`, `screen.getByLabelText()`
- **Avoid `container.querySelector` when possible** — Prefer accessible queries
- **Don't test third-party code** — Don't test date-fns or React internals
- **Keep tests independent** — Each test should set up its own state
- **Use `createTestEvent()` helpers** — Don't duplicate event creation

---

## Troubleshooting

### Common Issues:

**"Cannot find module '../App.scss'"**
→ The style mock isn't configured. Check `jest.config.ts` `moduleNameMapper`.

**"TypeError: Cannot read properties of null"**
→ The component likely needs a DOM element that doesn't exist in jsdom. Use `document.querySelector` carefully and check for null.

**"act() warning"**
→ State updates happening outside `act()`. Wrap interactions in `waitFor()` or `act()`.

**Tests timeout**
→ The 200ms click timer in EventItem can cause timeouts. Use `waitFor({ timeout: 500 })`.
