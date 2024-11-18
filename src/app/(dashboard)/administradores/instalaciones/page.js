"use client";

import { useEffect, useState, useRef } from 'react';
import InstalacionesForm from '../components/InstalacionesForm';

export default function Page() {

    const [instalaciones, setInstalaciones] = useState([]);
    const formRef = useRef(null)

    useEffect(() => {
        cargarInstalaciones()
    }, [])

    function cargarInstalaciones() {
        fetch('/api/administradores/instalaciones')
            .then(response => response.json())
            .then(response => {
                setInstalaciones(response.data)

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
            <div className='row mb-5'>
                <div className='col'>

                    <button type="button" className="btn btn-primary float-end" onClick={() => mostrarFormulario(null)}>
                        Agregar Instalación
                    </button>

                    <InstalacionesForm ref={formRef} onInsert={cargarInstalaciones} />
                </div>
            </div>
            <div className='row'>

                <div className='col'>
                    <table id="example" className="table table-striped" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Horario Préstamo</th>
                                <th>Descripción</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                instalaciones.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.id_instalacion_deportiva}</td>
                                            <td>{item.nombre}</td>
                                            <td>{item.horario_disponible ?? 'N/A'}</td>
                                            <td>{item.descripcion}</td>
                                            <td>
                                                <button className='btn btn-warning' onClick={() => mostrarFormulario(item)}>
                                                    Actualizar
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}