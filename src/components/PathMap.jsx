import React from "react";
export default function PathMap({ pathLog }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#f8fafc" }}>
      <h3 style={{ color: "#6366f1", fontWeight: 600 }}>Path Map</h3>
      <ul>
        {pathLog && pathLog.map((point, idx) => (
          <li key={idx}>
            {point.timestamp}: ({point.x}, {point.y})
          </li>
        ))}
      </ul>
    </div>
  );
}
