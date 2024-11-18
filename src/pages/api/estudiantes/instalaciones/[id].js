import { supabase } from "~/lib/supabase";

export default async function handler(req, res) {

    const { id } = req.query;

    if (req.method === "GET") {
        try {

            let { data, error } = await supabase
                .from('InstalacionDeportiva')
                .select('*', { count: 'exact' })
                .eq('id_instalacion_deportiva', id)
                .single()

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(200).json({ data });
        } catch (error) {
            return res.status(500).json({ error: 'Error al procesar la solicitud', message: error });
        }
    }

    else if (req.method === "PUT") {
        try {
            const { nombre, descripcion, photo: foto, presta: se_presta, disponibilidad_horario } = req.body;

            let { data, error } = await supabase
                .from('InstalacionDeportiva')
                .update({
                    nombre,
                    foto,
                    descripcion,
                    se_presta,
                    disponibilidad_horario,
                })
                .eq('id_instalacion_deportiva', id)

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(200).json({ data });
        } catch (error) {
            return res.status(500).json({ error: 'Error al procesar la solicitud', message: error });
        }
    }

    else if (req.method === "DELETE") {
        try {

            let { data, error } = await supabase
                .from('InstalacionDeportiva')
                .delete()
                .eq('id_instalacion_deportiva', id)

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(200).json({ data });
        } catch (error) {
            return res.status(500).json({ error: 'Error al procesar la solicitud', message: error });
        }
    }

}