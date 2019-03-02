import React, { Component } from 'react';
import './App.css';
import Draw from './components/draw';

class App extends Component {
  render() {
    return (
      <div className="App">
       <Draw useInterpolation={true}/>
      </div>
    );
  }
}

export default App;
