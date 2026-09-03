import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Coins, Sparkles, MessageSquareHeart, Music, ClipboardList, Ticket, UserPlus, BrainCircuit, Heart, Key, ExternalLink } from 'lucide-react';

// Lazy loading del formulario de contacto para optimizar la carga inicial
const ContactForm = lazy(() => import('../components/ContactForm'));

// Subcomponente para crear transiciones suaves al hacer scroll
const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Una vez que es visible, dejamos de observarlo para que no se repita la animación
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
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div style={{ border: '1px solid var(--border-color)', marginBottom: '0.5rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
      <button
        onClick={onClick}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem', background: isOpen ? 'var(--bg-glass)' : 'transparent',
          border: 'none', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem',
          cursor: 'pointer', textAlign: 'left', transition: 'background 0.3s ease'
        }}
      >
        {title}
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease', fontSize: '0.8rem' }}>▼</span>
      </button>
      <div style={{
        maxHeight: isOpen ? '1000px' : '0', overflow: 'hidden',
        transition: 'max-height 0.4s ease-in-out',
        background: 'transparent'
      }}>
        <div style={{ padding: '0 1rem 1rem 1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  // Lógica de dos pasos para animar entrada y salida del modal
  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(0);

  // Prevenir scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showModal]);

  const handleOpenModal = () => {
    setShowModal(true);
    // Pequeño retraso para permitir que el elemento se monte antes de animarlo
    setTimeout(() => setAnimateModal(true), 10);
  };

  const handleCloseModal = () => {
    setAnimateModal(false);
    // Esperamos a que termine la animación antes de desmontar el componente
    setTimeout(() => setShowModal(false), 300);
  };

  const handleScrollToBeta = (e) => {
    e.preventDefault();
    const element = document.getElementById('beta-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-bg-glow"></div>
        <FadeInSection>
          <h1 className="hero-title">
            Todo lo que tu servidor necesita…<br />pero más
            <span className="text-gradient"> adorable ❤</span>
          </h1>
        </FadeInSection>
        
        <FadeInSection delay={0.2}>
          <p className="hero-subtitle">
            Arisu combina moderación, economía y diversión con un toque dulce y acogedor.
          </p>
        </FadeInSection>

        <FadeInSection delay={0.4}>
          <div className="hero-buttons" style={{ flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/commands" className="btn btn-primary">
                <Sparkles size={20} />
                Explorar Comandos
              </Link>
              <a href="#beta-form" onClick={handleScrollToBeta} className="btn btn-secondary">
                <Key size={20} />
                Solicitar Acceso Beta
              </a>
            </div>
            <a href="https://amai.cafe/discord/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: 'fit-content' }}>
              <Heart size={20} />
              Únete a Amai Café
              <ExternalLink size={14} style={{ marginLeft: '0.25rem', opacity: 0.7 }} />
            </a>
          </div>
        </FadeInSection>
      </section>

      <section style={{ padding: '4rem 0' }}>
        <FadeInSection>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
            <span className="text-gradient-purple">Arisu</span> está aquí para ayudarte ♡
          </h2>
        </FadeInSection>

        <div className="features-grid">
          <FadeInSection delay={0.1}>
            <div className="feature-card glass-panel">
              <div className="feature-icon"><Coins size={24} /></div>
              <h3 style={{ fontSize: '1.25rem' }}>Economía ♡</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Una economía global con coleccionables y personalización, junto a sistemas locales donde tu comunidad puede crear tiendas y vender roles.</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="feature-card glass-panel">
              <div className="feature-icon"><ClipboardList size={24} /></div>
              <h3 style={{ fontSize: '1.25rem' }}>Moderación Avanzada ♡</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Herramientas completas para gestionar tu servidor con registros automáticos, alertas y control eficiente de la actividad.</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.3}>
            <div className="feature-card glass-panel">
              <div className="feature-icon"><Shield size={24} /></div>
              <h3 style={{ fontSize: '1.25rem' }}>Seguridad ♡</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Protección del Servidor mediante antiraid, filtros de palabras y enlaces, y verificación configurable para mantener tu comunidad segura y bajo control.</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.4}>
            <div className="feature-card glass-panel">
              <div className="feature-icon"><MessageSquareHeart size={24} /></div>
              <h3 style={{ fontSize: '1.25rem' }}>Diversión y Gacha ♡</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Juegos, interacciones y un sistema de gacha conectado a la economía para mantener tu comunidad activa.</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.5}>
            <div className="feature-card glass-panel">
              <div className="feature-icon"><UserPlus size={24} /></div>
              <h3 style={{ fontSize: '1.25rem' }}>Comunidad y Soporte ♡</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Bienvenidas, tickets y mensajes automáticos para organizar tu servidor y mejorar la experiencia de tus usuarios.</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.6}>
            <div className="feature-card glass-panel">
              <div className="feature-icon"><BrainCircuit size={24} /></div>
              <h3 style={{ fontSize: '1.25rem' }}>IA Integrada ♡</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Respuestas, conversaciones y asistencia en comandos con un sistema de chat dinámico dentro de tu servidor.</p>
            </div>
          </FadeInSection>
        </div>

        <FadeInSection delay={0.2}>
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>¡Y mucho más! ♡</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
              Giveaways, música, embeds, citas, canales de voz temporales y otras herramientas para completar tu servidor.
            </p>
            <button onClick={handleOpenModal} className="btn btn-secondary">
              <Sparkles size={18} /> Ver todas las funciones
            </button>
          </div>
        </FadeInSection>
      </section>

      <FadeInSection>
        <section style={{ padding: '3rem 2rem', margin: '2rem auto 4rem', maxWidth: '800px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 8px 32px var(--shadow-color)' }}>
          <Heart size={40} style={{ color: 'var(--primary)', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px var(--primary-glow))' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Apoya el Proyecto</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Arisu es un proyecto gratuito que funciona única y exclusivamente gracias a las donaciones y al increíble apoyo de la comunidad. Tu aporte nos ayuda a mantener los servidores en línea y permite que podamos seguir creciendo con nuevas y adorables funciones.
          </p>
          <a href="https://ko-fi.com/ameriria" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z" />
            </svg>
            Apoyar en Ko-fi
            <ExternalLink size={16} style={{ opacity: 0.7 }} />
          </a>
        </section>
      </FadeInSection>

      <section id="beta-form" style={{ padding: '4rem 0', maxWidth: '600px', margin: '0 auto' }}>
        <FadeInSection>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Solicitar Acceso <span className="text-gradient-purple">Beta</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Arisu es actualmente un bot privado. Llena este formulario para solicitar acceso a @Ameriria (Developer / Owner de Amai Cafe) y llevar su estética a tu servidor.
          </p>

          {/* Suspense muestra un fallback mientras ContactForm termina de cargar */}
          <Suspense fallback={
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--primary)' }}>
              <Heart size={32} style={{ animation: 'pulse 1.5s infinite' }} />
              <p style={{ marginTop: '1rem' }}>Preparando el formulario...</p>
            </div>
          }>
            <ContactForm />
          </Suspense>
        </FadeInSection>
      </section>

      {/* Modal de características con transición suave integrada en línea */}
      {showModal && (
        <div 
          className="modal-overlay" 
          onClick={handleCloseModal}
          style={{
            opacity: animateModal ? 1 : 0,
            transition: 'opacity 0.3s ease-out'
          }}
        >
          <div 
            className="modal-content glass-panel" 
            onClick={(e) => e.stopPropagation()}
            style={{
              opacity: animateModal ? 1 : 0,
              transform: animateModal ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}><span className="text-gradient-purple">Todas</span> las Funciones</h2>
            <div className="accordions-container" style={{ textAlign: 'left', marginTop: '1rem' }}>
              <AccordionItem title="Economía" isOpen={openAccordion === 0} onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)}>
                <p style={{ marginBottom: '0.5rem' }}>Arisu cuenta con un sistema de economía completo que combina un entorno global con economías locales por servidor.</p>
                <p style={{ marginBottom: '0.5rem' }}>Los usuarios pueden ganar, intercambiar y gastar monedas, acceder a objetos coleccionables y personalizar su perfil global.</p>
                <p style={{ marginBottom: '0.5rem' }}>Dentro de cada servidor, también es posible crear tiendas personalizadas donde los miembros pueden vender roles, mejoras u otros beneficios, permitiendo que cada comunidad desarrolle su propia dinámica económica.</p>
                <p>Además, el sistema se conecta con otras funciones como minijuegos y gacha, creando una experiencia integrada y progresiva.</p>
              </AccordionItem>

              <AccordionItem title="Moderación y Seguridad" isOpen={openAccordion === 1} onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}>
                <p style={{ marginBottom: '0.5rem' }}>Arisu ofrece herramientas avanzadas para mantener tu servidor organizado y protegido. Incluye sistemas de moderación con registros automáticos, alertas y control de actividad.</p>
                <p style={{ marginBottom: '0.5rem' }}>En cuanto a seguridad, integra protección antiraid, filtros configurables de palabras y enlaces para prevenir spam, y sistemas de verificación para nuevos usuarios.</p>
                <p>Puedes elegir entre distintos métodos, como resolver una operación matemática simple o confirmar su identidad mediante su nombre de usuario.</p>
              </AccordionItem>

              <AccordionItem title="Diversión y Gacha" isOpen={openAccordion === 2} onClick={() => setOpenAccordion(openAccordion === 2 ? null : 2)}>
                <p style={{ marginBottom: '0.5rem' }}>Para mantener activa a tu comunidad, Arisu incluye múltiples opciones de entretenimiento. Cuenta con juegos interactivos, acciones sociales y un sistema de confesiones anónimas.</p>
                <p style={{ marginBottom: '0.5rem' }}>También incorpora un sistema de gacha conectado directamente con la economía y los minijuegos.</p>
                <p>Este puede funcionar tanto a nivel global como local dentro de cada servidor, permitiendo obtener recompensas, coleccionables y contenido especial.</p>
              </AccordionItem>

              <AccordionItem title="Comunidad y Automatización" isOpen={openAccordion === 3} onClick={() => setOpenAccordion(openAccordion === 3 ? null : 3)}>
                <p style={{ marginBottom: '0.5rem' }}>Arisu facilita la gestión diaria del servidor con herramientas orientadas a la comunidad. Incluye sistemas de bienvenida con tarjetas personalizadas y asignación automática de roles.</p>
                <p style={{ marginBottom: '0.5rem' }}>También permite configurar mensajes automáticos, respuestas y reacciones, mensajes programados y "sticky messages" para mantener información importante siempre visible.</p>
                <p>Además, cuenta con un sistema de tickets para soporte, con canales privados, transcripciones automáticas y organización para el equipo de staff.</p>
              </AccordionItem>

              <AccordionItem title="IA Integrada" isOpen={openAccordion === 4} onClick={() => setOpenAccordion(openAccordion === 4 ? null : 4)}>
                <p style={{ marginBottom: '0.5rem' }}>Arisu incorpora un sistema de chat inteligente que permite a los usuarios conversar, resolver dudas y ejecutar comandos de forma más natural.</p>
                <p>La IA está pensada para integrarse dentro del servidor como una herramienta útil y accesible, facilitando la interacción sin necesidad de comandos complejos.</p>
              </AccordionItem>

              <AccordionItem title="Música" isOpen={openAccordion === 5} onClick={() => setOpenAccordion(openAccordion === 5 ? null : 5)}>
                <p>Arisu permite reproducir música mediante enlaces, ofreciendo una forma simple de acompañar la actividad del servidor y crear un ambiente más dinámico.</p>
              </AccordionItem>

              <AccordionItem title="Herramientas Creativas" isOpen={openAccordion === 6} onClick={() => setOpenAccordion(openAccordion === 6 ? null : 6)}>
                <p style={{ marginBottom: '0.5rem' }}>Incluye utilidades para crear contenido visual directamente desde el servidor, como generación de imágenes tipo cita y un sistema de creación de embeds.</p>
                <p>El constructor de embeds está disponible mediante comandos y también desde el panel, donde ofrece opciones más completas de personalización.</p>
              </AccordionItem>

              <AccordionItem title="Canales de Voz Dinámicos" isOpen={openAccordion === 7} onClick={() => setOpenAccordion(openAccordion === 7 ? null : 7)}>
                <p>Arisu permite crear canales de voz temporales que se generan y eliminan automáticamente según la actividad de los usuarios, facilitando la organización de espacios de conversación.</p>
              </AccordionItem>

              <AccordionItem title="Extras" isOpen={openAccordion === 8} onClick={() => setOpenAccordion(openAccordion === 8 ? null : 8)}>
                <p style={{ marginBottom: '0.5rem' }}>Además de todas estas funciones, Arisu incluye herramientas adicionales como:</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '0.5rem' }}>
                  <li>Sistema de giveaways</li>
                  <li>Logs y auditoría detallada del servidor</li>
                  <li>Integraciones entre sistemas para una experiencia más completa</li>
                </ul>
              </AccordionItem>

              <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '0 1rem' }}>
                <p>Arisu está pensada como una solución integral para tu servidor, combinando control, personalización y herramientas de interacción en una experiencia unificada.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;