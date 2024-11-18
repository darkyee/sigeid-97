import { supabase } from '../../../../../lib/supabase';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const body = req.body;

            const { descripcion, cantidad, fecha_adquisicion, fecha_depreciacion, area, photos, agregado_por } = body;

            // Agrega el implemento
            const { data, error } = await supabase
                .from('Inventario')
                .insert({
                    descripcion,
                    cantidad,
                    fecha_adquisicion,
                    fecha_depreciacion,
                    area,
                    agregado_por
                })
                .select()
                .single();

            if (error) {
                console.log(error);
                return res.status(400).json({ error: error.message });
            }

            // Agrega las fotos
            if (photos && photos.length > 0) {
                photos.forEach(async (foto) => {
                    await supabase.from('FotoInventario').insert({
                        id_implemento: data.id_implemento,
                        foto
                    });
                });
            }

            return res.status(200).json({ data: 'ok' });
        } catch (error) {
            return res.status(500).json({ error: 'Error al procesar la solicitud', message: error });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
