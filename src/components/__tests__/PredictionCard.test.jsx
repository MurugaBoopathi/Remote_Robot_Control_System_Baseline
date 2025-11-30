import { render } from '@testing-library/react';
import PredictionCard from '../PredictionCard';

test('renders PredictionCard without crashing', () => {
  render(<PredictionCard />);
});
