/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import React from 'react'
import '../Styles/NavBar.scss'

interface NavBarProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

const NavBar = ({ darkMode, toggleDarkMode }:NavBarProps) => {
  console.log(toggleDarkMode)
  return (
    <nav className={darkMode ? 'nav-dark-mode' : ''}>
      <h1>Currency Exchanger</h1>
      <div className="toggle">
        <p>{darkMode ? 'Swith to Light' : 'Swtich to Dark'}</p>
        <label className="switch">
          <input type="checkbox" onClick={() => toggleDarkMode()} checked={darkMode}/>
          <span className="slider round"></span>
        </label>
      </div>
    </nav>
  )
}

export default NavBar
