import React, { useState, useEffect } from 'react';
import { Search, Home, Coins, Users, Gamepad2, Wrench, Shield, Bot, Image as ImageIcon, Rocket, Music, MessageSquareQuote, Gift, Info, AlertTriangle, Lightbulb, Copy, Check, Terminal } from 'lucide-react';
import commandsData from '../data/commands.json';

const SUPER_CATEGORIES = [
  {
    name: "Overview",
    icon: Home,
    subcategories: ["Help"]
  },
  {
    name: "Economía",
    icon: Coins,
    subcategories: ["Economy", "Logros"]
  },
  {
    name: "Social",
    icon: Users,
    subcategories: ["Acciones", "Confesiones", "Social", "Album", "Interactions"]
  },
  {
    name: "Entretenimiento",
    icon: Gamepad2,
    subcategories: ["Api_anime", "Api_steam", "Eventos", "Events_random", "Game_hsr", "Game_uma"]
  },
  {
    name: "Utilidad",
    icon: Wrench,
    subcategories: ["Afk", "Invites", "Tempvoice", "Utilidad", "Scheduler"]
  },
  {
    name: "Moderación",
    icon: Shield,
    subcategories: ["Alerts", "Automation", "Automatizacion", "Canales", "Embeds", "Moderacion", "Roles", "Verificacion", "Logs", "Tickets"]
  },
  {
    name: "IA",
    icon: Bot,
    subcategories: ["Ai_chat"]
  },
  {
    name: "Personalización Perfil",
    icon: ImageIcon,
    subcategories: ["Niveles", "Spotlight_gen"]
  },
  {
    name: "Boosters",
    icon: Rocket,
    subcategories: ["Boosters"]
  },
  {
    name: "Música",
    icon: Music,
    subcategories: ["Musica"]
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

const Docs = () => {
  const [search, setSearch] = useState('');
  const [activeSuperCat, setActiveSuperCat] = useState(SUPER_CATEGORIES[0].name);
  const [activeSubCat, setActiveSubCat] = useState(SUPER_CATEGORIES[0].subcategories[0]);

  useEffect(() => {
    if (search) return;
    
    const handleScroll = () => {
      const activeSuper = SUPER_CATEGORIES.find(s => s.name === activeSuperCat);
      if (!activeSuper) return;

      const subcats = activeSuper.subcategories;
      const sections = subcats.map(sub => document.getElementById(`subcat-${sub}`));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
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
        top: element.offsetTop - 100,
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

  return (
    <div className="docs-gitbook-container">
      {/* Left Sidebar */}
      <aside className="docs-sidebar-left glass-panel-subtle">
        <div className="sidebar-search">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar comandos..." 
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
              return (
                <li key={superCat.name}>
                  <button 
                    className={`nav-link-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSuperCatClick(superCat.name)}
                    style={{ width: '100%', textAlign: 'left', border: 'none', background: isActive ? 'var(--primary-glow)' : 'transparent', cursor: 'pointer' }}
                  >
                    <Icon size={16} className="category-icon" />
                    {superCat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="docs-main-content">
        <div className="docs-header-gitbook">
          <h1 id="docs-title"><a href="#docs-title" className="hash-anchor">#</a>{search ? 'Resultados de Búsqueda' : currentSuperCatObj.name}</h1>
          <p className="docs-subtitle">
            {search 
              ? `Mostrando comandos que coinciden con "${search}".` 
              : `Explora todos los comandos del módulo de ${currentSuperCatObj.name.toLowerCase()} de Arisu.`
            }
          </p>
        </div>

        {!search && activeSuperCat === 'Overview' && (
          <div style={{ marginBottom: '2rem' }}>
            <Callout type="info" title="Bienvenido a la Documentación">
              Aquí encontrarás todos los comandos de Arisu, organizados por categoría. Usa la barra lateral para navegar o busca un comando específico.
            </Callout>
            <Callout type="tip" title="Prefijo Personalizable">
              El prefijo por defecto es &lt;3, pero puede cambiarse por servidor usando el comando de configuración.
            </Callout>
          </div>
        )}
        
        {!search && activeSuperCat === 'Economía' && (
          <div style={{ marginBottom: '2rem' }}>
            <Callout type="tip" title="Sistema Global">
              Todos los comandos de economía afectan tu balance global a través de todos los servidores donde Arisu esté presente.
            </Callout>
            <CopyCode code="<3daily" language="discord" />
          </div>
        )}
        
        {!search && activeSuperCat === 'Moderación' && (
          <div style={{ marginBottom: '2rem' }}>
            <Callout type="warning" title="Permisos Requeridos">
              La mayoría de los comandos en este módulo requieren que tengas permisos de Administrador o Moderador en el servidor.
            </Callout>
            <CopyCode code="<3setup_general" language="discord" />
          </div>
        )}
        
        {!search && activeSuperCat === 'Social' && (
          <div style={{ marginBottom: '2rem' }}>
            <Callout type="info" title="Interacciones Sociales">
              Menciona a otros usuarios en los comandos de acción para interactuar con ellos.
            </Callout>
            <CopyCode code="<3hug @usuario" language="discord" />
          </div>
        )}

        {search ? (
          <div className="search-results">
            {filteredCommands.length > 0 ? (
              <div className="section-commands">
                <CommandTable commands={filteredCommands} />
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No se encontraron comandos coincidentes.</p>
            )}
          </div>
        ) : (
          currentSuperCatObj.subcategories.map(subcat => {
            const subcatCommands = commandsData.filter(c => c.category === subcat);
            if (subcatCommands.length === 0) return null;

            return (
              <section key={subcat} id={`subcat-${subcat}`} className="docs-section">
                <h2 className="section-title" style={{ fontSize: '1.4rem' }}>
                  <a href={`#subcat-${subcat}`} className="hash-anchor">#</a>{subcat}
                </h2>
                <div className="section-commands">
                  <CommandTable commands={subcatCommands} />
                </div>
              </section>
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
                const subcatCommands = commandsData.filter(c => c.category === subcat);
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
            <td>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <code className="code-block" style={{ display: 'inline-block', width: 'fit-content', color: 'var(--text-primary)', background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  {'<3' + cmd.name}
                </code>
                {cmd.aliases && cmd.aliases.length > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Alias: {cmd.aliases.map(a => `<3${a}`).join(', ')}
                  </span>
                )}
              </div>
            </td>
            <td>
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
            <td>
              <span className="badge-access">
                {cmd.permissions}
              </span>
            </td>
            <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
              {cmd.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Docs;
