import React from "react";
export default function JointDetailPanel({ joint, onClose }) {
  if (!joint) return null;
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#f3f4f6" }}>
      <h3 style={{ color: "#6366f1", fontWeight: 600 }}>Joint Detail Panel</h3>
      <p><strong>Name:</strong> {joint.joint_name}</p>
      <p><strong>Angle:</strong> {joint.current_angle}</p>
      <button onClick={onClose} style={{ marginTop: 8 }}>Close</button>
    </div>
  );
}
