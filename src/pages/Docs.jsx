import React, { useState, useEffect, useRef } from 'react';
import { Info, AlertTriangle, Lightbulb, Copy, Check, BookOpen, ShieldCheck, Coins, Sparkles, Wrench, Menu, X } from 'lucide-react';

// Estructura de navegación para la Wiki/Docs
const DOCS_PAGES = [
  { id: 'getting-started', title: 'Primeros Pasos', icon: BookOpen },
  { id: 'configuration', title: 'Configuración Básica', icon: Wrench },
  { id: 'moderation', title: 'Guía de Moderación', icon: ShieldCheck },
  { id: 'economy', title: 'Sistemas de Economía', icon: Coins },
  { id: 'customization', title: 'Personalización', icon: Sparkles }
];

// Subcomponente para transiciones suaves (Ajustado para que permita position: sticky).
// Idéntico al de Commands.jsx para mantener la misma estética/animaciones.
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

// offsetTop es relativo al ancestro posicionado más cercano (acá sería
// .docs-gitbook-container, que tiene position:relative), no al documento.
// Usamos getBoundingClientRect + scrollY para tener siempre la posición
// real respecto a la página, sin importar qué ancestro esté posicionado.
const getDocumentOffsetTop = (el) => {
  if (!el) return 0;
  return el.getBoundingClientRect().top + window.scrollY;
};

const Callout = ({ type = 'info', title, children }) => {
  const types = {
    info: { icon: Info, color: 'var(--accent)', bg: 'rgba(254, 191, 212, 0.1)', border: 'var(--accent)' },
    warning: { icon: AlertTriangle, color: '#ffb347', bg: 'rgba(255, 179, 71, 0.1)', border: '#ffb347' },
    tip: { icon: Lightbulb, color: 'var(--primary)', bg: 'var(--primary-glow)', border: 'var(--primary)' }
  };
  const config = types[type] || types.info;
  const Icon = config.icon;
  
  return (
    <div style={{ padding: '1rem', borderRadius: '4px', background: config.bg, borderLeft: `3px solid ${config.border}`, marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
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
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{language}</span>
        <button onClick={handleCopy} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
          {copied ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />}
        </button>
      </div>
      <pre style={{ background: 'var(--bg-secondary)', padding: '1.25rem 1rem', borderRadius: '4px', border: '1px solid var(--border-color)', overflowX: 'auto', fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-primary)', margin: 0 }}>
        <code style={{ background: 'transparent', padding: 0, border: 'none', color: 'inherit' }}>{code}</code>
      </pre>
    </div>
  );
};

const DOC_CONTENT = {
  'getting-started': [
    {
      id: 'bienvenida',
      title: 'Bienvenida a Arisu',
      content: <><p>Arisu es un bot multifuncional para administrar, proteger y animar tu comunidad de Discord desde un mismo lugar.</p><Callout type="info" title="Una experiencia completa">Combina moderación, economía, perfiles, música, juegos, automatización y herramientas sociales.</Callout></>
    },
    {
      id: 'primer-comando',
      title: 'Tu primer comando',
      content: <><p>El prefijo predeterminado es <code>&lt;3</code>. Escribe el prefijo seguido del nombre del comando para ejecutarlo.</p><CopyCode code="<3help" language="discord" /><p>También puedes usar los comandos slash disponibles en Discord. La página <strong>Comandos</strong> contiene la lista completa, aliases, permisos y ejemplos.</p></>
    }
  ],
  configuration: [
    {
      id: 'setup-inicial',
      title: 'Configuración inicial',
      content: <><p>Empieza con los comandos de configuración de cada módulo. Ejecuta los comandos en el canal donde quieras aplicar el ajuste.</p><CopyCode code="<3setup" language="discord" /><Callout type="warning" title="Permisos necesarios">Arisu necesita los permisos que correspondan a cada función: gestionar canales, roles, mensajes, moderar miembros o administrar el servidor.</Callout></>
    },
    {
      id: 'canales',
      title: 'Canales y módulos',
      content: <><p>Los módulos de canales permiten limitar dónde se usan los comandos y definir un canal principal para el bot.</p><CopyCode code={'<3setup_general\n<3setup_bot_channel #canal\n<3free_channel'} language="discord" /><p>Los sistemas de tickets, voz temporal, confesiones, logs, alertas y eventos tienen sus propios comandos de configuración.</p></>
    },
    {
      id: 'persistencia',
      title: 'Configuración persistente',
      content: <p>Los ajustes del servidor y los datos de usuario se guardan para que los paneles, roles, canales y sistemas puedan continuar funcionando después de reiniciar el bot.</p>
    }
  ],
  moderation: [
    {
      id: 'moderacion-basica',
      title: 'Moderación básica',
      content: <><p>El módulo de moderación incluye advertencias, silencios temporales, expulsiones, baneos y limpieza de mensajes.</p><CopyCode code={'<3warn @usuario [razón]\n<3mute @usuario [razón]\n<3kick @usuario [razón]\n<3ban @usuario [razón]\n<3clear [cantidad]'} language="discord" /><Callout type="warning" title="Revisa los permisos">Estos comandos requieren permisos de moderación y respetan la jerarquía de roles de Discord.</Callout></>
    },
    {
      id: 'seguridad',
      title: 'Seguridad y registros',
      content: <><p>Activa la verificación para controlar el acceso de nuevos miembros y configura logs para conservar un registro de acciones importantes.</p><CopyCode code={'<3setlog [categoría] [canal_id]\n<3import_list [tipo_lista]'} language="discord" /><p>El automod puede trabajar con listas importadas y reaccionar a contenido que deba ser controlado.</p></>
    },
    {
      id: 'tickets',
      title: 'Tickets de soporte',
      content: <><p>El sistema de tickets organiza la atención del staff con categorías, roles, canal de logs y tipos de solicitud.</p><CopyCode code={'<3setup ticket category [categoría]\n<3setup ticket role add @rol\n<3setup ticket type add [prefijo] [emoji] [etiqueta]'} language="discord" /></>
    }
  ],
  economy: [
    {
      id: 'economia-basica',
      title: 'Cartera y banco',
      content: <><p>La economía tiene una cartera para tus gastos diarios y un banco para guardar tu dinero.</p><CopyCode code={'<3balance\n<3deposit [cantidad]\n<3withdraw [cantidad]\n<3pay @usuario [cantidad]'} language="discord" /></>
    },
    {
      id: 'ganar-dinero',
      title: 'Ganar dinero',
      content: <><p>Reclama tu recompensa diaria, trabaja o participa en las actividades disponibles para aumentar tu balance.</p><CopyCode code={'<3daily\n<3work\n<3rob @usuario'} language="discord" /><Callout type="tip" title="Economía global">Tu progreso económico se mantiene asociado a tu perfil y puede estar disponible en los servidores donde Arisu esté configurada.</Callout></>
    },
    {
      id: 'tienda',
      title: 'Tienda e intercambios',
      content: <><p>Consulta la tienda, compra objetos, usa tu inventario e intercambia artículos o personajes con otros miembros.</p><CopyCode code={'<3shop\n<3buy [nombre_o_id]\n<3inventory\n<3trade @usuario [objeto]'} language="discord" /></>
    }
  ],
  customization: [
    {
      id: 'perfil',
      title: 'Tu perfil',
      content: <><p>Consulta y personaliza tu perfil con biografía, color, banner y personaje favorito.</p><CopyCode code={'<3profile\n<3set_bio [texto]\n<3set_color [color]\n<3set_banner [url]'} language="discord" /></>
    },
    {
      id: 'niveles-logros',
      title: 'Niveles y logros',
      content: <><p>La actividad de la comunidad puede reflejarse en niveles, experiencia, rankings y medallas.</p><CopyCode code={'<3leaderboard\n<3logros\n<3torneo'} language="discord" /><Callout type="info" title="Configuración del staff">El staff puede ajustar el sistema de niveles con el grupo <code>&lt;3niveles</code> y sus subcomandos.</Callout></>
    },
    {
      id: 'entretenimiento',
      title: 'Música y juegos',
      content: <><p>Arisu incluye música, gacha, colecciones, juegos de HSR y Uma Musume, además de acciones sociales.</p><CopyCode code={'<3play [canción o enlace]\n<3gacha\n<3album\n<3derby'} language="discord" /></>
    }
  ]
};

const Docs = () => {
  const [activePage, setActivePage] = useState(DOCS_PAGES[0].id);
  const [activeHeading, setActiveHeading] = useState('');
  // Controla el menú de Documentación en móvil (hamburguesa/dropdown), igual que en Commands
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const sections = DOC_CONTENT[activePage] || [];

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
    setActiveHeading(sections[0]?.id || '');

    const handleScroll = () => {
      const headings = sections.map(section => document.getElementById(section.id));
      // Ajustamos el offset para que el menú de la derecha cambie un poco antes al llegar al título sticky
      const scrollPosition = window.scrollY + 250;

      for (let i = headings.length - 1; i >= 0; i -= 1) {
        const heading = headings[i];
        if (heading && getDocumentOffsetTop(heading) <= scrollPosition) {
          setActiveHeading(sections[i].id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePage, sections]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: getDocumentOffsetTop(element) - 100,
        behavior: 'smooth'
      });
      setActiveHeading(id);
    }
  };

  const handlePageClick = (pageId) => {
    setActivePage(pageId);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPage = DOCS_PAGES.find(p => p.id === activePage);
  const CurrentIcon = currentPage?.icon;

  const renderContent = () => sections.map((section, index) => (
    <FadeInSection key={section.id} delay={index * 0.1}>
      <section id={section.id} className="docs-section">
        <h2 className="section-title"><a href={`#${section.id}`} className="hash-anchor">#</a>{section.title}</h2>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{section.content}</div>
      </section>
    </FadeInSection>
  ));

  return (
    <div className="docs-gitbook-container">
      {/* Left Sidebar */}
      <aside className="docs-sidebar-left glass-panel-subtle">
        {/* Solo visible en móvil: convierte el menú de Documentación en un
            dropdown tipo hamburguesa para no ocupar toda la pantalla */}
        <button
          type="button"
          className="mobile-nav-toggle"
          onClick={() => setMobileNavOpen(prev => !prev)}
          aria-expanded={mobileNavOpen}
          aria-label="Abrir menú de documentación"
        >
          <span className="mobile-nav-toggle-current">
            {CurrentIcon && <CurrentIcon size={16} />}
            {currentPage?.title}
          </span>
          {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className={`sidebar-panel ${mobileNavOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav" style={{ marginTop: '1rem' }}>
            <h4 className="nav-group-title">Documentación</h4>
            <ul>
              {DOCS_PAGES.map(page => {
                const Icon = page.icon;
                const isActive = activePage === page.id;
                return (
                  <li key={page.id}>
                    <button
                      className={`nav-link-item ${isActive ? 'active' : ''}`}
                      onClick={() => handlePageClick(page.id)}
                      style={{ width: '100%', textAlign: 'left', border: 'none', background: isActive ? 'var(--primary-glow)' : 'transparent', cursor: 'pointer' }}
                    >
                      <Icon size={16} className="category-icon" />
                      {page.title}
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
            <h1 id="docs-title"><a href="#docs-title" className="hash-anchor">#</a>{currentPage?.title}</h1>
            <p className="docs-subtitle">Guías paso a paso y configuración detallada.</p>
          </FadeInSection>
        </div>

        {renderContent()}
      </main>

      {/* Right Sidebar (Table of Contents Dinámico) */}
      <aside className="docs-sidebar-right">
        <div className="toc-container">
          <h4>En esta página</h4>
          <ul>
            {sections.map(section => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={activeHeading === section.id ? 'active' : ''}
                  onClick={(e) => scrollToSection(e, section.id)}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Docs;