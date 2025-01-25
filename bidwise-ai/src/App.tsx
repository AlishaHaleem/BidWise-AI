import { useState } from 'react'
import { BiddingSystem, UNICEFProposalDashboard, BidList } from './pages'
import './App.css'

function App() {
  // Removed unused state variables

  return (
    <>
      <div>
        <BidList />
        <BiddingSystem />
        <UNICEFProposalDashboard />
      </div>
      
    </>
  )
}

export default App
