
import React from 'react'

export default function PredictionCard({ title, description, value, risk }) {
  return (
    <div className="card" style={{ padding: 20, borderRadius: 12, background: '#fff', boxShadow: '0 2px 16px #0001', minHeight: 140 }}>
      <strong style={{ fontSize: 18, color: '#3730a3' }}>{title}</strong>
      <div className="small" style={{ marginTop: 6, color: '#6366f1' }}>{description}</div>
      {value && <div style={{ marginTop: 12, fontSize: 16, color: '#64748b' }}><b>Value:</b> {value}</div>}
      {risk && <div style={{ marginTop: 4, fontSize: 15, color: '#f59e42' }}><b>Risk:</b> {risk}</div>}
    </div>
  );
}
