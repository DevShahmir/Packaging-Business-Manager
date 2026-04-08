import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BusinessProvider } from './context/BusinessContext'
import Navbar from './Components/Navbar'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'

function App() {
  return (
    <BusinessProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </BusinessProvider>
  )
}

export default App
