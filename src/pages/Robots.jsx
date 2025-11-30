import React, { useEffect, useState } from "react";

const statusColors = {
  Online: '#4caf50',
  Maintenance: '#ffb400',
  Offline: '#999',
  Error: '#f44336',
};

function parseCsv(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.match(/("[^"]*"|[^,]+)/g).map(v => v.replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i];
    });
    return obj;
  });
}

export default function Robots() {
  const [robots, setRobots] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newRobot, setNewRobot] = useState({ name: "", version: "1.0.0", status: "Offline" });

  useEffect(() => {
    fetch("/Robot_export.csv")
      .then(res => res.text())
      .then(text => {
        const data = parseCsv(text);
        setRobots(data.map(r => ({
          name: r.name,
          version: `v${r.firmware_version}`,
          status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
          battery: `${r.battery_level}%`,
          temp: `${r.temperature}°C`,
          steps: r.cycle_count,
          wifi: `${r.motor_health}%`,
        })));
      });
  }, []);

  const filteredRobots = robots.filter(r =>
    r.name && r.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "" || r.status === statusFilter)
  );

  function handleDelete(index) {
    if (window.confirm("Are you sure you want to delete this robot?")) {
      setRobots(robots => robots.filter((_, i) => i !== index));
    }
  }

  function handleAddRobot() {
    if (!newRobot.name.trim()) {
      alert("Robot name is required");
      return;
    }
    setRobots([
      ...robots,
      {
        ...newRobot,
        battery: "100%",
        temp: "40°C",
        steps: "0",
        wifi: "100%",
      },
    ]);
    setShowModal(false);
    setNewRobot({ name: "", version: "1.0.0", status: "Offline" });
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Main */}
  <main style={{ padding: 20, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <input
            type="text"
            placeholder="Search Robots..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: "8px 12px", fontSize: 14, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: "8px 12px", fontSize: 14, borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value="">All Status</option>
            <option value="Online">Online</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Offline">Offline</option>
            <option value="Error">Error</option>
          </select>
          <button
            style={{ padding: "8px 12px", fontSize: 14, borderRadius: 6, backgroundColor: "#6b5ce7", color: "white", border: "none", cursor: "pointer" }}
            onClick={() => setShowModal(true)}
          >
            + Add Robot
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
          {filteredRobots.map((robot, idx) => (
            <div key={idx} style={{ background: "#fff", padding: 15, borderRadius: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.1)", position: "relative", transition: "transform 0.2s" }}>
              <button
                style={{ position: "absolute", top: 10, right: 10, background: "#f44336", color: "white", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer" }}
                onClick={() => handleDelete(idx)}
              >🗑</button>
              <h3 style={{ margin: "0 0 5px 0", fontSize: 18 }}>
                <span style={{ height: 12, width: 12, borderRadius: "50%", display: "inline-block", marginRight: 6, background: statusColors[robot.status] }}></span>
                {robot.name}
              </h3>
              <small style={{ color: "#777", display: "block", marginBottom: 10 }}>{robot.version} - {robot.status}</small>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <div style={{ background: "#f5f5f5", padding: "5px 8px", borderRadius: 6, fontSize: 13, flex: "1 1 40%" }}>Battery: {robot.battery}</div>
                <div style={{ background: "#f5f5f5", padding: "5px 8px", borderRadius: 6, fontSize: 13, flex: "1 1 40%" }}>Temp: {robot.temp}</div>
                <div style={{ background: "#f5f5f5", padding: "5px 8px", borderRadius: 6, fontSize: 13, flex: "1 1 40%" }}>Steps: {robot.steps}</div>
                <div style={{ background: "#f5f5f5", padding: "5px 8px", borderRadius: 6, fontSize: 13, flex: "1 1 40%" }}>WiFi: {robot.wifi}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Modal */}
        {showModal && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: 20, borderRadius: 12, width: 300, position: "relative" }}>
              <span style={{ position: "absolute", top: 10, right: 12, fontSize: 18, cursor: "pointer" }} onClick={() => setShowModal(false)}>&times;</span>
              <h3 style={{ marginTop: 0 }}>Register New Robot</h3>
              <input
                type="text"
                placeholder="Robot Name (e.g. Atlas-01)"
                value={newRobot.name}
                onChange={e => setNewRobot({ ...newRobot, name: e.target.value })}
                style={{ width: "100%", padding: 8, marginBottom: 12, borderRadius: 6, border: "1px solid #ccc" }}
              />
              <input
                type="text"
                placeholder="Firmware Version"
                value={newRobot.version}
                onChange={e => setNewRobot({ ...newRobot, version: e.target.value })}
                style={{ width: "100%", padding: 8, marginBottom: 12, borderRadius: 6, border: "1px solid #ccc" }}
              />
              <select
                value={newRobot.status}
                onChange={e => setNewRobot({ ...newRobot, status: e.target.value })}
                style={{ width: "100%", padding: 8, marginBottom: 12, borderRadius: 6, border: "1px solid #ccc" }}
              >
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Error">Error</option>
              </select>
              <button style={{ width: "100%", padding: 10, background: "#6b5ce7", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }} onClick={handleAddRobot}>
                Register Robot
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
