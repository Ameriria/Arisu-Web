import React, { useState, useEffect, useRef } from 'react';
import { Search, Home, Coins, Users, Gamepad2, Wrench, Shield, Bot, Image as ImageIcon, Music, MessageSquareQuote, Gift, Info, AlertTriangle, Lightbulb, Copy, Check, Terminal, Menu, X } from 'lucide-react';
import commandsData from '../data/commands.json';

// Subcomponente para transiciones suaves (Ajustado para que permita position: sticky)
const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target); 
        }
      });
    });
    
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        // Usamos 'none' en vez de 'translateY(0)' para no romper el position: sticky de los hijos
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

// IMPORTANTE: los valores de "subcategories" deben coincidir con el campo
// "category" real de cada comando en ../data/commands.json (ver normalizeCategory
// más abajo para el detalle de cómo se comparan). Antes esta lista tenía nombres
// inventados/en español (p.ej. "Economy", "Logros", "Api_anime") que no existían
// en el JSON, así que esas secciones nunca mostraban comandos.
const SUPER_CATEGORIES = [
  {
    name: "General",
    icon: Home,
    subcategories: ["Help", "General"]
  },
  {
    name: "Economía",
    icon: Coins,
    subcategories: ["Income", "Gacha", "Shop", "Achievements", "Trade", "Leaderboard"]
  },
  {
    name: "Social",
    icon: Users,
    subcategories: ["Confessions", "Social", "Album", "Roleplay"]
  },
  {
    name: "Entretenimiento",
    icon: Gamepad2,
    subcategories: ["Api Anime", "Api Steam", "Events", "Chat Events", "Game Hsr", "Game Uma", "Tournaments"]
  },
  {
    name: "Utilidad",
    icon: Wrench,
    subcategories: ["Afk", "Invites", "Tempvoice", "Stickies", "Triggers", "Base"]
  },
  {
    name: "Moderación",
    icon: Shield,
    subcategories: ["Alerts", "Automod", "Active Mod", "Channels", "Embeds", "Admin", "Logs", "Tickets", "Config"]
  },
  {
    name: "IA",
    icon: Bot,
    subcategories: ["Ai Chat"]
  },
  {
    name: "Personalización Perfil",
    icon: ImageIcon,
    subcategories: ["Profile"]
  },
  {
    name: "Música",
    icon: Music,
    subcategories: ["Music"]
  },
  {
    name: "Quote",
    icon: MessageSquareQuote,
    subcategories: ["Quote"]
  },
  {
    name: "Giveaways",
    icon: Gift,
    subcategories: ["Giveaways"]
  },
  {
    name: "Sistema",
    icon: Terminal,
    subcategories: ["Debug"]
  }
];

// Compara categorías de forma tolerante a mayúsculas/minúsculas y a que se
// use "_" o espacios (p.ej. "Ai_chat" === "Ai Chat" === "ai chat"). Esto es
// una red de seguridad extra: aunque ahora los nombres de arriba coinciden
// exactamente con el JSON, evita que vuelva a romperse el filtrado si en el
// futuro se agrega una categoría nueva con formato ligeramente distinto.
const normalizeCategory = (str) =>
  (str || '').toString().trim().toLowerCase().replace(/[_\s]+/g, ' ');

const categoryMatches = (cmdCategory, subcat) =>
  normalizeCategory(cmdCategory) === normalizeCategory(subcat);

const Callout = ({ type = 'info', title, children }) => {
  const types = {
    info: { icon: Info, color: 'var(--accent)', bg: 'rgba(254, 191, 212, 0.1)', border: 'var(--accent)' },
    warning: { icon: AlertTriangle, color: '#ffb347', bg: 'rgba(255, 179, 71, 0.1)', border: '#ffb347' },
    tip: { icon: Lightbulb, color: 'var(--primary)', bg: 'var(--primary-glow)', border: 'var(--primary)' }
  };
  const config = types[type] || types.info;
  const Icon = config.icon;
  
  return (
    <div style={{
      padding: '1rem',
      borderRadius: '4px',
      background: config.bg,
      borderLeft: `3px solid ${config.border}`,
      marginBottom: '1.5rem',
      display: 'flex',
      gap: '1rem'
    }}>
      <Icon size={20} style={{ color: config.color, flexShrink: 0, marginTop: '2px' }} />
      <div>
        {title && <h5 style={{ color: config.color, marginBottom: '0.25rem', fontSize: '0.95rem' }}>{title}</h5>}
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const CopyCode = ({ code, language = 'bash' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        padding: '0.5rem',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{language}</span>
        <button 
          onClick={handleCopy}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex'
          }}
          title="Copiar código"
        >
          {copied ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />}
        </button>
      </div>
      <pre style={{ 
        background: 'var(--bg-secondary)', 
        padding: '1.25rem 1rem', 
        borderRadius: '4px', 
        border: '1px solid var(--border-color)',
        overflowX: 'auto',
        fontSize: '0.85rem',
        fontFamily: 'monospace',
        color: 'var(--text-primary)',
        margin: 0
      }}>
        <code style={{ background: 'transparent', padding: 0, border: 'none', color: 'inherit' }}>{code}</code>
      </pre>
    </div>
  );
};

// offsetTop es relativo al ancestro posicionado más cercano (acá sería
// .docs-gitbook-container, que tiene position:relative), no al documento.
// Usamos getBoundingClientRect + scrollY para tener siempre la posición
// real respecto a la página, sin importar qué ancestro esté posicionado.
const getDocumentOffsetTop = (el) => {
  if (!el) return 0;
  return el.getBoundingClientRect().top + window.scrollY;
};

// Botón chiquito para copiar un comando al portapapeles con un click.
// Distinto de <CopyCode>: ese es para bloques de código completos con
// label de lenguaje; este es solo el ícono, para meter al lado de un
// code-block inline en la tabla de comandos.
const InlineCopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-copy-btn ${copied ? 'copied' : ''}`}
      title={copied ? '¡Copiado!' : 'Copiar comando'}
      aria-label="Copiar comando"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
};

const Commands = () => {
  const [search, setSearch] = useState('');
  const [activeSuperCat, setActiveSuperCat] = useState(SUPER_CATEGORIES[0].name);
  const [activeSubCat, setActiveSubCat] = useState(SUPER_CATEGORIES[0].subcategories[0]);
  // Controla el menú de Módulos en móvil (hamburguesa/dropdown)
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Medimos la altura REAL de la navbar principal del sitio (.navbar) en
  // vez de adivinar un valor fijo en px. Así el offset sticky de toda la
  // sección de docs (toggle móvil, títulos de sección, sidebars) siempre
  // coincide exacto con la navbar, sin importar cuánto mida en cada
  // breakpoint o si cambia en el futuro.
  //
  // OJO: la navbar (App.jsx) también encoge su padding al cruzar
  // scrollY > 50, con una transición de ~0.3s — así que no basta con
  // medir una sola vez al montar: hay que re-medir mientras se scrollea
  // (para ir siguiendo la animación) y una vez más al terminar la
  // transición, para capturar la altura final ya encogida.
  useEffect(() => {
    let rafId = null;
    let settleId = null;

    const measure = () => {
      const navEl = document.querySelector('.navbar');
      if (navEl) {
        const height = navEl.getBoundingClientRect().height;
        if (height > 0) {
          document.documentElement.style.setProperty('--docs-sticky-offset', `${Math.ceil(height)}px`);
        }
      }
    };

    const scheduleMeasure = () => {
      if (rafId == null) {
        rafId = requestAnimationFrame(() => {
          measure();
          rafId = null;
        });
      }
      clearTimeout(settleId);
      settleId = setTimeout(measure, 320);
    };

    measure();
    window.addEventListener('load', measure);
    window.addEventListener('resize', scheduleMeasure);
    window.addEventListener('scroll', scheduleMeasure, { passive: true });

    return () => {
      window.removeEventListener('load', measure);
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('scroll', scheduleMeasure);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(settleId);
    };
  }, []);

  useEffect(() => {
    if (search) return;
    
    const handleScroll = () => {
      const activeSuper = SUPER_CATEGORIES.find(s => s.name === activeSuperCat);
      if (!activeSuper) return;

      const subcats = activeSuper.subcategories;
      const sections = subcats.map(sub => document.getElementById(`subcat-${sub}`));
      // Ajustamos el offset para que el menú de la derecha cambie un poco antes al llegar al título sticky
      const scrollPosition = window.scrollY + 250; 

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && getDocumentOffsetTop(section) <= scrollPosition) {
          setActiveSubCat(subcats[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSuperCat, search]);

  const scrollToSubCategory = (e, subcat) => {
    e.preventDefault();
    const element = document.getElementById(`subcat-${subcat}`);
    if (element) {
      window.scrollTo({
        top: getDocumentOffsetTop(element) - 100,
        behavior: 'smooth'
      });
      setActiveSubCat(subcat);
    }
  };

  const handleSuperCatClick = (superCatName) => {
    setActiveSuperCat(superCatName);
    const superCatObj = SUPER_CATEGORIES.find(s => s.name === superCatName);
    if (superCatObj) {
      setActiveSubCat(superCatObj.subcategories[0]);
    }
    setSearch('');
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCommands = search 
    ? commandsData.filter(cmd => 
        cmd.name.toLowerCase().includes(search.toLowerCase()) || 
        cmd.description.toLowerCase().includes(search.toLowerCase()) ||
        (cmd.aliases && cmd.aliases.some(a => a.toLowerCase().includes(search.toLowerCase())))
      )
    : commandsData;

  const currentSuperCatObj = SUPER_CATEGORIES.find(s => s.name === activeSuperCat);
  const totalCommandsCount = commandsData.length;
  const CurrentIcon = currentSuperCatObj.icon;

  return (
    <div className="docs-gitbook-container">
      {/* Left Sidebar */}
      <aside className="docs-sidebar-left glass-panel-subtle">
        {/* Solo visible en móvil: convierte el menú de Módulos en un
            dropdown tipo hamburguesa para no ocupar toda la pantalla */}
        <button
          type="button"
          className="mobile-nav-toggle"
          onClick={() => setMobileNavOpen(prev => !prev)}
          aria-expanded={mobileNavOpen}
          aria-label="Abrir menú de módulos"
        >
          <span className="mobile-nav-toggle-current">
            <CurrentIcon size={16} />
            {search ? 'Resultados de Búsqueda' : currentSuperCatObj.name}
          </span>
          {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className={`sidebar-panel ${mobileNavOpen ? 'open' : ''}`}>
          <div className="sidebar-search">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder={`Buscar en ${totalCommandsCount} comandos...`} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <nav className="sidebar-nav">
            <h4 className="nav-group-title">Módulos</h4>
            <ul>
              {SUPER_CATEGORIES.map(superCat => {
                const Icon = superCat.icon;
                const isActive = !search && activeSuperCat === superCat.name;
                const moduleCommandCount = commandsData.filter(c => superCat.subcategories.some(sub => categoryMatches(c.category, sub))).length;
                return (
                  <li key={superCat.name}>
                    <button 
                      className={`nav-link-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleSuperCatClick(superCat.name)}
                      style={{ width: '100%', textAlign: 'left', border: 'none', background: isActive ? 'var(--primary-glow)' : 'transparent', cursor: 'pointer' }}
                    >
                      <Icon size={16} className="category-icon" />
                      <span>{superCat.name}</span>
                      <span className="nav-count">({moduleCommandCount})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="docs-main-content">
        <div className="docs-header-gitbook">
          <FadeInSection>
            <h1 id="docs-title"><a href="#docs-title" className="hash-anchor">#</a>{search ? 'Resultados de Búsqueda' : currentSuperCatObj.name}</h1>
            {/* Solo mostramos el subtítulo si el usuario está buscando algo */}
            {search && (
              <p className="docs-subtitle">
                Mostrando {filteredCommands.length} {filteredCommands.length === 1 ? 'comando que coincide' : 'comandos que coinciden'} con "{search}".
              </p>
            )}
          </FadeInSection>
        </div>

        {!search && activeSuperCat === 'General' && (
          <FadeInSection delay={0.1}>
            <div style={{ marginBottom: '2rem' }}>
              <Callout type="info" title="Bienvenido a la Documentación de Comandos">
                Aquí encontrarás todos los comandos de Arisu, organizados por categoría. Usa la barra lateral para navegar o busca un comando específico.
              </Callout>
              <Callout type="tip" title="Prefijo Personalizable">
                El prefijo por defecto es &lt;3, pero puede cambiarse por servidor usando el comando de configuración.
              </Callout>
            </div>
          </FadeInSection>
        )}
        
        {!search && activeSuperCat === 'Economía' && (
          <FadeInSection delay={0.1}>
            <div style={{ marginBottom: '2rem' }}>
              <Callout type="tip" title="Sistema Global">
                Todos los comandos de economía afectan tu balance global a través de todos los servidores donde Arisu esté presente.
              </Callout>
              <CopyCode code="<3daily" language="discord" />
            </div>
          </FadeInSection>
        )}
        
        {!search && activeSuperCat === 'Moderación' && (
          <FadeInSection delay={0.1}>
            <div style={{ marginBottom: '2rem' }}>
              <Callout type="warning" title="Permisos Requeridos">
                La mayoría de los comandos en este módulo requieren que tengas permisos de Administrador o Moderador en el servidor.
              </Callout>
              <CopyCode code="<3setup_general" language="discord" />
            </div>
          </FadeInSection>
        )}
        
        {!search && activeSuperCat === 'Social' && (
          <FadeInSection delay={0.1}>
            <div style={{ marginBottom: '2rem' }}>
              <Callout type="info" title="Interacciones Sociales">
                Menciona a otros usuarios en los comandos de acción para interactuar con ellos.
              </Callout>
              <CopyCode code="<3hug @usuario" language="discord" />
            </div>
          </FadeInSection>
        )}

        {search ? (
          <div className="search-results">
            {filteredCommands.length > 0 ? (
              <FadeInSection delay={0.2}>
                <div className="section-commands">
                  <CommandTable commands={filteredCommands} />
                </div>
              </FadeInSection>
            ) : (
              <FadeInSection delay={0.2}>
                <p style={{ color: 'var(--text-muted)' }}>No se encontraron comandos coincidentes.</p>
              </FadeInSection>
            )}
          </div>
        ) : (
          currentSuperCatObj.subcategories.map((subcat, index) => {
            const subcatCommands = commandsData.filter(c => categoryMatches(c.category, subcat));
            if (subcatCommands.length === 0) return null;

            return (
              <FadeInSection key={subcat} delay={index * 0.1}>
                <section id={`subcat-${subcat}`} className="docs-section">
                  <h2 
                    className="section-title" 
                    style={{ 
                      fontSize: '1.4rem', 
                      justifyContent: 'space-between'
                      // El resto (sticky, top, background, z-index, padding)
                      // vive en .section-title dentro de index.css
                    }}
                  >
                    {/* position:relative acá para que .hash-anchor (position:absolute)
                        se centre respecto a este span de solo texto, y no respecto a
                        la caja completa del h2 (que tiene padding y el badge al lado) */}
                    <span style={{ position: 'relative' }}>
                      <a href={`#subcat-${subcat}`} className="hash-anchor">#</a>{subcat}
                    </span>
                    {/* Badge de conteo de comandos por sección */}
                    <span style={{
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-body)',
                      color: 'var(--primary)',
                      background: 'var(--primary-glow)',
                      padding: '0.2rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-focus)',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      {subcatCommands.length} {subcatCommands.length === 1 ? 'comando' : 'comandos'}
                    </span>
                  </h2>
                  <div className="section-commands">
                    <CommandTable commands={subcatCommands} />
                  </div>
                </section>
              </FadeInSection>
            );
          })
        )}
      </main>
      
      {/* Right Sidebar (Table of Contents) */}
      <aside className="docs-sidebar-right">
        {!search && (
          <div className="toc-container">
            <h4>En esta página</h4>
            <ul>
              {currentSuperCatObj.subcategories.map(subcat => {
                const subcatCommands = commandsData.filter(c => categoryMatches(c.category, subcat));
                if (subcatCommands.length === 0) return null;

                return (
                  <li key={subcat}>
                    <a 
                      href={`#subcat-${subcat}`}
                      className={activeSubCat === subcat ? 'active' : ''}
                      onClick={(e) => scrollToSubCategory(e, subcat)}
                    >
                      {subcat}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
};

// Reusable component for the new Command Table
const CommandTable = ({ commands }) => (
  <div className="table-container">
    <table className="docs-table">
      <thead>
        <tr>
          <th>Comando</th>
          <th>Ejemplo de Uso</th>
          <th>Acceso</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        {commands.map((cmd, idx) => (
          <tr key={idx}>
            <td data-label="Comando">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <code className="code-block" style={{ display: 'inline-block', width: 'fit-content', color: 'var(--text-primary)', background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    {'<3' + cmd.name}
                  </code>
                  <InlineCopyButton text={'<3' + cmd.name} />
                </div>
                {cmd.aliases && cmd.aliases.length > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Alias: {cmd.aliases.map(a => `<3${a}`).join(', ')}
                  </span>
                )}
              </div>
            </td>
            <td data-label="Ejemplo de Uso">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <code className="code-block" style={{ color: 'var(--text-primary)', background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', width: 'fit-content' }}>
                  {cmd.example || `<3${cmd.name}`}
                </code>
                {cmd.aliases && cmd.aliases.length > 0 && (
                  cmd.aliases.map(a => {
                    const aliasExample = cmd.example ? cmd.example.replace(`<3${cmd.name}`, `<3${a}`) : `<3${a}`;
                    return (
                      <code key={a} className="code-block" style={{ color: 'var(--text-secondary)', background: 'transparent', borderColor: 'transparent', padding: '0 0.5rem', fontSize: '0.8rem', width: 'fit-content' }}>
                        {aliasExample}
                      </code>
                    );
                  })
                )}
              </div>
            </td>
            <td data-label="Acceso">
              <span className="badge-access">
                {cmd.permissions}
              </span>
            </td>
            <td data-label="Descripción" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
              {cmd.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Commands;