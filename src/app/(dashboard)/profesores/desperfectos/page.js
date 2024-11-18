"use client";

import { useEffect, useState, useRef } from 'react';
import InstalacionItem from '../components/InstalacionItem';

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
            })
    }

    return (
        <div className='container'>
            <div className='row mb-5'>
                <div className='col'>
                    <h3>Reporte de Desperfectos</h3>
                </div>
            </div>
            <div className='row'>
                {
                    instalaciones.map((item, index) => {
                        return (
                            <div className='col col-sm-6 col-lg-3' key={index}>
                                <InstalacionItem {...item}></InstalacionItem>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}