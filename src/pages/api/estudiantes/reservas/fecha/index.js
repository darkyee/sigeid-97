import { supabase } from "~/lib/supabase";

export default async function handler(req, res) {

    if (req.method === "GET") {
        try {
            let { data, error } = await supabase
                .from('InstalacionDeportiva')
                .select('*', { count: 'exact' })
                .eq('se_presta', true)
                .not('disponibilidad_horario', 'is', null)

            if (error) {
                return res.json({ error: error.message }, { status: 400 });
            }

            return res.json({ data }, { status: 200 }); // Devolver la respuesta exitosa
        } catch (error) {
            return res.json({ error: 'Error al procesar la solicitud', message: error }, { status: 500 });
        }
    }

    else if (req.method === "POST") {
        try {

            const { date } = req.body

            console.log('Date', date)

            // // Agrega la reserva
            // let { data, error } = await supabase
            // .from('SolicitudReserva')
            //     .insert({
            //         fecha_solicitud,
            //         carnet_participante: '',
            //         solicitante,
            //         instalacion_deportiva,
            //         fecha_inicio_reserva,
            //         fecha_fin_reserva,
            //     })

            // if (error) {
            //     return res.json({ error: error.message }, { status: 400 });
            // }

            return res.json({ data: 'ok' }, { status: 200 }); // Devolver la respuesta exitosa
        } catch (error) {
            console.log(error)
            return res.json({ error: 'Error al procesar la solicitud', message: error }, { status: 500 }); // Devolver respuesta de error
        }
    }

}