
import React, { useState, useEffect } from 'react';
// Utility to parse CSV to array of objects
function parseCSV(csv) {
	const lines = csv.trim().split('\n');
	const headers = lines[0].split(',');
	return lines.slice(1).map(line => {
		const values = line.match(/("[^"]*"|[^,]+)/g) || [];
		return headers.reduce((obj, h, i) => {
			let v = values[i] || '';
			if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
			obj[h] = v;
			return obj;
		}, {});
	});
}

function useCSVData(file) {
	const [data, setData] = useState([]);
	useEffect(() => {
		fetch(file)
			.then(r => r.text())
			.then(t => setData(parseCSV(t)));
	}, [file]);
	return data;
}
import { Line, Bar } from 'react-chartjs-2';
import {
	Brain,
	ArrowLeft,
	Sparkles,
	Battery,
	Wrench,
	TrendingUp,
	AlertTriangle,
	Calendar,
	AlertOctagon,
	TrendingDown,
	Target
} from 'lucide-react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';
import '../predictions.css';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const robots = [
	{ value: 'atlas', label: 'Atlas-01', status: 'online' },
	{ value: 'titan', label: 'Titan-02', status: 'online' },
	{ value: 'nova', label: 'Nova-03', status: 'maintenance' },
	{ value: 'orion', label: 'Orion-04', status: 'error' },
	{ value: 'phoenix', label: 'Phoenix-05', status: 'online' },
];

export default function Predictions() {
	const [selectedRobot, setSelectedRobot] = useState('');

		// Load CSV data
		const healthLogs = useCSVData('/src/data/HealthLog_export.csv');
		const jointData = useCSVData('/src/data/JointData_export.csv');
		const pathLogs = useCSVData('/src/data/PathLog_export.csv');
		const updateLogs = useCSVData('/src/data/UpdateLog_export.csv');

		// Filter by selected robot
		const selectedRobotId = robots.find(r => r.value === selectedRobot)?.value;
		let health = healthLogs.filter(h => h.robot_id === selectedRobotId);
		let joints = jointData.filter(j => j.robot_id === selectedRobotId);
		let paths = pathLogs.filter(p => p.robot_id === selectedRobotId);
		let updates = updateLogs.filter(u => u.robot_id === selectedRobotId);

		// Provide unique mock data if no real data is found for the selected robot
		if (health.length === 0) {
			const mockHealths = {
				atlas: [84, 82, 80, 78, 76, 74, 72],
				titan: [91, 89, 87, 85, 83, 81, 79],
				nova: [65, 63, 61, 59, 57, 55, 53],
				orion: [50, 48, 46, 44, 42, 40, 38],
				phoenix: [99, 97, 95, 93, 91, 89, 87],
			};
			health = mockHealths[selectedRobotId]?.map((battery, i) => ({
				robot_id: selectedRobotId,
				timestamp: `2025-12-01T${String(i*2).padStart(2,'0')}:00`,
				battery_level: battery,
				motor_health: battery + 10,
				alerts: i === 2 && selectedRobotId === 'orion' ? "['Critical failure detected']" : '[]',
			})) || [];
		}
		if (joints.length === 0) {
			const mockJoints = {
				atlas: [{joint_id:'J1',joint_name:'Shoulder',status:'normal',wear_level:12},{joint_id:'J2',joint_name:'Elbow',status:'warning',wear_level:42}],
				titan: [{joint_id:'J3',joint_name:'Knee',status:'normal',wear_level:18},{joint_id:'J4',joint_name:'Wrist',status:'error',wear_level:65}],
				nova: [{joint_id:'J5',joint_name:'Hip',status:'warning',wear_level:55}],
				orion: [{joint_id:'J6',joint_name:'Ankle',status:'error',wear_level:78}],
				phoenix: [{joint_id:'J7',joint_name:'Torso',status:'normal',wear_level:8}],
			};
			joints = mockJoints[selectedRobotId] || [];
		}
		if (paths.length === 0) {
			const mockPaths = {
				atlas: [1200, 1300, 1400, 1500, 1600, 1700, 1800],
				titan: [2200, 2300, 2400, 2500, 2600, 2700, 2800],
				nova: [800, 900, 1000, 1100, 1200, 1300, 1400],
				orion: [400, 500, 600, 700, 800, 900, 1000],
				phoenix: [3200, 3300, 3400, 3500, 3600, 3700, 3800],
			};
			paths = (mockPaths[selectedRobotId] || []).map((distance, i) => ({
				robot_id: selectedRobotId,
				start_time: `2025-12-0${i+1}T08:00`,
				total_distance: distance,
			}));
		}
		if (updates.length === 0) {
			updates = [{robot_id:selectedRobotId,update_type:'firmware',version_from:'1.0',version_to:'1.1'}];
		}

		// Prepare battery chart data
		const batteryData = health.length > 0 ? {
			labels: health.map(h => h.timestamp.split('T')[1].slice(0,5)),
			datasets: [{
				data: health.map(h => Number(h.battery_level)),
				borderColor: '#6366f1',
				backgroundColor: 'rgba(99,102,241,0.1)',
				fill: true,
				tension: 0.4,
				pointRadius: 0,
			}],
		} : {
			labels: ['+0h', '+2h', '+4h', '+6h', '+8h', '+10h', '+12h'],
			datasets: [{ data: [87,77,67,57,47,37,27], borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.1)', fill:true, tension:0.4, pointRadius:0 }],
		};
		const batteryOptions = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: { legend: { display: false } },
			scales: {
				x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
				y: { min: 0, max: 100, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
			},
		};

		// Prepare usage chart data
		const usageData = paths.length > 0 ? {
			labels: paths.map(p => p.start_time ? p.start_time.split('T')[0] : ''),
			datasets: [{
				data: paths.map(p => Number(p.total_distance)),
				backgroundColor: '#6366f1',
				borderRadius: 4,
			}],
		} : {
			labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
			datasets: [{ data: [1245,2745,4245,5745,7245,8745,10245], backgroundColor:'#6366f1', borderRadius:4 }],
		};
		const usageOptions = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: { legend: { display: false } },
			scales: {
				x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
				y: {
					grid: { color: '#f1f5f9' },
					ticks: {
						font: { size: 10 },
						color: '#94a3b8',
						callback: v => (v / 1000) + 'k',
					},
				},
			},
		};

		// Quick Insights (use latest health log)
		const latestHealth = health[health.length-1] || {};
		const systemHealth = latestHealth.motor_health || '84';
		const batteryRuntime = latestHealth.battery_level || '87';
		const avgWear = joints.length > 0 ? Math.round(joints.reduce((a,j)=>a+Number(j.wear_level),0)/joints.length) : 24;
		const maintenanceJoints = joints.filter(j => j.status === 'warning' || j.status === 'error');

		// Maintenance predictions (show top risk joints)
		const jointRisks = maintenanceJoints.map(j => ({
			id: j.joint_id,
			name: j.joint_name,
			risk: j.status,
			wear: j.wear_level,
			group: j.joint_group,
		}));

		// Alerts
		const alerts = health.flatMap(h => h.alerts && h.alerts !== '[]' ? JSON.parse(h.alerts.replace(/''/g,'"')) : []);

		// Recommendations (simple logic)
		const recommendations = [];
		if (maintenanceJoints.length > 0) {
			recommendations.push('Schedule maintenance for ' + maintenanceJoints.length + ' high-wear joints soon to prevent failures.');
		}
		if (alerts.length > 0) {
			recommendations.push('Check system alerts: ' + alerts.join(', '));
		}
		if (maintenanceJoints.length === 0 && alerts.length === 0) {
			recommendations.push('System is operating optimally. Continue current maintenance schedule.');
		}

	return (
		<div className="predictions-bg">
			<div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 predictions-section">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl predictions-shadow">
								<Brain className="w-5 h-5 text-white" />
							</div>
							<div>
								<h1 className="predictions-header">AI Predictions</h1>
								<p className="text-sm text-slate-500">Predictive analytics & forecasting</p>
							</div>
						</div>
					</div>
					<div className="relative">
						<select
							className="predictions-selector"
							value={selectedRobot}
							onChange={e => setSelectedRobot(e.target.value)}
						>
							<option value="">Select robot</option>
							{robots.map(r => (
								<option key={r.value} value={r.value}>{r.label}</option>
							))}
						</select>
					</div>
				</div>

								{/* Empty State */}
								{!selectedRobot && (
											<div className="p-12 border-0 predictions-card predictions-blur text-center predictions-shadow">
												<Brain className="w-16 h-16 mx-auto text-indigo-200 mb-4 predictions-animate-pulse" />
												<h3 className="text-lg font-bold predictions-header mb-2">Select a Robot</h3>
												<p className="text-slate-500">Choose a robot to view AI-powered predictions</p>
										</div>
								)}

		    {/* Predictions Content */}
		    {selectedRobot && (
			    <div className="space-y-6">
					  {/* Quick Insights - 4 Cards (with real data) */}
					  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 predictions-section">
									{/* System Health Card */}
									<div className="p-5 predictions-card predictions-gradient predictions-blur overflow-hidden relative">
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-3">
												<div className="p-2 rounded-lg bg-emerald-100">
													<Sparkles className="w-5 h-5 text-emerald-600" />
												</div>
												<div>
													<h4 className="font-semibold text-slate-800">System Health</h4>
													<p className="text-xs text-slate-500">Overall system score</p>
												</div>
											</div>
											<span className="px-2 py-1 text-xs rounded-full border bg-emerald-100 text-emerald-700 border-emerald-200">low risk</span>
										</div>
										<p className="text-2xl font-bold text-slate-800 mb-2">{systemHealth}%</p>
										<div>
											<div className="flex justify-between text-xs text-slate-500 mb-1">
												<span>Confidence</span>
												<span>{systemHealth}%</span>
											</div>
											<div className="w-full bg-slate-200 rounded-full h-1.5">
												<div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${systemHealth}%` }}></div>
											</div>
										</div>
									</div>
									{/* Battery Runtime Card */}
									<div className="p-5 predictions-card predictions-gradient predictions-blur overflow-hidden relative">
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-3">
												<div className="p-2 rounded-lg bg-emerald-100">
													<Battery className="w-5 h-5 text-emerald-600" />
												</div>
												<div>
													<h4 className="font-semibold text-slate-800">Battery Runtime</h4>
													<p className="text-xs text-slate-500">Estimated remaining</p>
												</div>
											</div>
											<span className="px-2 py-1 text-xs rounded-full border bg-emerald-100 text-emerald-700 border-emerald-200">low risk</span>
										</div>
										<p className="text-2xl font-bold text-slate-800 mb-2">{batteryRuntime}%</p>
										<div>
											<div className="flex justify-between text-xs text-slate-500 mb-1">
												<span>Confidence</span>
												<span>{batteryRuntime}%</span>
											</div>
											<div className="w-full bg-slate-200 rounded-full h-1.5">
												<div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${batteryRuntime}%` }}></div>
											</div>
										</div>
									</div>
									{/* Maintenance Alert Card */}
									<div className="p-5 predictions-card predictions-gradient predictions-blur overflow-hidden relative" style={{background: 'linear-gradient(135deg,#fef3c7 0%,#fff 100%)'}}>
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-3">
												<div className="p-2 rounded-lg bg-amber-100">
													<Wrench className="w-5 h-5 text-amber-600" />
												</div>
												<div>
													<h4 className="font-semibold text-slate-800">Maintenance Alert</h4>
													<p className="text-xs text-slate-500">Need attention</p>
												</div>
											</div>
											<span className="px-2 py-1 text-xs rounded-full border bg-amber-100 text-amber-700 border-amber-200">medium risk</span>
										</div>
										<p className="text-2xl font-bold text-slate-800 mb-2">{maintenanceJoints.length} joints</p>
										<div>
											<div className="flex justify-between text-xs text-slate-500 mb-1">
												<span>Confidence</span>
												<span>{maintenanceJoints.length > 0 ? '92%' : '100%'}</span>
											</div>
											<div className="w-full bg-slate-200 rounded-full h-1.5">
												<div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: maintenanceJoints.length > 0 ? '92%' : '100%' }}></div>
											</div>
										</div>
									</div>
									{/* Avg Wear Level Card */}
									<div className="p-5 predictions-card predictions-gradient predictions-blur overflow-hidden relative">
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-3">
												<div className="p-2 rounded-lg bg-emerald-100">
													<TrendingUp className="w-5 h-5 text-emerald-600" />
												</div>
												<div>
													<h4 className="font-semibold text-slate-800">Avg Wear Level</h4>
													<p className="text-xs text-slate-500">Joint wear average</p>
												</div>
											</div>
											<span className="px-2 py-1 text-xs rounded-full border bg-emerald-100 text-emerald-700 border-emerald-200">low risk</span>
										</div>
										<p className="text-2xl font-bold text-slate-800 mb-2">{avgWear}%</p>
										<div>
											<div className="flex justify-between text-xs text-slate-500 mb-1">
												<span>Confidence</span>
												<span>{avgWear}%</span>
											</div>
											<div className="w-full bg-slate-200 rounded-full h-1.5">
												<div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${avgWear}%` }}></div>
											</div>
										</div>
									</div>
								</div>

						{/* Detailed Predictions - 2x2 Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 predictions-section">
							{/* Maintenance Prediction Card */}
							  <div className="p-5 predictions-card predictions-blur">
								<div className="flex items-center gap-2 mb-4">
									<Wrench className="w-5 h-5 text-indigo-600" />
									<h3 className="font-semibold text-slate-800">Maintenance Predictions</h3>
								</div>
								{/* Warning Box */}
								<div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
									<div className="flex items-center gap-2 mb-2">
										<AlertTriangle className="w-4 h-4 text-amber-600" />
										<span className="font-medium text-amber-800">Attention Required</span>
									</div>
									<p className="text-sm text-amber-600">2 joints need maintenance within 30 days</p>
								</div>
								{/* Joint List */}
								<div className="space-y-3 max-h-80 overflow-y-auto">
									{/* Joint Item - High Risk */}
									<div className="p-3 rounded-lg border bg-red-50 border-red-200">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2">
												<span className="font-medium text-slate-700">J12</span>
												<span className="text-sm text-slate-500">Right Shoulder Pitch</span>
											</div>
											<span className="px-2 py-0.5 text-xs rounded-full border border-red-400 text-red-600">5d</span>
										</div>
										<div className="flex items-center gap-2 mb-2">
											<div className="flex-1 bg-red-200 rounded-full h-1.5">
												<div className="bg-red-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
											</div>
											<span className="text-xs text-slate-500 w-10">78%</span>
										</div>
										<div className="flex items-center gap-1 text-xs text-slate-500">
											<Calendar className="w-3 h-3" />
											<span>Est. maintenance: Jan 19, 2025</span>
										</div>
									</div>
									{/* Joint Item - Medium Risk */}
									<div className="p-3 rounded-lg border bg-amber-50 border-amber-200">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2">
												<span className="font-medium text-slate-700">J8</span>
												<span className="text-sm text-slate-500">Left Elbow Yaw</span>
											</div>
											<span className="px-2 py-0.5 text-xs rounded-full border border-amber-400 text-amber-600">18d</span>
										</div>
										<div className="flex items-center gap-2 mb-2">
											<div className="flex-1 bg-amber-200 rounded-full h-1.5">
												<div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '52%' }}></div>
											</div>
											<span className="text-xs text-slate-500 w-10">52%</span>
										</div>
										<div className="flex items-center gap-1 text-xs text-slate-500">
											<Calendar className="w-3 h-3" />
											<span>Est. maintenance: Feb 01, 2025</span>
										</div>
									</div>
									{/* Joint Item - Low Risk */}
									<div className="p-3 rounded-lg border bg-slate-50 border-slate-200">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2">
												<span className="font-medium text-slate-700">J22</span>
												<span className="text-sm text-slate-500">Torso Roll</span>
											</div>
											<span className="px-2 py-0.5 text-xs rounded-full border border-emerald-400 text-emerald-600">45d</span>
										</div>
										<div className="flex items-center gap-2 mb-2">
											<div className="flex-1 bg-slate-200 rounded-full h-1.5">
												<div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '28%' }}></div>
											</div>
											<span className="text-xs text-slate-500 w-10">28%</span>
										</div>
										<div className="flex items-center gap-1 text-xs text-slate-500">
											<Calendar className="w-3 h-3" />
											<span>Est. maintenance: Feb 28, 2025</span>
										</div>
									</div>
									{/* Joint Item - Low Risk */}
									<div className="p-3 rounded-lg border bg-slate-50 border-slate-200">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2">
												<span className="font-medium text-slate-700">J35</span>
												<span className="text-sm text-slate-500">Left Ankle Pitch</span>
											</div>
											<span className="px-2 py-0.5 text-xs rounded-full border border-emerald-400 text-emerald-600">62d</span>
										</div>
										<div className="flex items-center gap-2 mb-2">
											<div className="flex-1 bg-slate-200 rounded-full h-1.5">
												<div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
											</div>
											<span className="text-xs text-slate-500 w-10">15%</span>
										</div>
										<div className="flex items-center gap-1 text-xs text-slate-500">
											<Calendar className="w-3 h-3" />
											<span>Est. maintenance: Mar 17, 2025</span>
										</div>
									</div>
								</div>
							</div>
							{/* Battery Prediction Card */}
							  <div className="p-5 predictions-card predictions-blur">
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-2">
										<Battery className="w-5 h-5 text-emerald-600" />
										<h3 className="font-semibold text-slate-800">Battery Prediction</h3>
									</div>
									<span className="px-2 py-0.5 text-xs rounded-full border border-emerald-400 text-emerald-600">low risk</span>
								</div>
								<div className="grid grid-cols-2 gap-4 mb-4">
									<div className="p-3 bg-slate-50 rounded-lg">
										<p className="text-xs text-slate-500 mb-1">Current Level</p>
										<p className="text-2xl font-bold text-emerald-600">87%</p>
									</div>
									<div className="p-3 bg-slate-50 rounded-lg">
										<p className="text-xs text-slate-500 mb-1">Time Remaining</p>
										<p className="text-2xl font-bold text-slate-800">17h 24m</p>
									</div>
								</div>
								<div className="mb-4">
									<div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
										<TrendingDown className="w-4 h-4" />
										<span>Drain rate: ~5.0% per hour</span>
									</div>
								</div>
								{/* Battery Chart */}
								<div className="h-32 mb-3">
									<Line data={batteryData} options={batteryOptions} />
								</div>
								<p className="text-xs text-slate-400 text-center mt-2">
									Predicted battery level over next 12 hours
								</p>
							</div>
							{/* Failure Prediction Card */}
							  <div className="p-5 predictions-card predictions-blur">
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-2">
										<AlertOctagon className="w-5 h-5 text-emerald-600" />
										<h3 className="font-semibold text-slate-800">Failure Prediction</h3>
									</div>
									<span className="px-2 py-0.5 text-xs rounded-full border border-emerald-400 text-emerald-600">normal</span>
								</div>
								{/* System Overview */}
								<div className="grid grid-cols-3 gap-3 mb-4">
									<div className="p-3 rounded-lg text-center bg-slate-50">
										<p className="text-2xl font-bold text-slate-400">0</p>
										<p className="text-xs text-slate-500">Critical</p>
									</div>
									<div className="p-3 rounded-lg text-center bg-amber-50">
										<p className="text-2xl font-bold text-amber-600">2</p>
										<p className="text-xs text-slate-500">Elevated</p>
									</div>
									<div className="p-3 rounded-lg bg-emerald-50 text-center">
										<p className="text-2xl font-bold text-emerald-600">40</p>
										<p className="text-xs text-slate-500">Normal</p>
									</div>
								</div>
								{/* System Risk Score */}
								<div className="mb-4 p-3 bg-slate-50 rounded-lg">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium text-slate-700">System Risk Score</span>
										<span className="font-bold text-emerald-600">18%</span>
									</div>
									<div className="w-full bg-slate-200 rounded-full h-2">
										<div className="bg-emerald-500 h-2 rounded-full" style={{ width: '18%' }}></div>
									</div>
								</div>
								{/* High Risk Components */}
								<h4 className="text-sm font-medium text-slate-700 mb-2">High Risk Components</h4>
								<div className="space-y-2 max-h-48 overflow-y-auto">
									<div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 rounded-full bg-amber-500"></div>
											<span className="text-sm text-slate-700">J12 - Right Shoulder Pitch</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-16 bg-slate-200 rounded-full h-1.5">
												<div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
											</div>
											<span className="text-xs text-slate-500 w-8">45%</span>
										</div>
									</div>
									<div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 rounded-full bg-amber-500"></div>
											<span className="text-sm text-slate-700">J8 - Left Elbow Yaw</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-16 bg-slate-200 rounded-full h-1.5">
												<div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '38%' }}></div>
											</div>
											<span className="text-xs text-slate-500 w-8">38%</span>
										</div>
									</div>
								</div>
							</div>
							{/* Usage Prediction Card */}
							  <div className="p-5 border-0 bg-white/80 predictions-blur rounded-xl predictions-shadow">
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-2">
										<TrendingUp className="w-5 h-5 text-indigo-600" />
										<h3 className="font-semibold text-slate-800">Usage Prediction</h3>
									</div>
									<span className="px-2 py-0.5 text-xs rounded-full border border-indigo-300 text-indigo-600">50 cycles/day</span>
								</div>
								{/* Current Stats */}
								<div className="grid grid-cols-2 gap-3 mb-4">
									<div className="p-3 bg-indigo-50 rounded-lg">
										<p className="text-xs text-slate-500 mb-1">Total Cycles</p>
										<p className="text-xl font-bold text-indigo-600">1,245</p>
									</div>
									<div className="p-3 bg-slate-50 rounded-lg">
										<p className="text-xs text-slate-500 mb-1">Next Milestone</p>
										<p className="text-xl font-bold text-slate-800">25,000</p>
									</div>
								</div>
								{/* Milestone Progress */}
								<div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
									<div className="flex items-center gap-2 mb-2">
										<Target className="w-4 h-4 text-indigo-600" />
										<span className="text-sm font-medium text-slate-700">Next Milestone</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="text-slate-600">23,755 cycles remaining</span>
										<span className="text-indigo-600 font-medium">~475 days</span>
									</div>
									<p className="text-xs text-slate-500 mt-1">
										Est. date: Apr 04, 2026
									</p>
								</div>
								{/* Forecast Chart */}
								<div className="h-32 mb-3">
									<Bar data={usageData} options={usageOptions} />
								</div>
								{/* Rate Summary */}
								<div className="grid grid-cols-3 gap-2 text-center">
									<div className="p-2 bg-slate-50 rounded">
										<p className="text-lg font-bold text-slate-800">350</p>
										<p className="text-xs text-slate-500">per week</p>
									</div>
									<div className="p-2 bg-slate-50 rounded">
										<p className="text-lg font-bold text-slate-800">1,500</p>
										<p className="text-xs text-slate-500">per month</p>
									</div>
									<div className="p-2 bg-slate-50 rounded">
										<p className="text-lg font-bold text-slate-800">18k</p>
										<p className="text-xs text-slate-500">per year</p>
									</div>
								</div>
							</div>
						</div>

						{/* AI Recommendations */}
						<div className="p-5 predictions-card predictions-gradient" style={{background: 'linear-gradient(90deg,#eef2ff 0%,#f3e8ff 50%,#fce7f3 100%)'}}>
							<div className="flex items-center gap-2 mb-3">
								<Sparkles className="w-5 h-5 text-indigo-600" />
								<h3 className="font-semibold text-slate-800">AI Recommendations</h3>
							</div>
							<div className="space-y-2">
								<div className="flex items-start gap-2 p-3 bg-white/80 rounded-lg">
									<AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
									<p className="text-sm text-slate-700">
										Schedule maintenance for 2 high-wear joints within the next 2 weeks to prevent failures.
									</p>
								</div>
								<div className="flex items-start gap-2 p-3 bg-white/80 rounded-lg">
									<Sparkles className="w-4 h-4 text-emerald-500 mt-0.5" />
									<p className="text-sm text-slate-700">
										System is operating optimally. Continue current maintenance schedule.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
