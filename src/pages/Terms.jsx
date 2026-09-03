import React, { useState, useEffect, useRef } from 'react';

// Subcomponente para transiciones suaves (idéntico al usado en Commands.jsx / Docs.jsx / Privacy.jsx,
// para que todas las páginas de la doc/legales compartan la misma animación de entrada).
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
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

const SECTIONS = [
  {
    id: 'uso-del-servicio',
    title: '1. Uso del Servicio',
    content: (
      <>
        <p>
          Arisu se proporciona como una herramienta para mejorar la gestión, automatización e interacción dentro de servidores de Discord.
        </p>
        <ul>
          <li>Debes cumplir con los Términos de Servicio y Pautas de la Comunidad de Discord.</li>
          <li>No debes utilizar Arisu para actividades ilegales, abusivas o dañinas.</li>
          <li>No debes interferir ni comprometer el funcionamiento del bot.</li>
        </ul>
      </>
    )
  },
  {
    id: 'uso-indebido',
    title: '2. Uso indebido',
    content: (
      <>
        <p>
          Está prohibido el uso indebido del bot, incluyendo:
        </p>
        <ul>
          <li>Hacer spam o abusar de comandos y sistemas automatizados.</li>
          <li>Explotar errores o vulnerabilidades, especialmente en sistemas de economía.</li>
          <li>Acosar, hostigar o perjudicar a otros usuarios.</li>
          <li>Intentar acceder a datos o sistemas sin autorización.</li>
        </ul>
        <p>
          Nos reservamos el derecho de limitar o bloquear el acceso al bot en caso de incumplimiento.
        </p>
      </>
    )
  },
  {
    id: 'economia-virtual',
    title: '3. Economía Virtual',
    content: (
      <>
        <p>
          Arisu incluye sistemas de economía virtual, como monedas y objetos digitales.
        </p>
        <ul>
          <li>Estos elementos no tienen valor real ni pueden intercambiarse por dinero.</li>
          <li>Los saldos y objetos pueden modificarse, reiniciarse o eliminarse en caso de errores, exploits o actualizaciones.</li>
          <li>No se garantiza la permanencia del progreso.</li>
        </ul>
      </>
    )
  },
  {
    id: 'suscripciones-y-reembolsos',
    title: '4. Suscripciones y Reembolsos',
    content: (
      <>
        <p>
          Arisu ofrece características adicionales y límites ampliados mediante servicios de pago, estructurados en dos niveles de suscripción: <strong>Sweet</strong> y <strong>Nectar</strong>.
        </p>
        <ul>
          <li><strong>Naturaleza digital:</strong> Debido a que los niveles Sweet y Nectar otorgan acceso a bienes y ventajas digitales, todas las compras son definitivas. No se ofrecen reembolsos una vez que el pago ha sido procesado.</li>
          <li><strong>Cancelaciones:</strong> Puedes cancelar tu suscripción en cualquier momento. Seguirás teniendo acceso a los beneficios de tu nivel hasta que finalice tu ciclo de facturación actual.</li>
          <li><strong>Excepciones:</strong> Solo se considerarán reembolsos a nuestra total discreción en circunstancias muy excepcionales (por ejemplo, cobros duplicados por error del sistema).</li>
          <li><strong>Modificaciones:</strong> Nos reservamos el derecho de ajustar el precio o las características incluidas en los niveles Sweet y Nectar en cualquier momento, lo cual será notificado previamente.</li>
        </ul>
      </>
    )
  },
  {
    id: 'ia-y-desarrollo',
    title: '5. Uso de IA y Desarrollo',
    content: (
      <>
        <p>
          Arisu incluye funciones de inteligencia artificial que permiten generar respuestas y mantener conversaciones. Adicionalmente, el bot en sí ha sido construido utilizando estas tecnologías.
        </p>
        <ul>
          <li><strong>Desarrollo asistido:</strong> Al utilizar Arisu, comprendes y aceptas que su código base, estructura y algunas de sus funciones han sido programadas con la asistencia de Inteligencia Artificial.</li>
          <li><strong>Responsabilidad del usuario:</strong> Eres responsable del contenido que envías y generas mediante las funciones de IA.</li>
          <li><strong>Restricciones de uso:</strong> No debes utilizar la IA para generar contenido que viole las normas de Discord o las leyes aplicables.</li>
          <li><strong>Precaución con los resultados:</strong> Las respuestas generadas por la IA pueden ser inexactas, inesperadas o no deseadas.</li>
        </ul>
      </>
    )
  },
  {
    id: 'disponibilidad',
    title: '6. Disponibilidad',
    content: (
      <>
        <p>
          Arisu se proporciona "tal cual" y no garantiza disponibilidad continua. El servicio puede interrumpirse por mantenimiento, actualizaciones o fallos técnicos.
        </p>
        <p>
          No somos responsables por interrupciones, pérdida de datos o configuraciones durante estos periodos.
        </p>
      </>
    )
  },
  {
    id: 'responsabilidad',
    title: '7. Responsabilidad',
    content: (
      <>
        <p>
          El uso del bot es bajo tu propio riesgo. No nos hacemos responsables por daños directos o indirectos derivados del uso de Arisu.
        </p>
        <p>
          Eres responsable de cómo utilizas y configuras el bot en tu servidor.
        </p>
      </>
    )
  },
  {
    id: 'edad-minima',
    title: '8. Edad mínima',
    content: (
      <>
        <p>
          Debes cumplir con la edad mínima requerida por Discord en tu país (generalmente 13 años) para utilizar Arisu.
        </p>
        <p>
          Al usar el bot, confirmas que cumples con este requisito.
        </p>
      </>
    )
  },
  {
    id: 'cambios-en-el-servicio',
    title: '9. Cambios en el Servicio',
    content: (
      <p>
        Arisu puede añadir, modificar o eliminar funciones en cualquier momento, incluyendo cambios en sistemas existentes.
      </p>
    )
  },
  {
    id: 'cambios-en-los-terminos',
    title: '10. Cambios en los Términos',
    content: (
      <p>
        Estos términos pueden actualizarse en cualquier momento. El uso continuado del bot implica la aceptación de los cambios.
      </p>
    )
  }
];

const Terms = () => {
  return (
    <div className="container terms-container">
      <div className="terms-content">
        <FadeInSection>
          <h1 id="terminos-de-servicio"><a href="#terminos-de-servicio" className="hash-anchor">#</a>Términos de Servicio</h1>
          <span className="last-updated">Última actualización: {new Date().toLocaleDateString('es-ES')}</span>

          <p>
            Al invitar y utilizar Arisu en tu servidor de Discord, aceptas los siguientes Términos de Servicio. Si no estás de acuerdo con alguno de estos términos, no debes utilizar el bot.
          </p>
        </FadeInSection>

        {SECTIONS.map((section, index) => (
          <FadeInSection key={section.id} delay={Math.min(index * 0.08, 0.4)}>
            <h2 id={section.id}><a href={`#${section.id}`} className="hash-anchor">#</a>{section.title}</h2>
            {section.content}
          </FadeInSection>
        ))}
      </div>
    </div>
  );
};

export default Terms;