import { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ cartCount = 0, favoriteCount = 0, isAuthenticated = false, onLogout, onFavoritesClick, onCartClick, onMenuClick, onStudentDealsClick, onPlattersClick }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <nav className="navbar wrap" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="Student Cafe home" onClick={closeMenu}><span className="brand-mark">S<span>*</span></span><span className="brand-name">Student<span>Cafe</span></span></Link>
        <button className={`nav-toggle${menuOpen ? ' open' : ''}`} type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation"><span /><span /><span /></button>
        <div className={`nav-menu${menuOpen ? ' open' : ''}`} id="mobile-navigation">
          <div className="nav-center"><a href="/#menu" onClick={() => { onMenuClick?.(); closeMenu() }}>Our menu</a><a href="/#student-deals" onClick={() => { onStudentDealsClick?.(); closeMenu() }}>Student deals</a><a href="/#platters" onClick={() => { onPlattersClick?.(); closeMenu() }}>Platters</a><a href="/#visit" onClick={closeMenu}>Find us</a></div>
          <div className="nav-actions">{isAuthenticated ? <button className="nav-logout" onClick={() => { onLogout?.(); closeMenu() }}>Log out</button> : <Link className="nav-login" to="/login" onClick={closeMenu}>Log in</Link>}<button className="nav-favorites" onClick={() => { onFavoritesClick?.(); closeMenu() }} aria-label={`Open favorites with ${favoriteCount} items`}>Favorites <b>{favoriteCount}</b></button><button className="nav-cart" onClick={() => { onCartClick?.(); closeMenu() }} aria-label={`Open cart with ${cartCount} items`}>Cart <span aria-hidden="true">🛒</span><b>{cartCount}</b></button><Link className="nav-join" to="/register" onClick={closeMenu}>Join the crew <span>↗</span></Link></div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
