import { supabase } from "~/lib/supabase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const {
                fecha_solicitud,
                participantes,
                solicitante,
                instalacion_deportiva,
                fecha_inicio_reserva,
                fecha_fin_reserva
            } = req.body;

            // Verificar si ya existe una reserva para esa instalación en ese horario
            const { data: existingReservation, error: checkError } = await supabase
                .from('SolicitudReserva')
                .select('*')
                .eq('instalacion_deportiva', instalacion_deportiva)
                .gte('fecha_fin_reserva', fecha_inicio_reserva)
                .lte('fecha_inicio_reserva', fecha_fin_reserva);

            if (checkError) {
                return res.status(500).json({ error: checkError.message });
            }

            if (existingReservation && existingReservation.length > 0) {
                return res.status(400).json({
                    error: 'Ya existe una reserva para este horario'
                });
            }

            // Crear el estado de solicitud (false = pendiente)
            const { data: estadoData, error: estadoError } = await supabase
                .from('EstadoSolicitud')
                .insert({
                    estado: false
                })
                .select()
                .single();

            if (estadoError) {
                return res.status(500).json({ error: estadoError.message });
            }

            // Crear la reserva con el estado_solicitud creado
            const { data: reserva, error: reservaError } = await supabase
                .from('SolicitudReserva')
                .insert({
                    fecha_solicitud,
                    solicitante,
                    instalacion_deportiva,
                    fecha_inicio_reserva,
                    fecha_fin_reserva,
                    estado_solicitud: estadoData.id_estado_solicitud,
                    carnet_participante: participantes[0]?.numero_carnet
                })
                .select()
                .single();

            if (reservaError) {
                return res.status(500).json({ error: reservaError.message });
            }

            // Registrar los participantes
            for (const participante of participantes) {
                const { error: participanteError } = await supabase
                    .from('Participante')
                    .upsert({
                        numero_carnet: participante.numero_carnet,
                        nombre: participante.nombre
                    });

                if (participanteError) {
                    console.error('Error al registrar participante:', participanteError);
                    continue;
                }

                // Asociar participante con la reserva
                const { error: participacionError } = await supabase
                    .from('ParticipanteReserva')
                    .insert({
                        id_solicitud_reserva: reserva.id_solicitud_reserva,
                        carnet_participante: participante.numero_carnet
                    });

                if (participacionError) {
                    console.error('Error al asociar participante:', participacionError);
                }
            }

            return res.status(200).json({
                message: 'Reserva creada exitosamente',
                data: reserva
            });

        } catch (error) {
            console.error('Error al procesar la reserva:', error);
            return res.status(500).json({
                error: 'Error al procesar la solicitud',
                details: error.message
            });
        }
    }

    if (req.method === "GET") {
        try {
            const { data, error } = await supabase
                .from('InstalacionDeportiva')
                .select('*')
                .eq('se_presta', true)
                .not('disponibilidad_horario', 'is', null);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(200).json({ data });
        } catch (error) {
            return res.status(500).json({
                error: 'Error al obtener las instalaciones',
                details: error.message
            });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}