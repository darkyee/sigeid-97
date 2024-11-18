"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script'
import InstalacionesForm from './components/InstalacionesForm';
import InstalacionItem from './components/InstalacionItem';

export default function Page() {

    const [instalaciones, setInstalaciones] = useState([]);

    useEffect(() => {
        cargarInstalaciones()

        // Inicializa la datatable
        new DataTable('#example');
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
                    <InstalacionesForm onInsert={cargarInstalaciones} />
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
                            <tr>
                                <td>Tiger Nixon</td>
                                <td>System Architect</td>
                                <td>Accountant</td>
                                <td>Edinburgh</td>
                                <td>61</td>
                            </tr>
                            <tr>
                                <td>Garrett Winters</td>
                                <td>Accountant</td>
                                <td>Tokyo</td>
                                <td>63</td>
                                <td>2011-07-25</td>
                            </tr>
                            <tr>
                                <td>Ashton Cox</td>
                                <td>Junior Technical Author</td>
                                <td>San Francisco</td>
                                <td>66</td>
                                <td>$86,000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {
                    // instalaciones.map((instalacion, index) => {
                    //     return (
                    //         <div className='col col-sm-4' key={index}>
                    //             <InstalacionItem {...instalacion} />
                    //         </div>
                    //     )
                    // })
                }
            </div>
        </div>
    )
}