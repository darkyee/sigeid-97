import { supabase } from "~/lib/supabase";

export default async function handler(req, res) {

    if (req.method === "POST") {
        try {
            const { email } = req.body;

            console.log('email es', email)

            const { data, error } = await supabase
                .from('SolicitudReserva')
                .select('*, instalacion_deportiva:InstalacionDeportiva("*"), estado_solicitud:EstadoSolicitud("*")')
                .eq('solicitante', email)

            console.log(error)

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ data });

        } catch (error) {
            console.error('Error al procesar la reserva:', error);
            return res.status(500).json({
                error: 'Error al procesar la solicitud',
                details: error.message
            });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}