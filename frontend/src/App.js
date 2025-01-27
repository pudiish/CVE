import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CVEList from './components/CVEList';
import CVEDetail from './components/CVEDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/cves/list" />} />
        <Route path="/cves/list" element={<CVEList />} />
        <Route path="/cves/:id" element={<CVEDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
