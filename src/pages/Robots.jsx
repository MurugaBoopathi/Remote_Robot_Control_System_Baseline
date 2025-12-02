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
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16, alignItems: "center", marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search Robots..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", fontSize: 16, borderRadius: 8, border: "1px solid #dfe3eb", background: "#f5f7fb", boxShadow: "0 2px 8px #e3e7ee22", outline: "none" }}
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", fontSize: 16, borderRadius: 8, border: "1px solid #dfe3eb", background: "#f5f7fb", boxShadow: "0 2px 8px #e3e7ee22", outline: "none" }}
          >
            <option value="">All Status</option>
            <option value="Online">Online</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Offline">Offline</option>
            <option value="Error">Error</option>
          </select>
          <button
            style={{ width: "100%", padding: "12px 0", fontSize: 16, borderRadius: 8, backgroundColor: "#6b5ce7", color: "white", border: "none", cursor: "pointer", fontWeight: 600, boxShadow: "0 2px 8px #6b5ce722" }}
            onClick={() => setShowModal(true)}
          >
            + Add Robot
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 28 }}>
          {filteredRobots.map((robot, idx) => (
            <div key={idx} style={{ background: "#fff", padding: 22, borderRadius: 18, boxShadow: "0 4px 16px #e3e7ee55", position: "relative", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer", minHeight: 180, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px #b3b8c055'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px #e3e7ee55'}>
              <button
                style={{ position: "absolute", top: 16, right: 16, background: "#f44336", color: "white", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", fontSize: 16, boxShadow: "0 2px 6px #f4433622" }}
                onClick={() => handleDelete(idx)}
                title="Delete Robot"
              >🗑</button>
              <h3 style={{ margin: "0 0 8px 0", fontSize: 22, fontWeight: 600, display: "flex", alignItems: "center" }}>
                <span style={{ height: 14, width: 14, borderRadius: "50%", display: "inline-block", marginRight: 10, background: statusColors[robot.status] }}></span>
                {robot.name}
              </h3>
              <small style={{ color: "#6b717e", display: "block", marginBottom: 12, fontSize: 15 }}>{robot.version} &nbsp;|&nbsp; <span style={{ color: statusColors[robot.status], fontWeight: 500 }}>{robot.status}</span></small>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 6 }}>
                <div style={{ background: "#f5f7fb", padding: "7px 12px", borderRadius: 8, fontSize: 15, flex: "1 1 40%", display: "flex", alignItems: "center", gap: 6 }}>
                  <span role="img" aria-label="battery">🔋</span> {robot.battery}
                </div>
                <div style={{ background: "#f5f7fb", padding: "7px 12px", borderRadius: 8, fontSize: 15, flex: "1 1 40%", display: "flex", alignItems: "center", gap: 6 }}>
                  <span role="img" aria-label="temp">🌡️</span> {robot.temp}
                </div>
                <div style={{ background: "#f5f7fb", padding: "7px 12px", borderRadius: 8, fontSize: 15, flex: "1 1 40%", display: "flex", alignItems: "center", gap: 6 }}>
                  <span role="img" aria-label="steps">🚶‍♂️</span> {robot.steps}
                </div>
                <div style={{ background: "#f5f7fb", padding: "7px 12px", borderRadius: 8, fontSize: 15, flex: "1 1 40%", display: "flex", alignItems: "center", gap: 6 }}>
                  <span role="img" aria-label="wifi">📶</span> {robot.wifi}
                </div>
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
