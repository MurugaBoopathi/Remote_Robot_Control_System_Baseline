
import React, { useState } from 'react'
import { base44 } from '../api/base44Client'

export default function TeleOperation(){
  const [robotId,setRobotId] = useState(1)
  const [speed,setSpeed] = useState(0.5)
  const send = async (action)=>{ await base44.entities.Commands.send(robotId, action, { speed }) }
  return (
    <div>
      <h2>Tele-Operation</h2>
      <div className="card">
        Robot ID: <input className="input" type="number" value={robotId} onChange={e=>setRobotId(+e.target.value)} />
        Speed: <input className="input" type="number" step="0.1" value={speed} onChange={e=>setSpeed(+e.target.value)} />
        <div style={{marginTop:8}}>
          <button className="btn" onClick={()=>send('forward')}>Forward</button>
          <button className="btn" style={{marginLeft:8}} onClick={()=>send('back')}>Back</button>
          <button className="btn" style={{marginLeft:8}} onClick={()=>send('left')}>Left</button>
          <button className="btn" style={{marginLeft:8}} onClick={()=>send('right')}>Right</button>
        </div>
      </div>
    </div>
  )
}
