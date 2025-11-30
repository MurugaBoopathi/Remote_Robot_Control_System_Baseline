
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { base44 } from '../api/base44Client'

export default function Updates(){
  const [robotId,setRobotId] = useState(1)
  const [version,setVersion] = useState('v1.0.0')
  const { data: jobs=[] , refetch } = useQuery({ queryKey:['updates'], queryFn: ()=> base44.entities.UpdateJob.list(100) })
  const schedule = async ()=>{ await base44.entities.UpdateJob.schedule(robotId, version); refetch() }
  return (
    <div>
      <h2>Updates</h2>
      <div className="card">
        Robot ID: <input className="input" type="number" value={robotId} onChange={e=>setRobotId(+e.target.value)}/>
        Version: <input className="input" value={version} onChange={e=>setVersion(e.target.value)} />
        <button className="btn" style={{marginLeft:8}} onClick={schedule}>Schedule Update</button>
      </div>
      <div className="card">
        <strong>Jobs</strong>
        <div className="small" style={{marginTop:8}}>
          {jobs.map(j=> (
            <div key={j.id}>Job #{j.id} robot {j.robot_id} — {j.status} ({j.version})</div>
          ))}
        </div>
      </div>
    </div>
  )
}
