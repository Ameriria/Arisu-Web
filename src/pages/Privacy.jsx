import React, { useState, useEffect, useRef } from 'react';

// Subcomponente para transiciones suaves (idéntico al usado en Commands.jsx / Docs.jsx,
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
    id: 'informacion-recopilada',
    title: '1. Información recopilada',
    content: (
      <>
        <p>Solo guardamos los datos estrictamente necesarios. Esto incluye:</p>
        <ul>
          <li><strong>Datos de Discord:</strong> ID de usuario, ID de servidor, IDs de canales y roles.</li>
          <li><strong>Configuraciones:</strong> Preferencias y configuraciones del servidor asociadas a Arisu.</li>
          <li><strong>Progresión:</strong> Datos de economía, inventarios y experiencia dentro del bot.</li>
          <li><strong>Interacciones:</strong> Registro de comandos ejecutados y logs de errores para mantenimiento.</li>
        </ul>
      </>
    )
  },
  {
    id: 'uso-de-la-informacion',
    title: '2. Uso de la información',
    content: (
      <ul>
        <li>Proporcionar, mantener y mejorar las funciones del bot.</li>
        <li>Gestionar sistemas como economía, moderación y automatización.</li>
        <li>Personalizar la experiencia del usuario.</li>
        <li>Prevenir abusos, spam o uso indebido de los sistemas.</li>
      </ul>
    )
  },
  {
    id: 'contenido-de-mensajes',
    title: '3. Contenido de mensajes',
    content: (
      <>
        <p>
          Arisu no lee ni almacena todos los mensajes de tu servidor de forma pasiva. El contenido de los mensajes solo es procesado cuando interactúas directamente con el bot (por ejemplo, mencionándolo, usando funciones de IA o sistemas interactivos como confesiones).
        </p>
        <p>
          Este contenido no se almacena permanentemente en nuestras bases de datos, salvo que la funcionalidad lo requiera explícitamente y haya sido configurado de esa manera por los administradores del servidor.
        </p>
      </>
    )
  },
  {
    id: 'servicios-de-terceros-y-ia',
    title: '4. Servicios de Terceros y APIs de IA',
    content: (
      <>
        <p>
          Para proporcionar respuestas avanzadas de inteligencia artificial, Arisu puede enviar temporalmente fragmentos de texto (como tus prompts o preguntas) a proveedores de API de terceros.
        </p>
        <p>
          Estos datos se envían de forma segura únicamente con el propósito de generar una respuesta. Estos proveedores externos están sujetos a sus propias políticas de privacidad y, por norma general, no utilizan los datos de nuestra API para entrenar sus modelos públicos.
        </p>
      </>
    )
  },
  {
    id: 'retencion-de-datos',
    title: '5. Retención de datos',
    content: (
      <p>
        Los datos se conservan mientras sean necesarios para el funcionamiento del bot. Cuando Arisu es expulsado de un servidor, la configuración asociada y los datos específicos de ese servidor se programan para su eliminación, aunque algunos datos encriptados pueden persistir temporalmente en copias de seguridad (backups) por motivos de integridad técnica.
      </p>
    )
  },
  {
    id: 'comparticion-de-datos',
    title: '6. Compartición de datos',
    content: (
      <p>
        <strong>No vendemos, alquilamos ni monetizamos tus datos personales de ninguna manera.</strong> Solo compartiremos información con autoridades si es estrictamente requerido por ley, por una orden judicial, o para proteger los derechos y la seguridad de nuestros usuarios.
      </p>
    )
  },
  {
    id: 'derechos-del-usuario',
    title: '7. Tus derechos sobre tus datos',
    content: (
      <p>
        Como usuario, tienes derecho a solicitar un reporte de los datos que Arisu tiene asociados a tu ID de Discord. Asimismo, puedes solicitar la eliminación completa de tus datos de nuestra base de datos en cualquier momento (ten en cuenta que esto reiniciará de forma irreversible tu progreso en economía y otros sistemas globales).
      </p>
    )
  },
  {
    id: 'privacidad-de-menores',
    title: '8. Privacidad de menores',
    content: (
      <p>
        En concordancia con los Términos de Servicio de Discord, Arisu no está dirigido a menores de 13 años (o la edad mínima legal aplicable en tu país de residencia). No recopilamos intencionalmente información de menores. Si descubrimos que poseemos datos de un menor sin el consentimiento verificable, procederemos a eliminarlos inmediatamente.
      </p>
    )
  },
  {
    id: 'seguridad',
    title: '9. Seguridad',
    content: (
      <p>
        Aplicamos medidas de seguridad técnicas razonables para proteger la información almacenada. Sin embargo, ningún sistema en internet es 100% seguro, por lo que no podemos garantizar una seguridad absoluta frente a accesos no autorizados o vulnerabilidades imprevistas.
      </p>
    )
  },
  {
    id: 'cambios-en-la-politica',
    title: '10. Cambios en la Política',
    content: (
      <p>
        Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Te notificaremos sobre cambios significativos a través de nuestro servidor de soporte o mediante anuncios dentro de Discord. El uso continuado de Arisu después de dichos cambios implica tu aceptación de la versión actualizada.
      </p>
    )
  },
  {
    id: 'contacto',
    title: '11. Contacto',
    content: (
      <p>
        Si tienes dudas, preocupaciones o deseas ejercer tus derechos de eliminación de datos, por favor contáctanos abriendo un ticket de atención en nuestro servidor de soporte oficial de Discord.
      </p>
    )
  }
];

const PrivacyPolicy = () => {
  return (
    <div className="container terms-container">
      <div className="terms-content">
        <FadeInSection>
          <h1 id="politica-de-privacidad"><a href="#politica-de-privacidad" className="hash-anchor">#</a>Política de Privacidad</h1>
          <span className="last-updated">Última actualización: {new Date().toLocaleDateString('es-ES')}</span>

          <p>
            Arisu recopila y utiliza únicamente la información necesaria para su funcionamiento y para ofrecerte la mejor experiencia posible en tu servidor de Discord. Al utilizar el bot, aceptas las prácticas descritas en esta política.
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

export default PrivacyPolicy;