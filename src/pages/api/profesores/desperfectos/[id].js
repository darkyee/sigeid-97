import { supabase } from "~/lib/supabase";

export default async function handler(req, res) {

    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const { data, error } = await supabase
                .from('ReporteDesperfecto')
                .select('*', { count: 'exact' })
                .eq('instalacion_afectada', id)

            if (error) {
                console.log(error)
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