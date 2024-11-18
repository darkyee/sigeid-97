import { supabase } from '@/utils/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { correo, password } = req.body;

    // 1. Autenticar al usuario con correo y contraseña
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password,
    });

    if (error) return res.status(401).json({ error: error.message });

    // 2. Identificar el tipo de usuario
    const { correo: userEmail } = user.user;

    // Verificar si el usuario es Administrador
    const { data: adminData } = await supabase
      .from('Administrador')
      .select('id_admin')
      .eq('correo_usuario', userEmail)
      .single();

    if (adminData) {
      return res.status(200).json({ message: 'Inicio de sesión exitoso', tipo_usuario: 'administrador', redirectTo: '/dashboard/admin' });
    }

    // Verificar si el usuario es Profesor
    const { data: profData } = await supabase
      .from('Profesor')
      .select('id_profesor')
      .eq('correo_usuario', userEmail)
      .single();

    if (profData) {
      return res.status(200).json({ message: 'Inicio de sesión exitoso', tipo_usuario: 'profesor', redirectTo: '/dashboard/profesor' });
    }

    // Si no es ni Administrador ni Profesor, se asume que es un Estudiante
    return res.status(200).json({ message: 'Inicio de sesión exitoso', tipo_usuario: 'estudiante', redirectTo: '/dashboard/estudiante' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}