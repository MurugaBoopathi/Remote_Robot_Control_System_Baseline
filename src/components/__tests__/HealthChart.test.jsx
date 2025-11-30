import { render } from '@testing-library/react';
import HealthChart from '../HealthChart';

test('renders HealthChart without crashing', () => {
  render(<HealthChart />);
});
