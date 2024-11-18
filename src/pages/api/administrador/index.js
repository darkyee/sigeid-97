import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('ReporteDesperfecto')
            .select(`*`);

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json(data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
