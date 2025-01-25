import React from "react";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import { BiddingSystem, UNICEFProposalDashboard, BidList } from './pages'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BiddingSystem />} />
        <Route path="/unicef" element={<UNICEFProposalDashboard />} />
        <Route path="/bidlist" element={<BidList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
