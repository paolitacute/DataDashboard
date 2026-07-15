import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Dashboard'
import RecipeDetail from './RecipeDetail' // <-- ADD THIS IMPORT
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <h2>🍲 Recipe Dash</h2>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/">Search</Link></li>
          <li><Link to="/">About</Link></li>
        </ul>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* ADD THIS NEW ROUTE */}
          <Route path="/recipe/:id" element={<RecipeDetail />} /> 
        </Routes>
      </main>
    </div>
  )
}

export default App