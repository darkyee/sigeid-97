import { supabase } from "~/lib/supabase";

export default async function handler(req, res) {

    if (req.method === "POST") {
        try {

            const { carnet } = req.body

            let { data, error } = await supabase
                .from('Participante')
                .select('*', { count: 'exact' })
                .eq('numero_carnet', carnet)
                .single()

            if (data === null) {
                return res.json({
                    data: {
                        numero_carnet: carnet,
                        nombre: '',
                        primer_apellido: '',
                        segundo_apellido: ''
                    }
                }, { status: 200 }); // Devolver la respuesta exitosa
            }

            if (error) {
                return res.json({ error: error.message }, { status: 400 });
            }

            return res.json({ data }, { status: 200 }); // Devolver la respuesta exitosa
        } catch (error) {
            return res.json({ error: 'Error al procesar la solicitud', message: error }, { status: 500 });
        }
    }

}