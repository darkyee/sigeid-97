"use client";

import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import ParticipantSelector from './ParticipantSelector';
import { supabase } from '~/lib/supabase';
import { addDays, setHours, setMinutes, isSameDay } from 'date-fns';

registerLocale('es', es);

const Form = forwardRef(({ onEdit, onInsert }, ref) => {
    const [horario, setHorario] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [instalacionId, setInstalacionId] = useState(null);
    const [userCarnet, setUserCarnet] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (user) {

                setUserCarnet(user.email);

            }
        });
    }, []);

    const resetForm = () => {
        setSelectedDate(null);
        setParticipants([]);
        setSelectedTimeSlot(null);
        setAvailableTimeSlots([]);
    };

    useImperativeHandle(ref, () => ({
        mostrarFormulario: (data) => {
            const scheduleData = data.disponibilidad_horario.filter(v => v.times.length);
            setHorario(scheduleData);
            setInstalacionId(data.id_instalacion_deportiva);
            resetForm();
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
            modal.show();
        }
    }));

    const isDateAvailable = (date) => {
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
        const daySchedule = horario.find(d => d.day.toLowerCase() === dayName.toLowerCase());
        return daySchedule && daySchedule.times.length > 0;
    };

    const generateTimeSlots = (date) => {
        if (!date) return [];

        const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
        const daySchedule = horario.find(d => d.day.toLowerCase() === dayName.toLowerCase());

        if (!daySchedule) return [];

        const slots = [];
        daySchedule.times.forEach(timeRange => {
            const [startHour, startMinute] = timeRange.start.split(':').map(Number);
            const [endHour, endMinute] = timeRange.end.split(':').map(Number);

            let currentTime = setMinutes(setHours(date, startHour), startMinute);
            const endTime = setMinutes(setHours(date, endHour), endMinute);

            while (currentTime < endTime) {
                const slotEnd = addDays(currentTime, 0);
                slotEnd.setMinutes(slotEnd.getMinutes() + 15);

                if (slotEnd <= endTime) {
                    slots.push({
                        start: new Date(currentTime),
                        end: new Date(slotEnd)
                    });
                }
                currentTime = new Date(slotEnd);
            }
        });

        return slots;
    };

    useEffect(() => {
        if (selectedDate) {
            const slots = generateTimeSlots(selectedDate);
            setAvailableTimeSlots(slots);
            setSelectedTimeSlot(null);
        }
    }, [selectedDate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedDate || !selectedTimeSlot || participants.length === 0 || !userCarnet) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }

        const formData = {
            fecha_solicitud: new Date().toISOString().split('T')[0],
            participantes: participants,
            fecha_inicio_reserva: selectedTimeSlot.start.toISOString(),
            fecha_fin_reserva: selectedTimeSlot.end.toISOString(),
            solicitante: userCarnet,
            instalacion_deportiva: instalacionId
        };

        try {
            const response = await fetch('/api/estudiantes/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                modal.hide();
                resetForm();
                onInsert && onInsert();
            } else {
                const error = await response.json();
                alert(error.error || 'Error al realizar la reserva');
            }
        } catch (error) {
            alert('Error al procesar la solicitud');
        }
    };

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <form onSubmit={handleSubmit}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Reservar Instalación</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='container-fluid'>
                                <div className='row'>
                                    <div className='col col-12 col-sm-6 mb-3'>
                                        <label className="form-label">Horarios Disponibles</label>
                                        <div className='row'>
                                            {horario.map((item, index) => (
                                                <div className='col col-12' key={index}>
                                                    <div className='card mb-2'>
                                                        <div className="card-body">
                                                            <div className='row'>
                                                                <div className='col col-12 col-lg-4'>
                                                                    <strong>{item.day}</strong>
                                                                </div>
                                                                <div className='col col-12 col-lg-8'>
                                                                    {item.times.map((time, timeIndex) => (
                                                                        <div key={timeIndex}>
                                                                            {time.start} → {time.end}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='col col-12 col-sm-6'>
                                        <label className="form-label">Seleccionar Fecha y Hora</label>
                                        <div className="mb-3">
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={setSelectedDate}
                                                locale="es"
                                                dateFormat="dd/MM/yyyy"
                                                minDate={new Date()}
                                                filterDate={isDateAvailable}
                                                placeholderText="Seleccione una fecha"
                                                className="form-control"
                                                inline
                                            />
                                        </div>

                                        {selectedDate && (
                                            <div className="mb-3">
                                                <label className="form-label">Horario Disponible</label>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {availableTimeSlots.map((slot, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            className={`btn ${selectedTimeSlot === slot ? 'btn-primary' : 'btn-outline-primary'}`}
                                                            onClick={() => setSelectedTimeSlot(slot)}
                                                        >
                                                            {slot.start.toLocaleTimeString('es-ES', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className='col col-12 mt-4'>
                                        <label className="form-label">Participantes</label>
                                        <hr />
                                        <ParticipantSelector onChange={setParticipants} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="submit" className="btn btn-primary">Reservar</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
});

export default Form;