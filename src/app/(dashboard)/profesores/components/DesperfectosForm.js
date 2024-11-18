"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Compressor from 'compressorjs';
import { supabase } from '~/lib/supabase';

const Form = forwardRef(({ onSubmit }, ref) => {

    // Estado para manejar el formulario
    const [estados, setEstados] = useState([]);

    const [photos, setPhotos] = useState([]);
    const [asunto, setAsunto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [instalacion, setInstalacion] = useState(-1);
    // const [estado, setEstado] = useState(1);
    // const [fecha, setFecha] = useState(
    //     new Date().toISOString().slice(0, 16) // Fecha actual
    // );
    const [reportado_por, setReportadoPor] = useState(null)
    const [editando, setEditando] = useState(false);

    useImperativeHandle(ref, () => ({

        mostrarFormulario: (data, instalacion_afectada) => {

            setEditando(data !== null)

            if (data !== null) {
                setPhotos([])
                setAsunto(data.asunto || "")
                setDescripcion(data.descripcion || "")
                setInstalacion(data.instalacion_afectada || instalacion_afectada)
                // setEstado(data.estado_reporte || 1)
                // setFecha(data.fecha_reporte || new Date().toISOString().slice(0, 16))
                setReportadoPor(data.reportado_por)
            } else {
                setPhotos([])
                setAsunto("")
                setDescripcion("")
                setInstalacion(instalacion_afectada)
                // setEstado(1)
                // setFecha(new Date().toISOString().slice(0, 16))
                setReportadoPor(null)
            }

            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
            modal.show();
        }
    }))

    useEffect(() => {

        supabase.auth.getUser()
            .then(response => {
                console.log('Reportado por: ', response.data.user.email)
                setReportadoPor(response.data.user.email)
            })

        fetch('/api/estados')
            .then(response => response.json())
            .then(response => {
                setEstados(response.data)
            })
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
            estado: 1,
            fecha: new Date().toISOString().slice(0, 16),
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
                    const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                    modal.hide();
                    onSubmit()
                }
            })
    };

    return (
        <div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form onSubmit={handleSubmit}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Formulario</h5>
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
                                {/* <div className="mb-3">
                                    <label htmlFor="fecha" className="form-label">Fecha</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="fecha"
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                        required
                                    />
                                </div> */}

                                {/* <!-- Estado --> */}
                                {/* <div className="mb-3">
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
                                </div> */}

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
                                            <div className="card text-center" id="add-photo-card" style={{ cursor: 'pointer', height: '100%', minHeight: 150 }}
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
})

export default Form;