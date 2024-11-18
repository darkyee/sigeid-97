import { supabase } from "~/lib/supabase";

export default async function handler(req, res) {

    if (req.method === "GET") {
        try {

            const { data, error } = await supabase
                .from('EstadoReporte')
                .select('*', { count: 'exact' })

            if (error) {
                return res.json({ error: error.message }, { status: 400 });
            }

            // Devolver la respuesta exitosa
            return res.json({ data }, { status: 200 });
        } catch (error) {
            // Devolver respuesta de error
            return res.json({ error: 'Error al procesar la solicitud', message: error }, { status: 500 });
        }
    }
    
}