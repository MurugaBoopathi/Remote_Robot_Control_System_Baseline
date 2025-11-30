import React, { useEffect, useState } from "react";
import { Wifi, Battery, Thermometer, AlertTriangle, Cpu, Activity, Clipboard, RotateCw, WifiOff } from "lucide-react";

export default function Dashboard() {
  // Mock data for dashboard
  const [robots, setRobots] = useState([]);
  const [stats, setStats] = useState({ online: 0, total: 0, avgBattery: 0, avgTemp: 0, alerts: 0, updates: 2 });

  useEffect(() => {
    fetch("/Robot_export.csv")
      .then(res => res.text())
      .then(csv => {
        const lines = csv.trim().split(/\r?\n/);
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.match(/("[^"]*"|[^,]+)/g).map(v => v.replace(/^"|"$/g, ''));
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = values[i];
          });
          return obj;
        });
        setRobots(data.map((r, idx) => ({
          id: r.id || idx,
          name: r.name,
          status: r.status,
          battery_level: Number(r.battery_level),
          temperature: Number(r.temperature),
          cycle_count: Number(r.cycle_count),
          firmware_version: r.firmware_version,
          wifi: Number(r.motor_health),
        })));
        // Calculate stats
        const online = data.filter(r => r.status === 'online').length;
        const total = data.length;
        const avgBattery = Math.round(data.reduce((sum, r) => sum + Number(r.battery_level), 0) / total);
        const avgTemp = Math.round(data.reduce((sum, r) => sum + Number(r.temperature), 0) / total);
        const alerts = data.filter(r => r.status === 'error').length;
        setStats({ online, total, avgBattery, avgTemp, alerts, updates: 2 });
      });
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f5f7fb', minHeight: '100vh', padding: 30, color: '#1c1c1c' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 34 }}>Robot Fleet Dashboard</h1>
          <p style={{ margin: 0, marginTop: 5, color: '#6b717e' }}>Monitor and manage your humanoid robots</p>
        </div>
        <button style={{ background: 'white', border: '1px solid #dfe3eb', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
          <RotateCw size={18} /> Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <section style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        <div style={{ background: 'white', padding: 20, borderRadius: 15, border: '1px solid #e3e7ee', position: 'relative' }}>
          <p style={{ margin: 0, color: '#6b717e' }}>Robots Online</p>
          <h2 style={{ marginTop: 6, fontSize: 26 }}>{stats.online}/{stats.total}</h2>
          <span style={{ position: 'absolute', top: 20, right: 20, padding: 6, borderRadius: 8, background: '#e3f8ed', color: '#1ca857' }}><Wifi size={20} /></span>
        </div>
        <div style={{ background: 'white', padding: 20, borderRadius: 15, border: '1px solid #e3e7ee', position: 'relative' }}>
          <p style={{ margin: 0, color: '#6b717e' }}>Avg. Battery</p>
          <h2 style={{ marginTop: 6, fontSize: 26 }}>{stats.avgBattery}%</h2>
          <span style={{ position: 'absolute', top: 20, right: 20, padding: 6, borderRadius: 8, background: '#e3f8ed', color: '#1ca857' }}><Battery size={20} /></span>
        </div>
        <div style={{ background: 'white', padding: 20, borderRadius: 15, border: '1px solid #e3e7ee', position: 'relative' }}>
          <p style={{ margin: 0, color: '#6b717e' }}>Avg. Temperature</p>
          <h2 style={{ marginTop: 6, fontSize: 26 }}>{stats.avgTemp}°C</h2>
          <span style={{ position: 'absolute', top: 20, right: 20, padding: 6, borderRadius: 8, background: '#e3f8ed', color: '#1ca857' }}><Thermometer size={20} /></span>
        </div>
        <div style={{ background: 'white', padding: 20, borderRadius: 15, border: '1px solid #e3e7ee', position: 'relative' }}>
          <p style={{ margin: 0, color: '#6b717e' }}>Active Alerts</p>
          <h2 style={{ marginTop: 6, fontSize: 26 }}>{stats.alerts}</h2>
          <span style={{ position: 'absolute', top: 20, right: 20, padding: 6, borderRadius: 8, background: '#ffe5e5', color: '#d9534f' }}><AlertTriangle size={20} /></span>
        </div>
      </section>

      {/* Action Buttons */}
      <section style={{ marginTop: 25, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        <button style={{ background: 'white', padding: 18, borderRadius: 14, border: '1px solid #e0e5ee', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}><Cpu size={20} /> Tele-Op Control</button>
        <button style={{ background: 'white', padding: 18, borderRadius: 14, border: '1px solid #e0e5ee', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}><Activity size={20} /> Kinematics</button>
        <button style={{ background: 'white', padding: 18, borderRadius: 14, border: '1px solid #e0e5ee', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}><Clipboard size={20} /> Health Logs</button>
        <button style={{ background: 'white', padding: 18, borderRadius: 14, border: '1px solid #e0e5ee', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          <RotateCw size={20} /> Updates
          <span style={{ background: '#d9534f', color: 'white', fontSize: 12, padding: '3px 7px', borderRadius: 50, position: 'absolute', top: 10, right: 10 }}>{stats.updates}</span>
        </button>
      </section>

      {/* Robot Fleet Title */}
      <div style={{ marginTop: 35, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Robot Fleet</h2>
        <a href="#allRobots" style={{ color: '#5a74ff', textDecoration: 'none', fontWeight: 600 }}>View All →</a>
      </div>

      {/* Robot Grid */}
      <section style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
        {robots.map(robot => (
          <div key={robot.id} style={{ background: 'white', padding: 20, borderRadius: 16, border: '1px solid #e3e7ee' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: robot.status === 'online' ? '#28c76f' : robot.status === 'maintenance' ? '#ffb200' : '#9ca3af', display: 'inline-block' }}></span>
              <h3 style={{ margin: 0, fontSize: 18 }}>{robot.name} <small style={{ color: '#8892a7' }}>v{robot.firmware_version}</small></h3>
              <span style={{ padding: '3px 10px', borderRadius: 7, fontSize: 12, fontWeight: 500, background: robot.status === 'online' ? '#e3f8ed' : robot.status === 'maintenance' ? '#fff4d9' : '#e5e7eb', color: robot.status === 'online' ? '#1ca857' : robot.status === 'maintenance' ? '#d08d00' : '#6b717e' }}>{robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}</span>
            </div>
            <div style={{ marginTop: 15, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}><Battery size={16} /> {robot.battery_level}%</p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}><Thermometer size={16} /> {robot.temperature}°C</p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}><Activity size={16} /> {robot.cycle_count.toLocaleString()}</p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>{robot.status === 'offline' ? <WifiOff size={16} /> : <Wifi size={16} />} {robot.wifi}%</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
