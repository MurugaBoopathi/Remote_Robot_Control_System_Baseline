# Remote Robot Management System

This project is a modern web dashboard for monitoring, controlling, and analyzing the health and performance of robots in the remote fleet. Built with React, Vite, Chart.js, Lucide React, and custom CSS, it provides real-time insights and predictive analytics for robot operations.

## Features

### 1. Dashboard Overview
- **Metric Cards:** Display average battery, temperature, CPU usage, and total alerts.
- **Charts Tab:** Visualize battery, temperature, CPU, and memory usage over time with interactive charts.
- **Log History Tab:** Browse recent logs for each robot, including battery, temperature, CPU, memory, cycles, and alerts.
- **Alerts Tab:** View and filter system alerts, warnings, and maintenance notifications.
- **Robot & Time Selectors:** Filter data by robot and time range.
- **Export Button:** Download data for further analysis.

### 3. Predictions Page
- **Metrics & Recommendations:** See AI-powered predictions for maintenance, battery runtime, wear level, and system risk.
- **Charts & Forecasts:** Visualize future battery levels and usage cycles.
- **Maintenance Alerts:** Get recommendations for upcoming maintenance and high-risk components.

### 4. Data Integration
- **CSV Data:** Real robot health and prediction data is loaded from CSV files in `/src/data/`.
- **Dynamic Filtering:** All metrics, charts, logs, and alerts update based on selected robot and time range.

### 5. UI & Styling
- **Responsive Design:** Works on desktop and mobile.
- **Custom CSS:** Segregated styles for Health and Predictions pages for clarity and maintainability.
- **Lucide Icons:** Modern iconography for all dashboard elements.
- **Tailwind Utility Classes:** Used for layout and spacing.

## Getting Started

1. **Install dependencies:**
   ```
   npm install
   ```
2. **Start the development server:**
   ```
   npm run dev
   ```
3. **Open in browser:**
   Visit `http://localhost:5173/`

## Project Structure

```
robot-management-app/
├── index.html
├── package.json
├── vite.config.js
├── babel.config.cjs
├── jest.config.cjs
├── src/
│   ├── App.jsx
│   ├── Layout.jsx
│   ├── main.jsx
│   ├── api/
│   │   └── robotApiClient.js
│   ├── assets/
│   ├── components/
│   │   ├── HealthChart.jsx
│   │   ├── JointDetailPanel.jsx
│   │   ├── JointVisualizer.jsx
│   │   ├── MetricCard.jsx
│   │   ├── PathMap.jsx
│   │   ├── PredictionCard.jsx
│   │   ├── RobotCard.jsx
│   │   ├── Tabs.jsx
│   │   └── __tests__/
│   │       ├── HealthChart.test.jsx
│   │       ├── JointDetailPanel.test.jsx
│   │       ├── JointVisualizer.test.jsx
│   │       ├── MetricCard.test.jsx
│   │       ├── PathMap.test.jsx
│   │       ├── PredictionCard.test.jsx
│   │       ├── RobotCard.test.jsx
│   │       └── Tabs.test.jsx
│   ├── data/
│   │   ├── HealthLog_export.csv
│   │   ├── JointData_export.csv
│   │   ├── PathLog_export.csv
│   │   ├── Robot_export.csv
│   │   └── UpdateLog_export.csv
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Health.jsx
│   │   ├── Kinematics.jsx
│   │   ├── Predictions.jsx
│   │   ├── Robots.jsx
│   │   ├── TeleOperation.jsx
│   │   └── Updates.jsx
│   └── styles/
│       ├── health.css
│       ├── predictions.css
│       └── styles.css
├── public/
│   ├── Robot_export.csv
│   └── assets/
├── README.md
```

## Technologies Used
- React
- Vite
- Chart.js & react-chartjs-2
- Lucide React
- Tailwind CSS (utility classes)
- Custom CSS
- PapaParse (CSV parsing)
- Jest (unit testing)
- @testing-library/react & @testing-library/jest-dom (React component testing)
- Babel (for Jest and ES module support)

## Testing

Basic test cases for all components are located in `src/components/__tests__/`.
To run all tests:
```bash
npm test
```

## How to Contribute
1. Fork the repository on GitHub.
2. Clone your fork locally.
3. Create a new branch for your feature or fix.
4. Commit and push your changes.
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For questions or support, please open an issue on GitHub or contact the maintainer.