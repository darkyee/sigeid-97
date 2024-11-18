import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { correo, contrasena, nombre, primerApellido, segundoApellido, carnet, numeroCedula, numeroCelular, carrera } = req.body;

        try {
            // Registro de usuario en supabase auth
            const { user, error: authError } = await supabase.auth.signUp({
                email: correo,
                password: contrasena,
            });

            if (authError) throw new Error(authError.message);

            // Inserción en la tabla 'usuario'
            const { error: userError } = await supabase
                .from('Usuario')
                .insert([
                    {
                        correo,
                        nombre,
                        primer_apellido: primerApellido,
                        segundo_apellido: segundoApellido,
                        contraseña: contrasena, // Nota: deberíamos encriptar esto
                    }
                ]);

            if (userError) throw new Error(userError.message);

            // Inserción en la tabla 'Estudiante' con los campos adicionales
            const { error: studentError } = await supabase
                .from('Estudiante')
                .insert([
                    {
                        usuario: correo, // FK a 'usuario'
                        carnet,
                        numero_cedula: numeroCedula,
                        numero_celular: numeroCelular,
                        carrera
                    }
                ]);

            if (studentError) throw new Error(studentError.message);

            // Respuesta exitosa
            return res.status(201).json({ message: 'Estudiante registrado exitosamente' });

        } catch (error) {
            console.error(error);  // Imprimir el error en la consola
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}