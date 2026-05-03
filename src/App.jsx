import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Bot, Sun, Moon, ExternalLink, Menu, X } from 'lucide-react'
import Home from './pages/Home'
import Docs from './pages/Docs'
import Terms from './pages/Terms'

function App() {
  const location = useLocation();
  const [isLightMode, setIsLightMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    if (isLightMode) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      setIsLightMode(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setIsLightMode(true);
    }
  };

  return (
    <>
      <nav className="navbar glass-panel" style={{
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100vw',
        padding: '0.8rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>

        {/* Lado Izquierdo: Logo */}
        <Link to="/" className="nav-link" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/Arisu-logo-a.svg" alt="Arisu Logo" style={{ width: 28, height: 28 }} />
          Arisu
        </Link>

        {/* Lado Derecho: Enlaces y Botones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>

          {/* Enlaces (Se ocultan en móvil) */}
          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Inicio</Link>
            <Link to="/docs" className={`nav-link ${location.pathname === '/docs' ? 'active' : ''}`}>Comandos</Link>
            <Link to="/terms" className={`nav-link ${location.pathname === '/terms' ? 'active' : ''}`}>Términos</Link>
            <a href="https://wiki.amai.cafe/Arisu" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Lore <ExternalLink size={14} /></a>
            <a href="https://arisu.amai.cafe/#/" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Dashboard <ExternalLink size={14} /></a>
          </div>

          {/* Botón de Tema */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem'
            }}
            title={isLightMode ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
          >
            {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Botón Hamburguesa (SOLO MÓVIL) */}
          <button
            className="hamburger-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Alternar menú"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <p style={{ color: 'var(--text-secondary)' }}>© {new Date().getFullYear()} Arisu. Desarrollado por <a href="https://github.com/Ameriria" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>@Ameriria</a> con <span style={{ color: 'var(--primary)' }}>❤</span> para Discord. | Contacto: <a href="mailto:hola@ameriria.com" style={{ color: 'var(--primary)' }}>hola@ameriria.com</a> ♡</p>
          <div className="footer-links" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            <a href="https://arisu.amai.cafe/#/" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Dashboard <ExternalLink size={14} /></a>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <Link to="/terms" className="footer-link">Términos de Servicio</Link>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <Link to="/docs" className="footer-link">Documentación</Link>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App