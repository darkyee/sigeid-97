import React, { useState } from 'react';

const ParticipantSelector = ({ onChange }) => {
    // Estado para almacenar la lista de participantes
    const [participants, setParticipants] = useState([]);
    const [carnet, setCarnet] = useState('');

    // Función para agregar un nuevo participante a la lista
    const agregarParticipante = () => {
        if (carnet.trim() && (carnet.trim().length >= 10 && carnet.trim().length <= 12 )) {
            fetch('/api/estudiantes/participantes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ carnet: carnet.trim() }),
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response.data)

                    const updatedParticipants = [...participants, {
                        numero_carnet: response.data.numero_carnet,
                        nombre: response.data.nombre
                    }]

                    setParticipants(updatedParticipants);
                    onChange(updatedParticipants)

                    setCarnet('')
                })
        } else {
            alert('El carnet debe tener entre 10 y 12 dígitos')
        }
    };

    // Función para actualizar el nombre en línea
    const actualizarParticipante = (index, newName) => {
        const updatedParticipants = participants.map((participant, i) =>
            i === index ? { ...participant, nombre: newName } : participant
        );
        setParticipants(updatedParticipants);
        onChange(updatedParticipants)
    };

    // Función para eliminar un participante
    const eliminarParticipante = (index) => {
        const updatedParticipants = participants.filter((_, i) => i !== index);
        setParticipants(updatedParticipants);
        onChange(updatedParticipants)
    };

    return (
        <div className="container">

            <div className='row'>
                <div className='col col-12'>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ingrese el carnet"
                            value={carnet}
                            onChange={(e) => setCarnet(e.target.value)}
                        />
                        <button className="btn btn-primary" type="button" onClick={(e) => agregarParticipante()}>Agregar Participante</button>
                    </div>
                </div>
            </div>

            <h4>Lista de Participantes</h4>
            <ul className="list-group">
                {participants.map((participant, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            <strong>{participant.numero_carnet}</strong>
                        </span>
                        <input
                            type="text"
                            className="form-control mx-2"
                            placeholder="Ingrese el nombre del participante"
                            value={participant.nombre}
                            onChange={(e) => actualizarParticipante(index, e.target.value)}
                        />
                        <button
                            className="btn btn-danger"
                            onClick={() => eliminarParticipante(index)}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ParticipantSelector;