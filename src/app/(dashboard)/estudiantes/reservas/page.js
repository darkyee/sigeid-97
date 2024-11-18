"use client";

import { useEffect, useRef, useState } from "react";
import InstalacionesForm from '../components/InstalacionesForm';

export default function Reservas() {

    const [instalaciones, setInstalaciones] = useState([]);
    const formRef = useRef(null)

    useEffect(() => {
        cargarInstalaciones()
    }, [])

    function cargarInstalaciones() {
        fetch('/api/estudiantes/instalaciones')
            .then(response => response.json())
            .then(response => {

                console.log(response.data)
                
                setInstalaciones(response.data || [])

                setTimeout(() => {
                    if ($.fn.DataTable.isDataTable('#example')) {
                        $('#example').DataTable().destroy()
                    }
                    $('#example').DataTable()
                }, 100)
            })
    }

    function mostrarFormulario(instalacion) {
        formRef.current.mostrarFormulario(instalacion)
    }

    return (
        <div className='container'>
            <div className='row mb-4'>
                <div className="col-12">
                    <h2>Reserva de Instalaciones Deportivas</h2>
                    <InstalacionesForm ref={formRef} />
                </div>
            </div>
            <div className='row'>
                {
                    instalaciones.map((item, index) => {
                        return (
                            <div className='col-12 col-sm-6 col-md-4 col-lg-3' key={index}>
                                <div className="card mb-4">
                                    <img src={item.foto || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'} className="card-img-top" alt="Foto de Instalación" />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.nombre}</h5>
                                        <p className="card-text">{item.descripcion}</p>
                                        <div className="d-grid gap-2">
                                            <button className='btn btn-warning' onClick={() => mostrarFormulario(item)}>
                                                Reservar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div >
    )
}