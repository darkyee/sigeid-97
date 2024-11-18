import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { correo, contrasena } = req.body;

        try {
            // Autenticación del usuario
            // const { data: userData, error: authError } = await supabase.auth.signInWithPassword({
            //     email: correo,
            //     password: contrasena,
            // });

            // if (authError) {
            //     console.error('Error de autenticación:', authError.message);
            //     return res.status(401).json({ message: 'Credenciales de inicio de sesión inválidas' });
            // }

            // console.log('Autenticación exitosa:', userData);

            console.log('Correo a buscar:', correo);

            // Verificar que el usuario esté en la tabla 'Usuario'
            const { data: userRecord, error: userError } = await supabase
                .from("Usuario") // Usa comillas dobles para el nombre de la tabla
                .select('*')
                .eq("correo", correo) // Usa comillas dobles para el nombre de la columna
                .limit(1);  // Solo trae un registro

            if (userError) {
                console.error('Error al buscar usuario:', userError.message);
                return res.status(500).json({ message: 'Error al buscar usuario' });
            }

            if (userRecord.length === 0) {
                console.log('Usuario no encontrado en la tabla Usuario');
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            console.log('Usuario encontrado:', userRecord[0]);

            // Verificar en la tabla 'Administrador'
            const { data: adminData, error: adminError } = await supabase
                .from("Administrador") // Usa comillas dobles
                .select('*')
                .eq("usuario", correo) // Usa comillas dobles
                .limit(1);

            if (adminError) {
                console.error('Error al buscar en Administrador:', adminError.message);
                return res.status(500).json({ message: 'Error interno' });
            }

            if (adminData.length > 0) {
                console.log('Redirigiendo a Administrador:', adminData[0]);
                return res.status(200).json({ redirect: '/administrador/PrincipalAdministrador' });
            }

            // Verificar en la tabla 'Profesor'
            const { data: professorData, error: professorError } = await supabase
                .from("Profesor") // Usa comillas dobles
                .select('*')
                .eq("usuario", correo) // Usa comillas dobles
                .limit(1);

            if (professorError) {
                console.error('Error al buscar en Profesor:', professorError.message);
                return res.status(500).json({ message: 'Error interno' });
            }

            if (professorData.length > 0) {
                console.log('Redirigiendo a Profesor:', professorData[0]);
                return res.status(200).json({ redirect: '/profesores/PrincipalProfesores' });
            }

            // Verificar en la tabla 'Estudiante'
            const { data: studentData, error: studentError } = await supabase
                .from("Estudiante") // Usa comillas dobles
                .select('*')
                .eq("usuario", correo) // Usa comillas dobles
                .limit(1);

            if (studentError) {
                console.error('Error al buscar en Estudiante:', studentError.message);
                return res.status(500).json({ message: 'Error interno' });
            }

            if (studentData.length > 0) {
                console.log('Redirigiendo a Estudiante:', studentData[0]);
                return res.status(200).json({ redirect: '/estudiantes/PrincipalEstudiantes' });
            }

            console.log('Usuario no encontrado en ninguna categoría');
            return res.status(404).json({ message: 'Usuario no encontrado en ninguna categoría' });

        } catch (error) {
            console.error('Error interno:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // Si no es POST, devuelve un error 405
    return res.status(405).json({ message: 'Method not allowed' });
}