"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Compressor from 'compressorjs';
import { supabase } from '~/lib/supabase';

const Form = forwardRef(({ onSubmit }, ref) => {

    // Estados para manejar el formulario

    const [photos, setPhotos] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState(0);
    const [fecha_adquisicion, setFechaAdqui] = useState('');
    const [fecha_depreciacion, setFechaDepr] = useState('');
    const [area, setArea] = useState(1);
    const [agregado_por, setAgregadoPor] = useState(null)
    const [editandoCant, setEditando] = useState(false);
    const [errorNum, setErrorNum] = useState(false);

    useImperativeHandle(ref, () => ({

        mostrarFormulario: () => {

            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalImplementos'));
            modal.show();
        }
    }))


    useEffect(() => {

        supabase.auth.getUser()
            .then(response => {
                console.log('Agregado por: ', response.data.user.email)
                setAgregadoPor(response.data.user.email)
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

    const handleCantidadNum = (e) => {
        if (!/^\d*$/.test(e.target.value)) {       //Regex check para solo aceptar numeros enteros
          setEditando(true);
          setErrorNum(true);
        } else {
          setErrorNum(false);
          setCantidad(e.target.value);
          setEditando(false);
        }
      };

    // Manejador del submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Aquí puedes manejar el envío del formulario
        const formData = {
            descripcion,
            cantidad,
            fecha_adquisicion,
            fecha_depreciacion,
            area,
            photos,
            agregado_por
        };
        console.log(formData); // Simular envío

        fetch('/api/profesores/inventario/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        })
            // .then(response => response.json())
            .then(response => {
                if (response.status === 200) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalImplementos'));
                    modal.hide();
                    onSubmit()
                }
            })
    };

    return (
        <div>
            <div className="modal fade" id="modalImplementos" tabIndex="-1" aria-labelledby="modalDesperfectosLabel" aria-hidden="true">
                <form onSubmit={handleSubmit}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modalDesperfectosLabel">Agregar Implemento</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                {/* <!-- Descripción --> */}
                                <div className="mb-3">
                                    <label htmlFor="descripcion" className="form-label">Nombre del Implemento</label>
                                    <input
                                        className="form-control"
                                        id="descripcion"
                                        rows="3"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        required
                                    ></input>
                                </div>

                                {/* <!-- Cantidad --> */}
                                <div className="mb-3">
                                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cantidad"
                                        rows="3"
                                        value={cantidad}
                                        onChange={handleCantidadNum}
                                        placeholder="#"
                                        required
                                    ></input>
                                    {errorNum && (
                                        <span style={{ color: '#d9534f', fontSize: '0.9em', marginLeft: '10px' }}>
                                        Por favor, ingrese números solamente.
                                        </span>
                                    )}
                                </div>

                                {/* <!-- Fecha adqusicion --> */}
                                <div className="mb-3">
                                    <label htmlFor="fecha_adquisicion" className="form-label">Fecha de Adquisición</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha_adquisicion"
                                        value={fecha_adquisicion}
                                        onChange={(e) => setFechaAdqui(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* <!-- Fecha depreciacion --> */}
                                <div className="mb-3">
                                    <label htmlFor="fecha_depreciacion" className="form-label">Fecha de Depreciación</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha_depreciacion"
                                        value={fecha_depreciacion}
                                        onChange={(e) => setFechaDepr(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* <!-- Foto --> */}
                                <div className="mb-3">
                                <label className="form-label">Foto</label>
                                <div className="row" id="photos-container">

                                    {/* Renderizar la foto si ya ha sido seleccionada */}
                                    {photos.length > 0 && (
                                    <div className="col-sm-6 col-md-4 mb-3">
                                        <div className="card">
                                        <img src={photos[0]} className="card-img-top img-thumbnail" alt="Foto" />
                                        <div
                                            style={{ cursor: 'pointer' }}
                                            className="position-absolute end-0 me-2 mt-2"
                                            onClick={() => handleRemovePhoto(0)}
                                        >
                                            <i className="bi-x-circle-fill" />
                                        </div>
                                        </div>
                                    </div>
                                    )}

                                    {/* Card para agregar la foto si no hay ninguna */}
                                    {photos.length === 0 && (
                                    <div className="col-sm-3 mb-3">
                                        <div
                                        className="card text-center"
                                        id="add-imagen"
                                        style={{ cursor: 'pointer', height: '100%', minHeight: 150 }}
                                        onClick={() => document.getElementById('file-input')?.click()}
                                        >
                                        <div className="card-body d-flex flex-column justify-content-center">
                                            <h5 className="card-title">
                                            <i className="bi-plus-circle-fill" />
                                            </h5>
                                            <p className="card-text">Agregar foto</p>
                                        </div>
                                        </div>
                                        {/* Input para cargar la imagen, será invisible */}
                                        <input
                                        type="file"
                                        id="file-input"
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleAddPhoto}
                                        />
                                    </div>
                                    )}
                                </div>
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