export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { discordUser, serverInfo, inviteLink, reason } = req.body;

    const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

    const discordPayload = {
        embeds: [{
            title: "Nueva Solicitud de Beta ♡",
            color: 0xFDC2D5,
            fields: [
                { name: "Usuario de Discord", value: discordUser },
                { name: "Servidor e ID", value: serverInfo },
                { name: "Enlace de Invitación", value: inviteLink },
                { name: "Motivo", value: reason }
            ],
            footer: { text: "Sistema Web Arisu ♡" },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload)
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: 'Discord API error' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}