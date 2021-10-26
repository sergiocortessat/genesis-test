/* eslint-disable no-use-before-define */
import React from 'react'
import './Styles/App.scss'
import Convertor from './Components/convertor'
import NavBar from './Components/NavBar'
import Test from './Modules/test'

function App () {
  return (
    <div className="App">
      <NavBar />
      <Convertor />
      <Test />
    </div>
  )
}

export default App
