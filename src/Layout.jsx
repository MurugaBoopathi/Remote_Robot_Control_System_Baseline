
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Bot, Gamepad2, Activity, Heart, RefreshCw, Brain } from 'lucide-react'

export default function Layout(){
  const nav = [
    { name:'Dashboard', href:'/dashboard', icon:LayoutDashboard },
    { name:'Predictions', href:'/predictions', icon:Brain },
    { name:'Robots', href:'/robots', icon:Bot },
    { name:'Tele-Operation', href:'/teleop', icon:Gamepad2 },
    { name:'Kinematics', href:'/kinematics', icon:Activity },
    { name:'Health', href:'/health', icon:Heart },
    { name:'Updates', href:'/updates', icon:RefreshCw },
  ]
  return (
    <div>
      <aside className="sidebar">
        <h3 style={{marginTop:0}}>Robot Management</h3>
        <p className="small">Monitor and manage your humanoid robots</p>
        <div className="nav">
          {nav.map(i=> (
            <NavLink key={i.href} to={i.href} className={({isActive})=> isActive ? 'active' : ''}>
              <i.icon size={18}/> {i.name}
            </NavLink>
          ))}
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
