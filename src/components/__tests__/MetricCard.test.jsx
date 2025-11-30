import { render } from '@testing-library/react';
import MetricCard from '../MetricCard';

test('renders MetricCard without crashing', () => {
  render(<MetricCard />);
});
