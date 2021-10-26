/* eslint-disable no-use-before-define */
import React from 'react'
import './Styles/App.scss'
import Convertor from './Components/convertor'
import NavBar from './Components/NavBar'
import userDarkMode from './Components/LightDarkNavbar/LighDarkComponent'
function App () {
  const [darkMode, toggleDarkMode] = userDarkMode()
  return (
    <div className="App">
      <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
      <Convertor />
    </div>
  )
}

export default App
