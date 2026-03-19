import { useCallback, useEffect, useRef } from 'react';

interface UseKeyboardNavigationProps {
  containerRef: React.RefObject<HTMLElement>;
  onEscape?: () => void;
}

const useKeyboardNavigation = ({ containerRef, onEscape }: UseKeyboardNavigationProps) => {
  const focusedCellRef = useRef<{ row: number; col: number }>({ row: 0, col: 0 });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      '[role="gridcell"], [role="button"], .bs-date-cells, .bs-work-cells'
    );

    const currentFocused = document.activeElement;
    const currentIndex = Array.from(focusableElements).indexOf(currentFocused as Element);

    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault();
        const next = focusableElements[currentIndex + 1] as HTMLElement;
        if (next) next.focus();
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        const prev = focusableElements[currentIndex - 1] as HTMLElement;
        if (prev) prev.focus();
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        // Move to same column, next row — need to know grid width
        const cols = container.querySelectorAll('.bs-row > [role="gridcell"], .bs-row > .bs-date-cells').length /
          (container.querySelectorAll('.bs-row').length || 1);
        const nextRow = focusableElements[currentIndex + (cols || 7)] as HTMLElement;
        if (nextRow) nextRow.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const cols2 = container.querySelectorAll('.bs-row > [role="gridcell"], .bs-row > .bs-date-cells').length /
          (container.querySelectorAll('.bs-row').length || 1);
        const prevRow = focusableElements[currentIndex - (cols2 || 7)] as HTMLElement;
        if (prevRow) prevRow.focus();
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (currentFocused) {
          (currentFocused as HTMLElement).click();
        }
        break;
      }
      case 'Escape': {
        if (onEscape) {
          onEscape();
        }
        break;
      }
      case 'Tab': {
        // Allow default tab behavior but manage focus trap in modals
        break;
      }
    }
  }, [containerRef, onEscape]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, handleKeyDown]);

  return { focusedCellRef };
};

export default useKeyboardNavigation;
