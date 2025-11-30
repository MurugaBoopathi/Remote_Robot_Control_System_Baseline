
import React from 'react'
import { Wifi, Battery, Thermometer } from 'lucide-react'

export default function MetricCard({ title, value, icon:Icon=Wifi, color='indigo' }){
  return (
    <div className="card">
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <Icon size={18} color={color} />
        <strong>{title}</strong>
      </div>
      <div style={{fontSize:22,marginTop:8}}>{value}</div>
    </div>
  )
}
