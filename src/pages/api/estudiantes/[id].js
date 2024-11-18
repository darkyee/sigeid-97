import { supabase } from '@/utils/supabase';

export default async function handler(req, res) {

    const { id } = req.query;


    // PUT: Actualiza un estudiante
    if (req.method === 'PUT') {
        const { nombre } = req.body;

        const { data, error } = await supabase
            .from('Estudiantes')
            .update({ nombre })
            .eq('id', id);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }


    // DELETE: Elimina un estudiante
    if (req.method === 'DELETE') {
        const { error } = await supabase.from('Estudiantes').delete().eq('id', id);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ message: 'Post deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
