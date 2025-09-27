import { NavLink } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  return (
    <nav className="sidebar">
      <NavLink to="/products"
        className={({ isActive }) => (isActive ? 'sidebar-link is-active' : 'sidebar-link')}
      >
        Products
      </NavLink>
    </nav>
  )
}

export default Sidebar
