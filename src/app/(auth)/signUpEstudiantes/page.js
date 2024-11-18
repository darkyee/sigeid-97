"use client"; // Indica que este componente es un Client Component

import { useState } from 'react';
import './styles.css'; // Importa estilos


export default function Signup() {
  // Declarar el estado para cada campo
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombre, setNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [carnet, setCarnet] = useState("");
  const [numeroCedula, setNumeroCedula] = useState("");
  const [numeroCelular, setNumeroCelular] = useState("");
  const [carrera, setCarrera] = useState("");
  const [error, setError] = useState(""); // Declaración del estado de error
  const [success, setSuccess] = useState(""); // Estado para manejar éxito

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos
    setSuccess(""); // Limpiar mensajes de éxito previos

    try {
      const res = await fetch('/api/estudiantes/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo,
          contrasena,
          nombre,
          primerApellido,
          segundoApellido,
          carnet,
          numeroCedula,
          numeroCelular,
          carrera
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Hubo un error en el registro');
      }

      setSuccess('Registro exitoso');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Registro de Estudiante</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="correo">Correo electrónico:</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contrasena">Contraseña:</label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="primerApellido">Primer Apellido:</label>
          <input
            type="text"
            id="primerApellido"
            value={primerApellido}
            onChange={(e) => setPrimerApellido(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="segundoApellido">Segundo Apellido:</label>
          <input
            type="text"
            id="segundoApellido"
            value={segundoApellido}
            onChange={(e) => setSegundoApellido(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="carnet">Carnet:</label>
          <input
            type="number"
            id="carnet"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="numeroCedula">Número de Cédula:</label>
          <input
            type="number"
            id="numeroCedula"
            value={numeroCedula}
            onChange={(e) => setNumeroCedula(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="numeroCelular">Número de Celular:</label>
          <input
            type="number"
            id="numeroCelular"
            value={numeroCelular}
            onChange={(e) => setNumeroCelular(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="carrera">Carrera:</label>
          <input
            type="text"
            id="carrera"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}