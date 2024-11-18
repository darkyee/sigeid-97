"use client";
import { useRouter, useParams } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import './style.css';

export default function DetallesDesperfecto() {
  const { id } = useParams(); // Toma el id dinamico de los parametros
  const router = useRouter();

  const [states, setStates] = useState([]);
  const [instalaciones, setAreas] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorNum, setErrorNum] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState('');
  const [stateChange, setStateChange] = useState(true);
  const [numeroArchivus, setNumeroArchivus] = useState('');
  const [archivusChange, setArchivusChange] = useState(true);

  const clickVolver = () => {
    router.push(`./`);
  };

  const guardarEstado = async () => {
    
    const resp = await fetch(`/api/administrador/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado_reporte: selectedEstado }),
    });
    setStateChange(true);

  };

  const guardarNumeroArc = async () => {
    
    const resp = await fetch(`/api/administrador/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ numero_reporte_archivus: numeroArchivus }),
    });
    setArchivusChange(true);

  };

  const borrarDesperfecto = async () => {
    const resp = await fetch(`/api/administrador/${id}`, {
      method: 'DELETE',
    });
    clickVolver();
  }

  const handleSelectChange = (e) => {
    setSelectedEstado(e.target.value);
    setStateChange(false);
  };

  const handleArchivusChange = (e) => {
    if (!/^\d*$/.test(e.target.value)) {       //Regex check para solo aceptar numeros enteros
      setArchivusChange(true);
      setErrorNum(true);
    } else {
      setErrorNum(false);
      setNumeroArchivus(e.target.value);
      setArchivusChange(false);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/administrador/${id}`);
        const stateResponse = await fetch('/api/administrador/estado/');
        const areaResponse = await fetch('/api/administrador/instalaciones/');
        if (!res.ok) {
          throw new Error('Error al solicitar');
        }
        const data = await res.json();
        const stateData = await stateResponse.json();
        const areaData = await areaResponse.json();
        setReport(data);
        setStates(stateData);
        setAreas(areaData);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  useEffect(() => {
    if (report) {
      setSelectedEstado(report.estado_reporte);
      if (report.numero_reporte_archivus !== null) {
        setNumeroArchivus(report.numero_reporte_archivus);
      }
    }
  }, [report]);

  if (loading) return <LoadingMessage />; 
  if (error) return <p>Error: {error}</p>;

  const estadosJson = states.reduce((acc, state) => {
    acc[state.id_estado_reporte] = state.estado;
    return acc;
  }, {});

  const instalacionesJson = instalaciones.reduce((acc, instalacion) => {
    acc[instalacion.id_instalacion_deportiva] = instalacion.nombre;
    return acc;
  }, {});

  return (
    <div>
      <button style={buttonVolver} onClick={() => clickVolver()}>Volver</button>
      <h1 style={{ marginTop: '50px', marginBottom: '65px' }}>Detalles de Desperfecto</h1>
      {report ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '35px', justifyContent: 'space-evenly'}}>
          <p><strong>Asunto:</strong> {report.asunto}</p>
          <p><strong>Instalación Afectada:</strong> {instalacionesJson[report.instalacion_afectada]}</p>
          <p><strong>Fecha de Reporte:</strong> {new Date(report.fecha_reporte).toLocaleString()}</p>
          <label style={{fontSize: '22px'}}><strong>Estado del Reporte: </strong>
            <select style={{fontSize: '20px'}} value={selectedEstado} onChange={handleSelectChange}>
              {Object.entries(estadosJson).map(([id, estado]) => (
                  <option value={id}>{estado}</option>
              ))}
            </select>
            <button style={buttonGuardarEstado} disabled={stateChange} onClick={guardarEstado}>Guardar Estado</button>
          </label>
          <label style={{fontSize: '22px'}}><strong>Número de Archivus: </strong>
              <input style={{fontSize: '21px', width: '128px'}} type='text' value={numeroArchivus} onChange={handleArchivusChange} placeholder='N/A'></input>
              {errorNum && (
                <span style={{ color: '#d9534f', fontSize: '0.9em', marginLeft: '10px' }}>
                  Por favor, ingrese números solamente.
                </span>
              )}
              <button style={buttonArchivus} disabled={archivusChange} onClick={guardarNumeroArc}>Guardar # Archivus</button>
          </label>
          <p><strong>Descripción:</strong> {report.descripcion}</p>
        </div>
      ) : (
        <p>No se encontró el reporte.</p>
      )}
      {report.FotoDesperfecto && report.FotoDesperfecto.length > 0 && report.FotoDesperfecto[0].foto ? (
            <div>
              <div>
                <a href={report.FotoDesperfecto[0].foto} download={report.asunto} className='btn btn-primary' style={{marginLeft: '1000px', marginTop: '-300px'}}>
                <img
                  src={report.FotoDesperfecto[0].foto}
                  alt="Foto del desperfecto"
                  style={imagen}
                />
                Descargar Imagen
                </a>
              </div>
              <button style={buttonBorrar} onClick={borrarDesperfecto}>Borrar Desperfecto</button>
            </div>
          ) : (
            <div>
              <p style={noDisp}>Imagen no Disponible</p>
              <button style={buttonBorrar} onClick={borrarDesperfecto}>Borrar Desperfecto</button>
            </div>
          )}
    </div>
  );
}

// Loading message component
const LoadingMessage = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="loader"></div>
      <span style={{ marginLeft: '10px' }}>Cargando el reporte...</span>
    </div>
  );
};

const imagen = {
  position: 'absolute',
  bottom: '370px',
  left: '1270px',
  width: '250px' 
}

const noDisp = {
  position: 'absolute',
  bottom: '550px',
  left: '1280px',
}

const buttonGuardarEstado = {
  position: 'relative',
  left: '10px',
  backgroundColor: '#002855',
  color: 'White',
  fontSize: '20px',
  borderRadius: '5px'
};

const buttonArchivus = {
  position: 'relative',
  left: '10px',
  backgroundColor: '#002855',
  color: 'White',
  fontSize: '20px',
  borderRadius: '5px'
};

const buttonVolver = {
  position: 'absolute',
  bottom: '775px',
  left: '315px',
  backgroundColor: '#002855',
  color: 'White',
  borderRadius: '5px',
};

const buttonBorrar = {
  position: 'relative',
  bottom: '50px',
  left: '1000px',
  backgroundColor: '#EF3340',
  color: 'White',
  borderRadius: '5px',
};