import { supabase } from '@/utils/supabase';

export default async function handler(req, res) {


    // GET: Obtiene todos los estudiantes
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('Estudiantes').select('*');

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }


    // POST: Crea un nuevo estudiante
    if (req.method === 'POST') {
        const { nombre } = req.body;

        const { data, error } = await supabase
            .from('Estudiantes')
            .insert([{ nombre }]);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
