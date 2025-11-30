import React from "react";
export default function HealthChart({ data, title, dataKey, color, unit }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#f1f5f9" }}>
      <h3 style={{ color: color || "#6366f1", fontWeight: 600 }}>{title}</h3>
      <ul>
        {data && data.map((item, idx) => (
          <li key={idx}>
            {item[dataKey]}{unit ? ` ${unit}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
