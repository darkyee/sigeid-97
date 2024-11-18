"use client";

import { useState } from 'react';
import Compressor from 'compressorjs';

export default function InstalacionesForm({ onInsert }) {

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [presta, setPresta] = useState(false);
    const [photo, setPhoto] = useState(null); // Cambiado a solo una foto

    const compressPhoto = (file) => {
        return new Promise((resolve, reject) => {
            new Compressor(file, {
                quality: 0.8,
                maxWidth: 1280,
                success(result) {
                    resolve(result)
                },
                error(err) {
                    reject(err)
                }
            })
        })
    }

    // Manejador para agregar una foto
    const handleAddPhoto = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            compressPhoto(file)
                .then(file => {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        if (e.target?.result) {
                            setPhoto(e.target.result.toString());
                        }
                    };
                    reader.readAsDataURL(file);
                })
        }
    };

    // Manejador para eliminar una foto por índice
    const handleRemovePhoto = (index) => {
        setPhoto(photo.filter((_, i) => i !== index));
    };

    // Manejador del submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Aquí puedes manejar el envío del formulario
        const formData = {
            nombre,
            descripcion,
            presta,
            photo, // Solo una foto
        };
        console.log(formData); // Simular envío

        fetch('/api/administradores/instalaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (response.status === 200) {
                    onInsert && onInsert()
                }
            })
    };

    return (
        <div>
            <button type="button" className="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Agregar Instalación
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form onSubmit={handleSubmit}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Formulario</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                {/* <!-- Nombre --> */}
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Escribe el nombre"
                                        required
                                    />
                                </div>

                                {/* <!-- Descripción --> */}
                                <div className="mb-3">
                                    <label htmlFor="descripcion" className="form-label">
                                        Descripción
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="descripcion"
                                        rows={3}
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        placeholder="Escribe la descripción"
                                        required
                                    ></textarea>
                                </div>

                                {/* <!-- Foto --> */}
                                <div className="mb-3">
                                    <label className="form-label">Foto</label>
                                    <div className="card">
                                        {photo && (
                                            <img src={photo} className="card-img-top img-thumbnail" alt="Foto seleccionada" />
                                        )}
                                        <div className="card-body text-center">
                                            <input
                                                type="file"
                                                id="file-input"
                                                accept="image/*"
                                                onChange={handleAddPhoto}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Checkbox para indicar si se presta o no --> */}
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="presta"
                                        checked={presta}
                                        onChange={(e) => setPresta(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="presta">
                                        ¿Se presta?
                                    </label>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button type="submit" className="btn btn-primary">Guardar</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* <script>
  // Script para establecer la fecha actual automáticamente
                document.getElementById('fecha').value = new Date().toISOString().slice(0, 16);

                // Script para manejar la carga de fotos
                document.getElementById('add-photo-card').addEventListener('click', function() {
                    document.getElementById('file-input').click();
  });

                document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
                if (file) {
      const reader = new FileReader();
                reader.onload = function(e) {
        // Crear nueva card con la imagen cargada
        const newCard = `
                <div className="col-sm-4 mb-3">
                    <div className="card">
                        <img src="${e.target.result}" className="card-img-top" alt="Foto" />
                    </div>
                </div>
                `;
                document.getElementById('photos-container').insertAdjacentHTML('beforeend', newCard);
      };
                reader.readAsDataURL(file);
    }
  });
            </script> */}
        </div >
    )
}