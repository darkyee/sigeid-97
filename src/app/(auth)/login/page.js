"use client"; // Asegura que el componente sea cliente

import React, { useState } from 'react'; // Importa useState
import Head from 'next/head';
import './styles.css'; // Ajusta la ruta según sea necesario
import { supabase } from '~/lib/supabase';

const LoginPage = () => {
    // const [correo, setCorreo] = useState('profesor@mail.com'); // Estado para correo
    // const [contrasena, setContrasena] = useState('profesor123'); // Estado para contraseña
    const [correo, setCorreo] = useState('admin@mail.com'); // Estado para correo
    const [contrasena, setContrasena] = useState('admin123'); // Estado para contraseña
    // const [correo, setCorreo] = useState('estudiante@mail.com'); // Estado para correo
    // const [contrasena, setContrasena] = useState('estudiante123'); // Estado para contraseña

    const handleProfesorRedirect = () => {
        // Redirige a la página de profesores
        window.location.href = '/signUpProfesores';
    };

    const handleSignupRedirect = () => {
        // Redirige a la página de estudiantes
        window.location.href = '/signUpEstudiantes';
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto

        const correo = e.target[0].value; // Obtener el correo
        const contrasena = e.target[1].value; // Obtener la contraseña
        console.log('Correo enviado:', correo);

        // Autenticación del usuario
        const { data: userData, error: authError } = await supabase.auth.signInWithPassword({
            email: correo,
            password: contrasena,
        });

        if (authError) {
            console.error('Error de autenticación:', authError.message);
            return res.status(401).json({ message: 'Credenciales de inicio de sesión inválidas' });
        }

        console.log('Autenticación exitosa:', userData);

        const response = await fetch('/api/autenticacion/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, contrasena }),
        });

        
        if (response.ok) {
            const data = await response.json(); // Obtener el objeto JSON
            window.location.href = data.redirect; // Redirigir a la URL obtenida
        } else {
            const data = await response.json(); // Parsear la respuesta JSON
            console.error(data.message || data.error); // Muestra el mensaje de error
            alert(data.message || data.error); // Muestra un alert al usuario
        }
    };

    return (
        <>
            <Head>
                <title>Popup Login Form Design | CodingNepal</title>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
                />
            </Head>
            <div className="center">
                <div className="container">
                    <label className="close-btn fas fa-times" title="close"></label>
                    <div className="text">Login</div>
                    <form onSubmit={handleSubmit}>
                        <div className="data">
                            <label>Correo Electronico</label>
                            <input 
                                type="text" 
                                required 
                                value={correo} 
                                onChange={(e) => setCorreo(e.target.value)} // Captura el correo
                            />
                        </div>
                        <div className="data">
                            <label>Contraseña</label>
                            <input 
                                type="password" 
                                required 
                                value={contrasena} 
                                onChange={(e) => setContrasena(e.target.value)} // Captura la contraseña
                            />
                        </div>
                        <div className="forgot-pass">
                            <a href="#">Forgot Password?</a>
                        </div>
                        <div className="btn">
                            <div className="inner"></div>
                            <button type="submit">Login</button>
                        </div>
                        <div className="signup-link">
                            No eres miembro?  
                            <button
                                type="button"
                                onClick={handleSignupRedirect}
                                style={{ border: 'none', background: 'none', color: 'blue', cursor: 'pointer' }}
                            >
                                Regístrate aquí
                            </button>
                        </div>
                        <div className="signup-link">
                            Deseas registrarte como profesor?  
                            <button
                                type="button"
                                onClick={handleProfesorRedirect}
                                style={{ border: 'none', background: 'none', color: 'blue', cursor: 'pointer' }}
                            >
                                Haz clic aquí
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;