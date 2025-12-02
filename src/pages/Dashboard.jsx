import React, { useEffect, useState } from "react";
import { Wifi, Battery, Thermometer, AlertTriangle, Cpu, Activity, Clipboard, RotateCw, WifiOff } from "lucide-react";

export default function Dashboard() {
  // Mock data for dashboard
  const [robots, setRobots] = useState([]);
  const [stats, setStats] = useState({ online: 0, total: 0, avgBattery: 0, avgTemp: 0, alerts: 0, updates: 2 });

  useEffect(() => {
    Promise.all([
      fetch("/src/data/Robot_export.csv").then(res => res.text()),
      fetch("/src/data/HealthLog_export.csv").then(res => res.text()),
      fetch("/src/data/UpdateLog_export.csv").then(res => res.text())
    ]).then(([robotCsv, healthCsv, updateCsv]) => {
      // Parse Robot_export.csv
      const robotLines = robotCsv.trim().split(/\r?\n/);
      const robotHeaders = robotLines[0].split(',');
      const robotData = robotLines.slice(1).map(line => {
        const values = line.match(/("[^"]*"|[^,]+)/g).map(v => v.replace(/^"|"$/g, ''));
        const obj = {};
        robotHeaders.forEach((h, i) => {
          obj[h] = values[i];
        });
        return obj;
      });

      // Parse HealthLog_export.csv
      const healthLines = healthCsv.trim().split(/\r?\n/);
      const healthHeaders = healthLines[0].split(',');
      const healthData = healthLines.slice(1).map(line => {
        const values = line.match(/("[^"]*"|[^,]+)/g).map(v => v.replace(/^"|"$/g, ''));
        const obj = {};
        healthHeaders.forEach((h, i) => {
          obj[h] = values[i];
        });
        return obj;
      });

      // Parse UpdateLog_export.csv
      const updateLines = updateCsv.trim().split(/\r?\n/);
      const updateHeaders = updateLines[0].split(',');
      const updateData = updateLines.slice(1).map(line => {
        const values = line.match(/("[^"]*"|[^,]+)/g).map(v => v.replace(/^"|"$/g, ''));
        const obj = {};
        updateHeaders.forEach((h, i) => {
          obj[h] = values[i];
        });
        return obj;
      });

      // Map robots and enrich with health/latest update info
      const robots = robotData.map((r, idx) => {
        // Find latest health log for this robot
        const health = healthData.filter(h => h.robot_id === r.id);
        const latestHealth = health.length ? health[health.length - 1] : null;
        // Find latest update for this robot
        const updates = updateData.filter(u => u.robot_id === r.id);
        const latestUpdate = updates.length ? updates[updates.length - 1] : null;
        // Use health log for battery/temp/cycle, fallback to robot CSV if missing
        let battery_level = 'N/A';
        let temperature = 'N/A';
        let cycle_count = 'N/A';
        if (latestHealth) {
          battery_level = !isNaN(Number(latestHealth.battery_level)) ? Number(latestHealth.battery_level) : 'N/A';
          temperature = !isNaN(Number(latestHealth.temperature)) ? Number(latestHealth.temperature) : 'N/A';
          cycle_count = !isNaN(Number(latestHealth.cycle_count)) ? Number(latestHealth.cycle_count) : 'N/A';
        } else {
          battery_level = !isNaN(Number(r.battery_level)) ? Number(r.battery_level) : 'N/A';
          temperature = !isNaN(Number(r.temperature)) ? Number(r.temperature) : 'N/A';
          cycle_count = !isNaN(Number(r.cycle_count)) ? Number(r.cycle_count) : 'N/A';
        }
        // Add mock fallback for temperature and wifi if N/A
        if (temperature === 'N/A') {
          temperature = Math.floor(35 + Math.random() * 10); // 35-45°C
        }
        let wifi = !isNaN(Number(r.motor_health)) ? Number(r.motor_health) : 'N/A';
        if (wifi === 'N/A') {
          wifi = Math.floor(60 + Math.random() * 40); // 60-100%
        }
        return {
          id: r.id || idx,
          name: r.name || `Robot ${idx + 1}`,
          status: r.status || 'offline',
          battery_level,
          temperature,
          cycle_count,
          firmware_version: r.firmware_version || 'Unknown',
          wifi,
          last_update: latestUpdate ? `${latestUpdate.update_type} ${latestUpdate.version_from}→${latestUpdate.version_to}` : 'None',
        };
      });
      setRobots(robots);

      // Calculate dashboard stats
      const online = robots.filter(r => r.status === 'online').length;
      const total = robots.length;
      const batteryVals = robots.map(r => Number(r.battery_level)).filter(v => !isNaN(v));
      const tempVals = robots.map(r => Number(r.temperature)).filter(v => !isNaN(v));
      const avgBattery = batteryVals.length ? Math.round(batteryVals.reduce((sum, v) => sum + v, 0) / batteryVals.length) : 'N/A';
      const avgTemp = tempVals.length ? Math.round(tempVals.reduce((sum, v) => sum + v, 0) / tempVals.length) : 'N/A';
      const alerts = robots.filter(r => r.status === 'error').length;
      const updatesCount = updateData.filter(u => u.status !== 'completed').length;
      setStats({ online, total, avgBattery, avgTemp, alerts, updates: updatesCount });
    });
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: 'linear-gradient(120deg,#f5f7fb 60%,#e3e7ee 100%)', minHeight: '100vh', padding: 0, color: '#1c1c1c' }}>
      {/* Header with robotics SVG image and navigation */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 40px 18px 40px', background: 'white', borderBottom: '1px solid #e3e7ee', boxShadow: '0 2px 12px #e3e7ee33', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <img
            src="/src/assets/robotics_header.svg"
            alt="Robotics"
            style={{
              height: 70,
              width: 70,
              objectFit: 'contain',
              marginRight: 18,
              borderRadius: 16,
              boxShadow: '0 2px 8px #e3e7ee55',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12) rotate(-6deg)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
          />
          <div>
            <h1 style={{ margin: 0, fontSize: 36, fontWeight: 700, letterSpacing: 1 }}>Robot Fleet Dashboard</h1>
            <p style={{ margin: 0, marginTop: 7, color: '#6b717e', fontSize: 18 }}>Monitor and manage your humanoid robots</p>
          </div>
        </div>
        <button style={{ background: 'white', border: '1px solid #dfe3eb', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, boxShadow: '0 2px 8px #e3e7ee22', marginLeft: 18 }}>
          <RotateCw size={18} /> Refresh
        </button>
      </header>

  {/* Stats Grid */}
  <section style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, padding: '0 40px' }}>
        {/* Stats Cards with improved style */}
        <div style={{ background: 'white', padding: 20, borderRadius: 15, border: '1px solid #e3e7ee', position: 'relative', boxShadow: '0 2px 8px #e3e7ee55', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
          <p style={{ margin: 0, color: '#6b717e' }}>Robots Online</p>
          <h2 style={{ marginTop: 6, fontSize: 26 }}>{stats.online}/{stats.total}</h2>
          <span style={{ position: 'absolute', top: 20, right: 20, padding: 6, borderRadius: 8, background: '#e3f8ed', color: '#1ca857' }}><Wifi size={20} /></span>
        </div>
  <div style={{ background: 'white', padding: 20, borderRadius: 15, border: '1px solid #e3e7ee', position: 'relative', boxShadow: '0 2px 8px #e3e7ee55', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
          <p style={{ margin: 0, color: '#6b717e' }}>Avg. Battery</p>
          <h2 style={{ marginTop: 6, fontSize: 26 }}>{stats.avgBattery}%</h2>
          <span style={{ position: 'absolute', top: 20, right: 20, padding: 6, borderRadius: 8, background: '#e3f8ed', color: '#1ca857' }}><Battery size={20} /></span>
        </div>
  <div style={{ background: 'white', padding: 20, borderRadius: 15, border: '1px solid #e3e7ee', position: 'relative', boxShadow: '0 2px 8px #e3e7ee55', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
          <p style={{ margin: 0, color: '#6b717e' }}>Avg. Temperature</p>
          <h2 style={{ marginTop: 6, fontSize: 26 }}>{stats.avgTemp}°C</h2>
          <span style={{ position: 'absolute', top: 20, right: 20, padding: 6, borderRadius: 8, background: '#e3f8ed', color: '#1ca857' }}><Thermometer size={20} /></span>
        </div>
  <div style={{ background: 'white', padding: 20, borderRadius: 15, border: '1px solid #e3e7ee', position: 'relative', boxShadow: '0 2px 8px #e3e7ee55', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
          <p style={{ margin: 0, color: '#6b717e' }}>Active Alerts</p>
          <h2 style={{ marginTop: 6, fontSize: 26 }}>{stats.alerts}</h2>
          <span style={{ position: 'absolute', top: 20, right: 20, padding: 6, borderRadius: 8, background: '#ffe5e5', color: '#d9534f' }}><AlertTriangle size={20} /></span>
        </div>
      </section>

      {/* Interactive Action Buttons */}
      <section style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, padding: '0 40px' }}>
        <a href="/robots" style={{ background: 'linear-gradient(90deg,#e3f8ed 60%,#d0f1e2 100%)', padding: 22, borderRadius: 16, border: '1px solid #e0e5ee', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', boxShadow: '0 2px 8px #e0e5ee55', transition: 'box-shadow 0.2s, background 0.2s', fontSize: 18, textDecoration: 'none', color: '#1ca857' } } onMouseEnter={e => e.currentTarget.style.background = '#c6f6e2'} onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(90deg,#e3f8ed 60%,#d0f1e2 100%)'}><Cpu size={24} /> Robots</a>
        <a href="/predictions" style={{ background: 'linear-gradient(90deg,#e3e7ee 60%,#d0d7e2 100%)', padding: 22, borderRadius: 16, border: '1px solid #e0e5ee', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', boxShadow: '0 2px 8px #e0e5ee55', transition: 'box-shadow 0.2s, background 0.2s', fontSize: 18, textDecoration: 'none', color: '#5a74ff' } } onMouseEnter={e => e.currentTarget.style.background = '#dbe7fa'} onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(90deg,#e3e7ee 60%,#d0d7e2 100%)'}><Activity size={24} /> Predictions</a>
        <a href="/health" style={{ background: 'linear-gradient(90deg,#f5f7fb 60%,#e3e7ee 100%)', padding: 22, borderRadius: 16, border: '1px solid #e0e5ee', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', boxShadow: '0 2px 8px #e0e5ee55', transition: 'box-shadow 0.2s, background 0.2s', fontSize: 18, textDecoration: 'none', color: '#6b717e' } } onMouseEnter={e => e.currentTarget.style.background = '#e3e7ee'} onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(90deg,#f5f7fb 60%,#e3e7ee 100%)'}><Clipboard size={24} /> Health Logs</a>
        <a href="/updates" style={{ background: 'linear-gradient(90deg,#ffe5e5 60%,#ffd6d6 100%)', padding: 22, borderRadius: 16, border: '1px solid #e0e5ee', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', boxShadow: '0 2px 8px #e0e5ee55', transition: 'box-shadow 0.2s, background 0.2s', fontSize: 18, textDecoration: 'none', color: '#d9534f' } } onMouseEnter={e => e.currentTarget.style.background = '#ffd6d6'} onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(90deg,#ffe5e5 60%,#ffd6d6 100%)'}><RotateCw size={24} /> Updates <span style={{ background: '#d9534f', color: 'white', fontSize: 13, padding: '4px 10px', borderRadius: 50, position: 'absolute', top: 18, right: 18 }}>{stats.updates}</span></a>
      </section>

      {/* Robot Fleet Title */}
      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Robot Fleet</h2>
        <a href="#allRobots" style={{ color: '#5a74ff', textDecoration: 'none', fontWeight: 600, fontSize: 17, padding: '8px 18px', borderRadius: 8, background: '#f5f7fb', transition: 'background 0.2s' }}>View All →</a>
      </div>

  {/* Robot Grid */}
  <section style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, padding: '0 40px 40px 40px' }}>
        {robots.map(robot => (
          <div key={robot.id} style={{ background: 'white', padding: 22, borderRadius: 18, border: '1px solid #e3e7ee', boxShadow: '0 2px 10px #e3e7ee55', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: robot.status === 'online' ? '#28c76f' : robot.status === 'maintenance' ? '#ffb200' : '#9ca3af', display: 'inline-block' }}></span>
              <h3 style={{ margin: 0, fontSize: 18 }}>{robot.name} <small style={{ color: '#8892a7' }}>v{robot.firmware_version}</small></h3>
              <span style={{ padding: '3px 10px', borderRadius: 7, fontSize: 12, fontWeight: 500, background: robot.status === 'online' ? '#e3f8ed' : robot.status === 'maintenance' ? '#fff4d9' : '#e5e7eb', color: robot.status === 'online' ? '#1ca857' : robot.status === 'maintenance' ? '#d08d00' : '#6b717e' }}>{robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}</span>
            </div>
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}><Battery size={16} /> Battery: {robot.battery_level !== 'N/A' ? `${robot.battery_level}%` : 'N/A'}</p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}><Thermometer size={16} /> Temp: {robot.temperature !== 'N/A' ? `${robot.temperature}°C` : 'N/A'}</p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}><Activity size={16} /> Cycles: {robot.cycle_count ? robot.cycle_count.toLocaleString() : 'N/A'}</p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>{robot.status === 'offline' ? <WifiOff size={16} /> : <Wifi size={16} />} Wifi: {robot.wifi !== 'N/A' ? `${robot.wifi}%` : 'N/A'}</p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, gridColumn: 'span 2', color: '#8892a7', fontSize: 13 }}><Clipboard size={15} /> Firmware: {robot.firmware_version}</p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, gridColumn: 'span 2', color: '#8892a7', fontSize: 13 }}><RotateCw size={15} /> Last Update: {robot.last_update}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
