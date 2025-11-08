import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              background: '#141414',
              color: '#fff',
              fontFamily: 'Arial, sans-serif'
            }}>
              <h1>CinePro - Coming Soon</h1>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
