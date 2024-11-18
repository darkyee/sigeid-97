"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Compressor from 'compressorjs';
import HorarioPicker from './HorarioPicker';

const Form = forwardRef(({ onEdit, onInsert }, ref) => {

    const [id, setID] = useState(null);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [presta, setPresta] = useState(false);
    const [horario, setHorario] = useState([
        { day: 'Lunes', times: [] },
        { day: 'Martes', times: [] },
        { day: 'Miércoles', times: [] },
        { day: 'Jueves', times: [] },
        { day: 'Viernes', times: [] },
    ]);
    const [photo, setPhoto] = useState(null); // Cambiado a solo una foto
    const [editando, setEditando] = useState(false);

    useImperativeHandle(ref, () => ({

        mostrarFormulario: (data) => {

            // console.log(data)

            setEditando(data !== null)

            if (data !== null) {
                setID(data.id_instalacion_deportiva)
                setNombre(data.nombre)
                setDescripcion(data.descripcion || "")
                setPresta(data.se_presta)
                setPhoto(data.foto)
                setHorario(data.disponibilidad_horario || [
                    { day: 'Lunes', times: [] },
                    { day: 'Martes', times: [] },
                    { day: 'Miércoles', times: [] },
                    { day: 'Jueves', times: [] },
                    { day: 'Viernes', times: [] },
                ])
            } else {
                reiniciarFormulario()
            }

            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
            modal.show();
        }
    }))

    const ocultarFormulario = function () {
        reiniciarFormulario();
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
        modal.hide();
    }

    const reiniciarFormulario = function () {
        setID(null)
        setNombre("")
        setDescripcion("")
        setPresta(false)
        setPhoto(null)
        setHorario([
            { day: 'Lunes', times: [] },
            { day: 'Martes', times: [] },
            { day: 'Miércoles', times: [] },
            { day: 'Jueves', times: [] },
            { day: 'Viernes', times: [] },
        ])
    }

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

    // Manejador del submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Aquí puedes manejar el envío del formulario
        const formData = {
            nombre,
            descripcion,
            presta,
            photo, // Solo una foto
            disponibilidad_horario: horario,
        };
        // console.log(formData); // Simular envío

        // return

        if (editando) {
            fetch(`/api/administradores/instalaciones/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            })
                .then(response => {
                    if (response.status === 200) {
                        onInsert && onInsert()
                        ocultarFormulario()
                    }
                })
        } else {
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
                        ocultarFormulario()
                    }
                })
        }
    };

    const eliminar = async (event) => {
        fetch(`/api/administradores/instalaciones/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.status === 200) {
                    onInsert && onInsert()
                    ocultarFormulario()
                }
            })
    }

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <form onSubmit={handleSubmit}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Formulario</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={ocultarFormulario}></button>
                        </div>
                        <div className="modal-body">

                            <div className='container-fluid'>
                                <div className='row'>
                                    <div className='col col-sm-6'>

                                        {/* <!-- Foto --> */}
                                        <label className="form-label">Foto</label>
                                        <div className="card" style={{ overflow: 'hidden', height: 250 }}>
                                            {photo && (
                                                <img src={photo} alt="Foto seleccionada" style={{ height: '75%', maxWidth: 'fit-content', margin: 'auto' }} />
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
                                    <div className='col col-sm-6'>

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
                                                rows={4}
                                                value={descripcion}
                                                onChange={(e) => setDescripcion(e.target.value)}
                                                placeholder="Escribe la descripción"
                                                required
                                            ></textarea>
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

                                    {
                                        presta && <div className='col col-12'>
                                            <HorarioPicker data={horario} onUpdate={setHorario} />
                                        </div>
                                    }
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            {
                                editando && <button type="button" className="btn btn-danger" onClick={eliminar}>Eliminar</button>
                            }
                            <button type="button" className="btn btn-secondary" onClick={ocultarFormulario}>Cerrar</button>
                            <button type="submit" className="btn btn-primary">
                                {editando ? "Actualizar" : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
})

export default Form;