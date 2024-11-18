import { supabase } from '@/utils/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { correo, password, nombre, primerApellido, segundoApellido } = req.body;

    // Crear un nuevo usuario en Supabase
    const { user, error: signupError } = await supabase.auth.signUp({
      email: correo,
      password: password,
    });

    if (signupError) {
      return res.status(400).json({ error: signupError.message });
    }

    // Insertar el nuevo usuario en la tabla 'Usuarios'
    const { error: usuarioError } = await supabase
      .from('Usuarios')
      .insert([{ correo, nombre, primer_apellido: primerApellido, segundo_apellido: segundoApellido }]);

    if (usuarioError) {
      return res.status(400).json({ error: usuarioError.message });
    }

    // Insertar en la tabla 'Administradores' asociando el usuario
    const { error: adminError } = await supabase
      .from('Administradores')
      .insert([{ usuario: correo }]); // Asumiendo que 'usuario' es la FK hacia 'correo'

    if (adminError) {
      return res.status(400).json({ error: adminError.message });
    }

    return res.status(201).json({ message: 'Administrador registrado exitosamente', user });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}