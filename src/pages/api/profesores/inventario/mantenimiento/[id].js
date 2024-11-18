import { supabase } from '../../../../../lib/supabase';

export default async function handler(req, res) {
    const { id } = req.query;
    
    // Actualiza la cantidad de un implemento segun el id
    if (req.method === 'PATCH') {

        const { fecha_depreciacion, ultima_fecha_depreciacion, primer_mantenimiento } = req.body;

        const { data, error } = await supabase
            .from('Inventario')
            .update({ fecha_depreciacion, ultima_fecha_depreciacion, primer_mantenimiento })
            .eq('id_implemento', id);

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ message: 'Cantidad updated successfully', data });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
