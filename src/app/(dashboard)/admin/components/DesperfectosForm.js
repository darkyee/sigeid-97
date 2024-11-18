"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Compressor from 'compressorjs';
import { supabase } from '~/lib/supabase';

const Form = forwardRef(({ onSubmit }, ref) => {

    // Estados para manejar el formulario
    const [estados, setEstados] = useState([]);
    const [instalaciones, setInstalaciones] = useState([]);

    const [photos, setPhotos] = useState([]);
    const [asunto, setAsunto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [instalacion, setInstalacion] = useState(5);
    const [estado, setEstado] = useState(1);
    const [fecha, setFecha] = useState(
        new Date().toISOString().slice(0, 16) // Fecha actual
    );
    const [reportado_por, setReportadoPor] = useState(null)

    useImperativeHandle(ref, () => ({

        mostrarFormulario: () => {

            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalDesperfectos'));
            modal.show();
        }
    }))

    const llamarAPI = async () => {
        const stateResponse = await fetch('/api/administrador/estado/');
        const areaResponse = await fetch('/api/administrador/instalaciones/');
        const stateData = await stateResponse.json();
        const areaData = await areaResponse.json();
        setEstados(stateData);
        setInstalaciones(areaData);
      };

    useEffect(() => {

        // supabase.auth.getUser()
        //     .then(response => {
        //         console.log('Reportado por: ', response.data.user.email)
        //         setReportadoPor(response.data.user.email)
        //     })

        llamarAPI();

    }, [])

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
                            setPhotos([...photos, e.target.result.toString()]);
                        }
                    };
                    reader.readAsDataURL(file);
                })
        }
    };

    // Manejador para eliminar una foto por índice
    const handleRemovePhoto = (index) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    // Manejador del submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Aquí puedes manejar el envío del formulario
        const formData = {
            asunto,
            descripcion,
            instalacion_afectada: instalacion,
            estado,
            fecha,
            photos,
            reportado_por
        };
        console.log(formData); // Simular envío

        fetch('/api/profesores/desperfectos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        })
            // .then(response => response.json())
            .then(response => {
                if (response.status === 200) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalDesperfectos'));
                    modal.hide();
                    onSubmit()
                }
            })
    };

    return (
        <div>
            <div className="modal fade" id="modalDesperfectos" tabIndex="-1" aria-labelledby="modalDesperfectosLabel" aria-hidden="true">
                <form onSubmit={handleSubmit}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modalDesperfectosLabel">Agregar Desperfecto</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                {/* <!-- Asunto --> */}
                                <div className="mb-3">
                                    <label htmlFor="asunto" className="form-label">Asunto</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="asunto"
                                        value={asunto}
                                        onChange={(e) => setAsunto(e.target.value)}
                                        placeholder="Escribe el asunto"
                                        required
                                    />
                                </div>

                                {/* <!-- Descripción --> */}
                                <div className="mb-3">
                                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                                    <textarea
                                        className="form-control"
                                        id="descripcion"
                                        rows="3"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        placeholder="Escribe la descripción"
                                        required
                                    ></textarea>
                                </div>

                                {/* <!-- Fecha --> */}
                                <div className="mb-3">
                                    <label htmlFor="fecha" className="form-label">Fecha</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha"
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* <!-- Instalación --> */}
                                <div className="mb-3">
                                    <label htmlFor="instalacion" className="form-label">Instalación</label>
                                    <select
                                        className="form-select"
                                        id="instalacion"
                                        value={instalacion}
                                        onChange={(e) => setInstalacion(e.target.value)}
                                        required
                                    >
                                        {instalaciones.map((value, index) => {
                                            return (
                                                <option key={index} value={value.id_instalacion_deportiva}>{value.nombre}</option>
                                            )
                                        })}
                                    </select>
                                </div>

                                {/* <!-- Estado --> */}
                                <div className="mb-3">
                                    <label htmlFor="estado" className="form-label">Estado</label>
                                    <select
                                        className="form-select"
                                        id="estado"
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                        required
                                    >
                                        {estados.map((value, index) => {
                                            return (
                                                <option key={index} value={value.id_estado_reporte}>{value.estado}</option>
                                            )
                                        })}
                                    </select>
                                </div>

                                {/* <!-- Fotos --> */}
                                <div className="mb-3">
                                    <label className="form-label">Fotos</label>
                                    <div className="row" id="photos-container">

                                        {/* Renderizar las fotos */}
                                        {photos.map((photo, index) => (
                                            <div className="col-sm-6 col-md-4 mb-3" key={index}>
                                                <div className="card">
                                                    <img src={photo} className="card-img-top img-thumbnail" alt="Foto" />
                                                    <div style={{ cursor: 'pointer' }} className="position-absolute end-0 me-2 mt-2" onClick={() => handleRemovePhoto(index)}>
                                                        <i className="bi-x-circle-fill" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* <!-- Card para agregar más fotos --> */}
                                        <div className="col-sm-3 mb-3">
                                            <div className="card text-center" id="add-imagen" style={{ cursor: 'pointer', height: '100%', minHeight: 150 }}
                                                onClick={() => document.getElementById('file-input')?.click()}>
                                                <div className="card-body d-flex flex-column justify-content-center">
                                                    <h5 className="card-title">
                                                        <i className="bi-plus-circle-fill" />
                                                    </h5>
                                                    <p className="card-text">Agregar foto</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <!-- Input para cargar la imagen, será invisible --> */}
                                    <input
                                        type="file"
                                        id="file-input"
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        onChange={handleAddPhoto}
                                    />

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button type="submit" className="btn btn-primary">Guardar</button>
                            </div>       
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div >
    )
})

export default Form;