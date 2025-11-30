import { render } from '@testing-library/react';
import RobotCard from '../RobotCard';

test('renders RobotCard without crashing', () => {
  render(<RobotCard />);
});
