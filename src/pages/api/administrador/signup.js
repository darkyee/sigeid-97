import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { correo, contrasena, nombre, primerApellido, segundoApellido } = req.body;

        try {
            // Registro en Supabase Auth
            const { user, error: authError } = await supabase.auth.signUp({
                email: correo,
                password: contrasena,
            });

            if (authError) throw new Error(authError.message);

            // Inserción en la tabla 'Usuario'
            const { error: userError } = await supabase
                .from('Usuario')
                .insert([
                    {
                        correo,
                        nombre,
                        primer_apellido: primerApellido,
                        segundo_apellido: segundoApellido,
                        contraseña: contrasena, // Nota: Idealmente encriptar
                    }
                ]);

            if (userError) throw new Error(userError.message);

            // Inserción en la tabla 'Administrador'
            const { error: adminError } = await supabase
                .from('Administrador')
                .insert([
                    {
                        usuario: correo, // FK hacia la tabla Usuario
                    }
                ]);

            if (adminError) throw new Error(adminError.message);

            // Respuesta exitosa
            return res.status(201).json({ message: 'Administrador registrado exitosamente' });

        } catch (error) {
            console.error(error); // Muestra el error en la consola para depuración
            return res.status(500).json({ error: error.message });
        }
    }

    // Si no es POST, devuelve un error 405
    return res.status(405).json({ message: 'Method not allowed' });
}