import React, { useState } from 'react';

const ContactForm = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/send-discord', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus('Tu solicitud ha sido enviada con éxito. ♡');
                e.target.reset();
            } else {
                setStatus('Hubo un error al enviar tu solicitud. Inténtalo más tarde.');
            }
        } catch (error) {
            setStatus('Error de conexión. Revisa tu internet.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="glass-panel" onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Tu Usuario de Discord</label>
                <input type="text" name="discordUser" placeholder="Ej: ameriria" className="form-input" required />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Nombre e ID del Servidor</label>
                <input type="text" name="serverInfo" placeholder="Ej: Amai Cafe (ID: 123456789)" className="form-input" required />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Enlace de Invitación</label>
                <input type="url" name="inviteLink" placeholder="https://discord.gg/... (Asegúrate de que sea permanente)" className="form-input" required />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>¿Por qué quieres añadir a Arisu?</label>
                <textarea name="reason" placeholder="Cuéntanos un poco sobre tu comunidad..." className="form-input" rows="4" required></textarea>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0' }}>
                Nota: Solo nos pondremos en contacto contigo mediante Discord si tu solicitud es aceptada. ♡
            </p>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>

            {status && (
                <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                    {status}
                </p>
            )}
        </form>
    );
};

export default ContactForm;