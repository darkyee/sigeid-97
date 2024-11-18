"use client"; //Para asegurarse que el componente va a correr del lado del cliente y no server
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import DesperfectosForm from '../components/DesperfectosForm'
import './style.css';

export default function reporteDesp() {

  const router = useRouter();
  const formRef = useRef(null)

  const LoadingSpinner = () => {
    return <div className="loader"></div>;
  };
  
  const LoadingMessage = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LoadingSpinner />
        <span style={{ marginLeft: '10px' }}>Cargando reportes...</span> {}
      </div>
    );
  };
  
  // Funcion para llevar a los detalles de esa fila si se le hace click
  const clickFila = (id) => {
    router.push(`./desperfectos/${id}`);
  };

  const [states, setStates] = useState([]);
  const [instalaciones, setAreas] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const llamarReportes = async () => {
    const reportResponse = await fetch('/api/administrador/');
    const stateResponse = await fetch('/api/administrador/estado/');
    const areaResponse = await fetch('/api/administrador/instalaciones/');
    const reportData = await reportResponse.json();
    const stateData = await stateResponse.json();
    const areaData = await areaResponse.json();
    setReports(reportData);
    setStates(stateData);
    setAreas(areaData);
    setLoading(false);
  };

  useEffect(() => {
      // Llamar al API
      llamarReportes();
  }, []);

  function mostrarFormulario() {
    if (formRef.current) {
        formRef.current.mostrarFormulario();
    }
  }
  
  if (loading) return <LoadingMessage />;

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

      <button onClick={mostrarFormulario} className='btn btn-primary buttonAgregar'>Agregar Desperfecto</button>
      <DesperfectosForm ref={formRef} onSubmit={llamarReportes} />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Asunto</th>
            <th style={headerStyle}>Instalación Afectada</th>
            <th style={headerStyle}>Fecha Reporte</th>
            <th style={headerStyle}>Estado Reporte</th>
            <th style={headerStyle}># de Archivus</th>
            <th style={headerStyle}>Descripcion</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id_reporte_desperfecto} className='table-row' onClick={() => clickFila(report.id_reporte_desperfecto)}> 
              <td style={{...cellStyle, fontWeight: 'bold'}} >{report.asunto}</td>
              <td style={cellStyle}>{instalacionesJson[report.instalacion_afectada]}</td>
              <td style={cellStyle}>{new Date(report.fecha_reporte).toLocaleString()}</td>
              <td style={cellStyle}>{estadosJson[report.estado_reporte]}</td>
              <td style={cellStyle}>{report.numero_reporte_archivus}</td>
              <td style={limitedCellStyle}>{report.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Style objects for table cells

const headerStyle = {
  padding: '10px',
  backgroundColor: '#f4f4f4',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
  fontWeight: 'bold',
};

const cellStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const limitedCellStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
  whiteSpace: 'nowrap',     // Hace que no siga mostrando hacia abajo
  overflow: 'hidden',       // Esconde el texto que sea muy largo
  textOverflow: 'ellipsis', // Añade los tres puntos al final, si se pasa
  maxWidth: '450px',        
};

const rowStyle = {
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  backgroundColor: '#fff',
};



