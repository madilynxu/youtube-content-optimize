import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <Router>
      <div className="h-screen bg-gray-100">
        <div className="flex flex-col h-full overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Chatbot />
        </div>
      </div>
    </Router>
  )
}

export default App
