import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { correo, contrasena, nombre, primerApellido, segundoApellido, area } = req.body;

        try {
            // Verificar si el correo ya existe
            const { data: existingUser, error: fetchError } = await supabase
                .from("Usuario")
                .select('*')
                .eq("correo", correo)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') throw new Error(fetchError.message);
            if (existingUser) {
                return res.status(409).json({ message: 'El correo ya está registrado.' });
            }

            // Registro en Supabase Auth
            const { user, error: authError } = await supabase.auth.signUp({
                email: correo,
                password: contrasena,
            });

            if (authError) throw new Error(authError.message);

            // Inserción en la tabla 'Usuario'
            const { error: userError } = await supabase
                .from('Usuario')
                .insert([{
                    correo,
                    nombre,
                    primer_apellido: primerApellido,
                    segundo_apellido: segundoApellido,
                    contraseña: contrasena,
                }]);

            if (userError) throw new Error(userError.message);

            // Inserción en la tabla 'Profesor'
            const { error: professorError } = await supabase
                .from('Profesor')
                .insert([{
                    usuario: correo,
                    area: area || null,
                }]);

            if (professorError) throw new Error(professorError.message);

            // Respuesta exitosa
            return res.status(201).json({ message: 'Profesor registrado exitosamente' });

        } catch (error) {
            console.error(error); // Muestra el error en la consola para depuración
            return res.status(500).json({ error: error.message });
        }
    }

    // Si no es POST, devuelve un error 405
    return res.status(405).json({ message: 'Method not allowed' });
}
