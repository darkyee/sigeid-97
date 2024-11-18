import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        // Obtiene el reporte segun id junto con la imagen
        const { data, error } = await supabase
            .from('ReporteDesperfecto')
            .select(`*,FotoDesperfecto (foto)`)
            .eq('id_reporte_desperfecto', id)
            .single();

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json(data);
        
    } else if (req.method === 'PATCH') {
        const { estado_reporte, numero_reporte_archivus } = req.body;

        let updateFields = {};
        
        // Agrega segun los datos que se envien 
        if (estado_reporte) updateFields.estado_reporte = estado_reporte;
        if (numero_reporte_archivus) updateFields.numero_reporte_archivus = numero_reporte_archivus;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const { data, error } = await supabase
            .from('ReporteDesperfecto')
            .update(updateFields)
            .eq('id_reporte_desperfecto', id);

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json(data);

    } else if (req.method === 'DELETE') {
        // Borra segun id
        const { data, error } = await supabase
            .from('ReporteDesperfecto')
            .delete()
            .eq('id_reporte_desperfecto', id);

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ message: 'Report deleted successfully', data });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
