import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ReportForm />} />
          <Route path="/reports" element={<ReportList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
