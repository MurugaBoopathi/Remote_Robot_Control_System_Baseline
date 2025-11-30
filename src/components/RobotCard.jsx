
import React from 'react'

export default function RobotCard({ robot }){
  return (
    <div className="card">
      <strong>{robot.name}</strong> <span className="small">({robot.status})</span>
      <div style={{marginTop:8}}>Battery: {robot.battery}% • Temp: {robot.temperature}°C • Cycles: {robot.cycles}</div>
    </div>
  )
}
