
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Robots from './pages/Robots.jsx'
import TeleOperation from './pages/TeleOperation.jsx'
import Kinematics from './pages/Kinematics.jsx'
import Health from './pages/Health.jsx'
import Updates from './pages/Updates.jsx'
import Predictions from './pages/Predictions.jsx'

export default function App(){
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Navigate to="/dashboard"/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/robots" element={<Robots/>} />
        <Route path="/teleop" element={<TeleOperation/>} />
        <Route path="/kinematics" element={<Kinematics/>} />
        <Route path="/health" element={<Health/>} />
        <Route path="/updates" element={<Updates/>} />
        <Route path="/predictions" element={<Predictions/>} />
      </Route>
    </Routes>
  )
}
