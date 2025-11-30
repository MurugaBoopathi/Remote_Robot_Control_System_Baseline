import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
	Battery,
	Thermometer,
	Cpu,
	AlertTriangle,
	ArrowLeft,
	Download,
	HardDrive,
	Activity
} from 'lucide-react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';
import Papa from 'papaparse';
import '../health.css';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const robotOptions = [
	{ value: '', label: 'All Robots' },
	{ value: '692bceb9157fcdde9d5bb1c3', label: 'Atlas-01' },
	{ value: '692bceeb8c7ef1d2796fcac9', label: 'Titan-02' },
	{ value: '692bceeb8c7ef1d2796fcaca', label: 'Nova-03' },
	{ value: '692bceeb8c7ef1d2796fcacc', label: 'Orion-04' },
	{ value: 'phoenix', label: 'Phoenix-05' },
];
const timeOptions = [
	{ value: '1h', label: 'Last Hour' },
	{ value: '24h', label: 'Last 24h' },
	{ value: '7d', label: 'Last 7 Days' },
	{ value: '30d', label: 'Last 30 Days' },
];

function parseCSV(csv) {
	const parsed = Papa.parse(csv, { header: true });
	return parsed.data;
}

function useHealthData() {
	const [data, setData] = useState([]);
	React.useEffect(() => {
		fetch('/src/data/HealthLog_export.csv')
			.then(r => r.text())
			.then(csv => setData(parseCSV(csv)));
	}, []);
	return data;
}

function getRobotName(id) {
	const found = robotOptions.find(r => r.value === id);
	return found ? found.label : id;
}

export default function Health() {
	const healthData = useHealthData();
	const [selectedRobot, setSelectedRobot] = useState('');
	const [selectedTime, setSelectedTime] = useState('24h');
	const [tab, setTab] = useState('charts');

	// Filter data by robot and time
	const filtered = useMemo(() => {
		let d = healthData;
		if (selectedRobot) d = d.filter(row => row.robot_id === selectedRobot);
		// Time filter: for demo, just use all
		return d;
	}, [healthData, selectedRobot, selectedTime]);

	// Metrics
	const avgBattery = useMemo(() => {
		const vals = filtered.map(r => Number(r.battery_level)).filter(Boolean);
		return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
	}, [filtered]);
	const avgTemp = useMemo(() => {
		const vals = filtered.map(r => Number(r.temperature)).filter(Boolean);
		return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
	}, [filtered]);
	const avgCPU = useMemo(() => {
		const vals = filtered.map(r => Number(r.cpu_usage)).filter(Boolean);
		return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
	}, [filtered]);
	const totalAlerts = useMemo(() => {
		return filtered.reduce((sum, r) => sum + (r.alerts && r.alerts !== '[]' ? r.alerts.split(',').length : 0), 0);
	}, [filtered]);

	// Chart data
	const chartLabels = filtered.map(r => r.timestamp ? r.timestamp.slice(11, 16) : '');
	const batteryChart = {
		labels: chartLabels,
		datasets: [
			{
				data: filtered.map(r => Number(r.battery_level)),
				borderColor: '#22c55e',
				backgroundColor: 'rgba(34,197,94,0.1)',
				fill: true,
				tension: 0.4,
				pointRadius: 0,
			},
		],
	};
	const tempChart = {
		labels: chartLabels,
		datasets: [
			{
				data: filtered.map(r => Number(r.temperature)),
				borderColor: '#f59e0b',
				backgroundColor: 'rgba(245,158,11,0.1)',
				fill: true,
				tension: 0.4,
				pointRadius: 0,
			},
		],
	};
	const cpuChart = {
		labels: chartLabels,
		datasets: [
			{
				data: filtered.map(r => Number(r.cpu_usage)),
				borderColor: '#6366f1',
				backgroundColor: 'rgba(99,102,241,0.1)',
				fill: true,
				tension: 0.4,
				pointRadius: 0,
			},
		],
	};
	const memoryChart = {
		labels: chartLabels,
		datasets: [
			{
				data: filtered.map(r => Number(r.memory_usage)),
				borderColor: '#8b5cf6',
				backgroundColor: 'rgba(139,92,246,0.1)',
				fill: true,
				tension: 0.4,
				pointRadius: 0,
			},
		],
	};
	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { display: false } },
		scales: {
			x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
			y: { min: 0, max: 100, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
		},
	};

	// Cycle counter
	const cycleCounts = useMemo(() => {
		const robots = {};
		healthData.forEach(r => {
			robots[r.robot_id] = Math.max(Number(r.cycle_count) || 0, robots[r.robot_id] || 0);
		});
		return [
			{ name: 'Atlas-01', value: robots['692bceb9157fcdde9d5bb1c3'] || 0 },
			{ name: 'Titan-02', value: robots['692bceeb8c7ef1d2796fcac9'] || 0 },
			{ name: 'Nova-03', value: robots['692bceeb8c7ef1d2796fcaca'] || 0 },
			{ name: 'Orion-04', value: robots['692bceeb8c7ef1d2796fcacc'] || 0 },
		];
	}, [healthData]);

	// Logs table
	const logs = filtered.slice(-10).reverse();

	// Alerts
	const alerts = useMemo(() => {
		return healthData
			.filter(r => r.alerts && r.alerts !== '[]')
			.flatMap(r => {
				try {
					const arr = JSON.parse(r.alerts.replace(/'/g, '"'));
					return arr.map(a => ({
						title: a,
						robot: getRobotName(r.robot_id),
						time: r.timestamp ? r.timestamp.slice(0, 16).replace('T', ', ') : '',
					}));
				} catch {
					return [];
				}
			});
	}, [healthData]);

	return (
			<div className="health-bg min-h-screen">
				<div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
					<div className="flex items-center gap-4">
						<button className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors">
							<ArrowLeft className="w-5 h-5 text-slate-600" />
						</button>
						<div>
							<h1 className="text-xl sm:text-2xl font-bold text-slate-900">Health Monitoring</h1>
							<p className="text-sm text-slate-500">System health and diagnostics</p>
						</div>
					</div>
					<div className="flex items-center gap-3 flex-wrap">
						<select
							className="w-48 h-10 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
							value={selectedRobot}
							onChange={e => setSelectedRobot(e.target.value)}
						>
							{robotOptions.map(r => (
								<option key={r.value} value={r.value}>{r.label}</option>
							))}
						</select>
						<select
							className="w-32 h-10 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
							value={selectedTime}
							onChange={e => setSelectedTime(e.target.value)}
						>
							{timeOptions.map(t => (
								<option key={t.value} value={t.value}>{t.label}</option>
							))}
						</select>
						<button className="btn flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-md bg-white text-sm font-medium hover:bg-slate-50">
							<Download className="w-4 h-4" /> Export
						</button>
					</div>
				</div>

				{/* Metric Cards */}
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
							<div className="health-metric health-metric-emerald">
								<div className="flex items-center gap-3">
									<div className="health-metric-icon health-metric-icon-emerald">
										<Battery className="w-5 h-5 text-emerald-600" />
									</div>
									<div>
										<p className="text-xs text-slate-500">Avg. Battery</p>
										<p className="health-metric-value health-metric-value-emerald">{avgBattery}%</p>
									</div>
								</div>
							</div>
							<div className="health-metric health-metric-emerald">
								<div className="flex items-center gap-3">
									<div className="health-metric-icon health-metric-icon-emerald">
										<Thermometer className="w-5 h-5 text-emerald-600" />
									</div>
									<div>
										<p className="text-xs text-slate-500">Avg. Temperature</p>
										<p className="health-metric-value health-metric-value-emerald">{avgTemp}&deg;C</p>
									</div>
								</div>
							</div>
							<div className="health-metric health-metric-emerald">
								<div className="flex items-center gap-3">
									<div className="health-metric-icon health-metric-icon-emerald">
										<Cpu className="w-5 h-5 text-emerald-600" />
									</div>
									<div>
										<p className="text-xs text-slate-500">Avg. CPU Usage</p>
										<p className="health-metric-value health-metric-value-emerald">{avgCPU}%</p>
									</div>
								</div>
							</div>
							<div className="health-metric health-metric-red">
								<div className="flex items-center gap-3">
									<div className="health-metric-icon health-metric-icon-red">
										<AlertTriangle className="w-5 h-5 text-red-600" />
									</div>
									<div>
										<p className="text-xs text-slate-500">Total Alerts</p>
										<p className="health-metric-value health-metric-value-red">{totalAlerts}</p>
									</div>
								</div>
							</div>
						</div>

				{/* Tabs */}
						<div className="health-tabs">
							<button className={`health-tab-btn${tab === 'charts' ? ' active' : ''}`} onClick={() => setTab('charts')}>Charts</button>
							<button className={`health-tab-btn${tab === 'logs' ? ' active' : ''}`} onClick={() => setTab('logs')}>Log History</button>
							<button className={`health-tab-btn${tab === 'alerts' ? ' active' : ''}`} onClick={() => setTab('alerts')}>Alerts</button>
						</div>

				{/* Tab Content */}
						{tab === 'charts' && (
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Battery Chart */}
									<div className="health-card p-5">
										<div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
											<Battery className="w-5 h-5 text-emerald-500" /> Battery Level Over Time
										</div>
										<div className="h-40">
											<Line data={batteryChart} options={chartOptions} />
										</div>
									</div>
									{/* Temperature Chart */}
									<div className="health-card p-5">
										<div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
											<Thermometer className="w-5 h-5 text-amber-500" /> Temperature Over Time
										</div>
										<div className="h-40">
											<Line data={tempChart} options={chartOptions} />
										</div>
									</div>
									{/* CPU Chart */}
									<div className="health-card p-5">
										<div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
											<Cpu className="w-5 h-5 text-indigo-500" /> CPU Usage Over Time
										</div>
										<div className="h-40">
											<Line data={cpuChart} options={chartOptions} />
										</div>
									</div>
									{/* Memory Chart */}
									<div className="health-card p-5">
										<div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
											<HardDrive className="w-5 h-5 text-purple-500" /> Memory Usage Over Time
										</div>
										<div className="h-40">
											<Line data={memoryChart} options={chartOptions} />
										</div>
									</div>
								</div>
								{/* Cycle Counter */}
								<div className="health-card p-6">
									<div className="flex items-center gap-3 mb-4">
										<Activity className="w-5 h-5 text-indigo-600" />
										<h3 className="font-semibold text-slate-800">Cycle Counter</h3>
									</div>
									<div className="health-cycle-grid">
										{cycleCounts.map(c => (
											<div key={c.name} className="health-cycle-item">
												<p className="health-cycle-name">{c.name}</p>
												<p className="health-cycle-value">{c.value.toLocaleString()}</p>
												<p className="health-cycle-label">total cycles</p>
											</div>
										))}
									</div>
								</div>
							</div>
						)}

						{tab === 'logs' && (
							<div className="health-card">
								<div className="overflow-x-auto">
									<table className="health-table min-w-full">
										<thead>
											<tr>
												<th>Timestamp</th>
												<th>Robot</th>
												<th>Battery</th>
												<th>Temp</th>
												<th>CPU</th>
												<th>Memory</th>
												<th>Cycles</th>
												<th>Alerts</th>
											</tr>
										</thead>
										<tbody>
											{logs.map((row, i) => (
												<tr key={i}>
													<td>{row.timestamp ? row.timestamp.replace('T', ', ').slice(0, 16) : ''}</td>
													<td>{getRobotName(row.robot_id)}</td>
													<td>
														<span className={`health-badge ${Number(row.battery_level) > 60 ? 'health-badge-emerald' : Number(row.battery_level) > 30 ? 'health-badge-amber' : 'health-badge-red'}`}>{row.battery_level}%</span>
													</td>
													<td className={Number(row.temperature) > 60 ? 'text-red-600' : Number(row.temperature) > 45 ? 'text-amber-600' : 'text-emerald-600'}>{row.temperature}&deg;C</td>
													<td>{row.cpu_usage}%</td>
													<td>{row.memory_usage}%</td>
													<td>{row.cycle_count}</td>
													<td>
														{row.alerts && row.alerts !== '[]' ? (
															<span className={`health-badge ${row.alerts.includes('critical') ? 'health-badge-red' : 'health-badge-amber'}`}>{row.alerts.replace(/\[|\]|"/g, '').split(',').length}</span>
														) : (
															<span className="text-slate-500">-</span>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{tab === 'alerts' && (
							<div className="health-card p-6">
								<div className="space-y-3">
									{alerts.length === 0 && (
										<div className="health-empty-state">
											<AlertTriangle />
											<p>No alerts found.</p>
										</div>
									)}
									{alerts.map((a, i) => (
										<div key={i} className={`health-alert ${a.title.toLowerCase().includes('critical') || a.title.toLowerCase().includes('warning') ? '' : 'bg-amber-50 border-amber-200'}`}>
											<AlertTriangle className={a.title.toLowerCase().includes('critical') || a.title.toLowerCase().includes('warning') ? 'text-red-600' : 'text-amber-600'} />
											<div style={{flex:1}}>
												<p className="health-alert-title">{a.title}</p>
												<p className="health-alert-meta">{a.robot} &bull; {a.time}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
			</div>
		</div>
	);
}
