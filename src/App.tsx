import { Header, Sidebar } from './components'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProductView from './pages/ProductView'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="app-main">
          <Routes>
            <Route path="/products" element={<ProductView />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
