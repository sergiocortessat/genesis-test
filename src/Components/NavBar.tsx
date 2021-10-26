/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import React from 'react'
import '../Styles/NavBar.scss'

interface NavBarProps {
  toggleDarkMode: (value: string) => void
  darkMode: (value: boolean) => boolean
}

const NavBar = ({ darkMode, toggleDarkMode }:any) => {
  return (
    <nav className={darkMode ? 'nav-dark-mode' : ''}>
      <h1>Currency Exchanger</h1>
      <div className="toggle">
        <p>{darkMode ? 'Swith to Light' : 'Swtich to Dark'}</p>
        <label className="switch">
          <input type="checkbox" onClick={() => toggleDarkMode()} checked={darkMode} />
          <span className="slider round"></span>
        </label>
      </div>
    </nav>
  )
}

export default NavBar
