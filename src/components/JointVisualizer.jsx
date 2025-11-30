import React from "react";
export default function JointVisualizer({ joints, onJointSelect }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#f8fafc" }}>
      <h3 style={{ color: "#6366f1", fontWeight: 600 }}>Joint Visualizer</h3>
      <ul>
        {joints && joints.map(joint => (
          <li key={joint.joint_id}>
            <button onClick={() => onJointSelect && onJointSelect(joint)} style={{ margin: 4 }}>
              {joint.joint_name} (Angle: {joint.current_angle})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
