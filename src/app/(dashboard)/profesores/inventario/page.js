"use client";

import { useEffect, useState, useRef } from 'react';
import InventarioItem from '../components/InventarioItem';
import ImplementosForm from '../components/ImplementosForm'
import './style.css';

export default function Inventario() {

    const [inventario, setInventario] = useState([]);
    const [loading, setLoading] = useState(true);

    const formRef = useRef(null)

    useEffect(() => {
        cargarInventario()
    }, [])

    function mostrarFormulario() {
        if (formRef.current) {
            formRef.current.mostrarFormulario();
        }
    }

    const cargarInventario = async () => {
        const inventarioResponse = await fetch('/api/profesores/inventario/0');
        const inventarioData = await inventarioResponse.json();
        setInventario(inventarioData);
        setLoading(false);
    }
    

    const LoadingMessage = () => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="loader"></div>
            <span style={{ marginLeft: '10px' }}>Cargando Inventario...</span>
          </div>
        );
      };

    
    if (loading) return <LoadingMessage />; 

    return (
        <div className='container'>
            <div className='row mb-5'>
                <div className='col'>
                    <h3>Inventario</h3>
                </div>
            </div>
            <button onClick={mostrarFormulario} className='btn btn-primary buttonAgregar'>Agregar Implemento</button>
            <ImplementosForm ref={formRef} onSubmit={cargarInventario} />

            <div className='row'>
                {
                    inventario.map((implementos) => {
                        return (
                            <div className='col col-sm-6 col-lg-3' key={implementos.id_implemento}>
                                <InventarioItem {...implementos}></InventarioItem>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}