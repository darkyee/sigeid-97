"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "~/lib/supabase";
import InstalacionesForm from '../components/InstalacionesForm';

export default function Reservas() {

    const [email, setEmail] = useState(null);
    const [reservas, setReservas] = useState([]);
    const formRef = useRef(null)

    useEffect(() => {
        supabase.auth.getUser()
            .then(({ data: { user } }) => user.email)
            .then(email => {
                setEmail(email)
            })
    }, [])

    useEffect(() => {
        cargarReservas()
    }, [email])

    function cargarReservas() {

        if (!email) return

        fetch('/api/estudiantes/mis-reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        })
            .then(response => response.json())
            .then(response => {

                console.log(response.data)

                setReservas(response.data || [])

                setTimeout(() => {
                    if ($.fn.DataTable.isDataTable('#example')) {
                        $('#example').DataTable().destroy()
                    }
                    $('#example').DataTable()
                }, 100)
            })
    }

    function estadoSolicitud(value) {
        if (value) {
            return value.estado == 'true' ? 'Aprobado' : 'Pendiente'
        }
        return 'Desconocido'
    }

    function mostrarFormulario(instalacion) {
        formRef.current.mostrarFormulario(instalacion)
    }

    return (
        <div className='container'>
            <div className='row mb-4'>
                <div className="col-12">
                    <h2>Mis Reservas</h2>
                </div>
            </div>
            <div className='row'>
                {
                    reservas.map((item, index) => {
                        return (
                            <div className='col-12 col-sm-6 col-md-4 col-lg-3' key={index}>
                                <div className="card mb-4">
                                    <img src={item.instalacion_deportiva.foto || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'} className="card-img-top" alt="Foto de Instalación" />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.instalacion_deportiva.nombre}</h5>
                                        <div className="card-text">
                                            <p>{item.instalacion_deportiva.descripcion}</p>
                                            <p>Fecha: {new Date(item.fecha_solicitud).toLocaleDateString('es-ES')}</p>
                                            <p>Estado: {estadoSolicitud(item.estado_solicitud)}</p>
                                        </div>
                                        <div className="d-grid gap-2">
                                            <button className='btn btn-danger' onClick={() => { }}>
                                                Cancelar Reserva
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