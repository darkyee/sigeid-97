"use client";

import { useState } from "react"

export default function HorarioPicker({ data, onUpdate }) {

    const [horario, setHorario] = useState(data)
    const [diponible] = useState({ min: "06:00", max: "18:00" })

    function agregarRango(item, index) {
        const updatedHorario = [...horario];

        updatedHorario[index] = {
            ...horario[index],
            times: [
                ...horario[index].times,
                { start: '06:00', end: '07:00' }
            ]
        };

        setHorario(updatedHorario)
        onUpdate(updatedHorario)
    }

    function eliminarRango(index, timeIndex) {
        const updatedHorario = [...horario];

        // Eliminar el elemento en el índice `timeIndex` de `updatedHorario[index].times`
        updatedHorario[index] = {
            ...updatedHorario[index],
            times: updatedHorario[index].times.filter((_, i) => i !== timeIndex)
        };

        setHorario(updatedHorario); // Actualizar el estado
        onUpdate(updatedHorario)
    }

    function actualizarTiempoStart(e, index, timeIndex) {
        const value = e.target.value;

        if (value < diponible.min || value > diponible.max) return

        // Crear una copia del estado para modificarlo
        const updatedHorario = [...horario];
        // Actualizar el valor de start para el índice específico
        updatedHorario[index].times[timeIndex].start = value;

        if (updatedHorario[index].times[timeIndex].start > updatedHorario[index].times[timeIndex].end) {
            updatedHorario[index].times[timeIndex].end = '';
        }

        setHorario(updatedHorario); // Actualizar el estado
        onUpdate(updatedHorario)
    }

    function actualizarTiempoEnd(e, index, timeIndex) {
        const value = e.target.value;

        if (value < diponible.min || value > diponible.max) return

        // Crear una copia del estado para modificarlo
        const updatedHorario = [...horario];
        // Actualizar el valor de start para el índice específico
        updatedHorario[index].times[timeIndex].end = value;

        setHorario(updatedHorario); // Actualizar el estado
        onUpdate(updatedHorario)
    }

    return (
        <div>
            <h5 className="mt-4">El horario de disponibilidad será de 06:00 a 18:00</h5>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Día</th>
                        <th>Horarios</th>
                        {/* <th>Acciones</th> */}
                    </tr>
                </thead>
                <tbody>
                    {horario.map((item, index) => (
                        <tr key={index}>
                            <td>{item.day}</td>
                            <td>
                                {
                                    item.times.map((time, timeIndex) => (
                                        <div key={timeIndex} style={{ maxWidth: 250 }} className="mb-2">
                                            <div className="d-flex align-items-center">
                                                <input className="form-control" type="time" value={time.start} min={diponible.min} max={diponible.max} step="900" onChange={(e) => actualizarTiempoStart(e, index, timeIndex)}></input>
                                                <div className="mx-2">-</div>
                                                <input className="form-control" type="time" value={time.end} min={diponible.min} max={diponible.max} step="900" onChange={(e) => actualizarTiempoEnd(e, index, timeIndex)}></input>
                                                <button type="button" className="btn btn-link text-danger btn-sm" onClick={() => eliminarRango(index, timeIndex)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                                <div className="my-2">
                                    <button type="button" className="btn btn-primary btn-sm me-2" onClick={() => agregarRango(item, index)}>+ Agregar Rango</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}