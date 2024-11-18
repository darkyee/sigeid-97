import { supabase } from '../../../../lib/supabase';

export default async function handler(req, res) {
    const { id } = req.query;

    // Obtione todos los implementos
    if (req.method === 'GET') {

        let data, error;

        if (id == 0){
            ({ data, error } = await supabase
                .from('Inventario')
                .select(`*, FotoInventario (foto)`));
        }else {
            ({ data, error } = await supabase
                .from('Inventario')
                .select(`*, FotoInventario (foto)`)
                .eq('id_implemento', id)
                .single());
        }
        
        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json(data);
    }
    
    // Actualiza la cantidad de un implemento segun el id
    if (req.method === 'PATCH') {
        const { cantidad } = req.body;

        // revisa que se de la cantidad y el id
        if (!id || cantidad === undefined) {
            return res.status(400).json({ message: 'ID and cantidad are required' });
        }

        const { data, error } = await supabase
            .from('Inventario')
            .update({ cantidad })
            .eq('id_implemento', id);

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ message: 'Cantidad updated successfully', data });
    }

    // Borra un implemento segun el id
    if (req.method === 'DELETE') {

        // revisa que exista el id
        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        const { data, error } = await supabase
            .from('Inventario')
            .delete()
            .eq('id_implemento', id);

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ message: 'Item deleted successfully', data });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
