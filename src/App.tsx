import React from 'react';
import './Styles/App.scss';
import Convertor from './Components/convertor'
import NavBar from './Components/NavBar';



function App() {
 
  return (
    <div className="App">
      <NavBar />
      <Convertor />
    </div>
  );
}

export default App;
