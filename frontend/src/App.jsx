import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { Sidebar } from './components/Sidebar.jsx'
import { Login } from "./pages/Login.jsx";
import { Dashboard } from "./pages/Dashboard.jsx"

export const App = () => {
  return (
    <div>
      <Dashboard />
    </div>
  )
}