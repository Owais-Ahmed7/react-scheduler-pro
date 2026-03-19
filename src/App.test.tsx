import { render } from '@testing-library/react';
import App from './App';

test('renders scheduler', () => {
  const { container } = render(<App />);
  expect(container.querySelector('.scheduler')).toBeInTheDocument();
});
