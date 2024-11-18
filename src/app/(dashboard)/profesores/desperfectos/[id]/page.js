"use client";

import { useEffect, useState, useRef } from 'react';
import DesperfectosForm from '../../components/DesperfectosForm'

export default function Page({ params }) {

    const [desperfectos, setDesperfectos] = useState([]);
    const formRef = useRef(null)

    useEffect(() => {
        cargarDesperfectos()
    }, [])

    function cargarDesperfectos() {
        setDesperfectos([])
        fetch(`/api/profesores/desperfectos/${params.id}`)
            .then(response => response.json())
            .then(response => {
                if (Array.isArray(response.data)) {

                    console.log(response.data)

                    setDesperfectos(response.data)

                    setTimeout(() => {
                        if ($.fn.DataTable.isDataTable('#example')) {
                            $('#example').DataTable().destroy()
                        }
                        $('#example').DataTable()
                    }, 100)
                }
            })
    }

    function mostrarFormulario(instalacion) {
        formRef.current.mostrarFormulario(instalacion, params.id)
    }

    return (
        <div className='container'>
            <div className='row mb-5'>
                <div className='col'>
                    <button type="button" className="btn btn-primary float-end" onClick={() => mostrarFormulario(null)}>
                        Agregar Desperfecto
                    </button>

                    <DesperfectosForm ref={formRef} onSubmit={cargarDesperfectos} />
                </div>
            </div>
            <div className='row'>

                <div className='col'>
                    <table id="example" className="table table-striped" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Asunto</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                desperfectos.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.id_reporte_desperfecto}</td>
                                            <td>{item.fecha_reporte}</td>
                                            <td>{item.asunto ?? 'N/A'}</td>
                                            <td>{item.descripcion}</td>
                                            <td>{item.estado_reporte}</td>
                                            {/* <td>
                                                <button className='btn btn-warning' onClick={() => mostrarFormulario(item)}>
                                                    Actualizar
                                                </button>
                                            </td> */}
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