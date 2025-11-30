# Base44 Robot Management System

This project is a modern web dashboard for monitoring, controlling, and analyzing the health and performance of robots in the Base44 fleet. Built with React, Vite, Chart.js, Lucide React, and custom CSS, it provides real-time insights and predictive analytics for robot operations.

## Features

### 1. Dashboard Overview
- **AI Predictions:** View predictive analytics and forecasting for robot health, battery, maintenance, and usage.
- **Health Monitoring:** Track system health, diagnostics, and alerts for all robots.
- **Cycle Counter:** See total cycles for each robot in the fleet.

### 2. Health Page
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
base44_clone/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── Layout.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── health.css
│   ├── predictions.css
│   ├── api/
│   │   └── base44Client.js
│   ├── components/
│   │   ├── MetricCard.jsx
│   │   ├── PredictionCard.jsx
│   │   ├── RobotCard.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Health.jsx
│   │   ├── Kinematics.jsx
│   │   ├── Predictions.jsx
│   │   ├── Robots.jsx
│   │   ├── TeleOperation.jsx
│   │   ├── Updates.jsx
│   ├── data/
│   │   ├── HealthLog_export.csv
│   │   ├── JointData_export.csv
│   │   ├── PathLog_export.csv
│   │   ├── UpdateLog_export.csv
```

## Technologies Used
- React
- Vite
- Chart.js & react-chartjs-2
- Lucide React
- Tailwind CSS
- Custom CSS
- PapaParse (CSV parsing)

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
