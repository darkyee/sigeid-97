"use client";

import { useEffect, useState } from "react"

export default function Page({ params }) {

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch(`/api/administradores/instalaciones/${params.id}`)
            .then(response => response.json())
            .then(response => {
                console.log(response.data)
                setData(response.data)
                setLoading(false)
            })
    }, [])


    if (loading) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>Cargando Instalación Deportiva...</h1>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>{data.nombre}</h1>
                        <h3>{data.descripcion}</h3>
                        <img src={data.foto} style={{ maxWidth: 200 }} ></img>
                        Se presta? {data.se_presta}
                    </div>
                    <div className="col col-12">
                        
                    </div>
                </div>
            </div>
        )
    }
}