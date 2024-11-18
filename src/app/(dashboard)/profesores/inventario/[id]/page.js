"use client";
import { useRouter, useParams } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import './style.css';

export default function DetallesDesperfecto() {
  const { id } = useParams(); // Toma el id dinamico de los parametros
  const router = useRouter();

  const [implemento, setImplemento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorNum, setErrorNum] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [cantidadChange, setCantidadChange] = useState(true);
  const [estado, setEstado] = useState('');
  const [aproximadoDepr, setAproximadoDepr] = useState('N/A');

  const clickVolver = () => {
    router.push(`./`);
  };

  const guardarCantidad = async () => {
    
    const resp = await fetch(`/api/profesores/inventario/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cantidad: cantidad }),
    });
    setCantidadChange(true);

  };

  const borrarImplemento = async () => {
    const resp = await fetch(`/api/profesores/inventario/${id}`, {method: 'DELETE'});
    clickVolver();
  };


  const handleCantidadChange = (e) => {
    if (!/^\d*$/.test(e.target.value)) {       //Regex check para solo aceptar numeros enteros
      setCantidadChange(true);
      setErrorNum(true);
    } else {
      setErrorNum(false);
      setCantidad(e.target.value);
      setCantidadChange(false);
    }
  };

  // Extrae la fecha sin el tiempo
  const formatearFecha = (fecha) => {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, "0");
        const day = String(fecha.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
  };

  const convertirMs = (ms) => {
    const msEnDia = 1000 * 60 * 60 * 24;
    const msEnAño = 1000 * 60 * 60 * 24 * 365;
    const msEnMes = 1000 * 60 * 60 * 24 * 30.44;
  
    const años = ms / msEnAño;
    const meses = ms / msEnMes;
    const dias = ms / msEnDia;
  
    if (años >= 1) {
      return `${años.toFixed(1)} año/s`;
    } else if (meses >= 1) {
      return `${meses.toFixed(1)} mes/es`;
    } else {
      return `${dias.toFixed(1)} dia/s`;
    }
  };

  const calcularEstado = (fechaInicial, fechaDepreciacion) => {
    
    const fechaInicio = new Date(fechaInicial);
    const fechaDepr = new Date(fechaDepreciacion);

    // Calcula el tiempo de depreciacion en ms
    const tiempoTotal = fechaDepr - fechaInicio;
    const hoy = new Date();

    const tiempoRestante = fechaDepr - hoy;
    setAproximadoDepr(convertirMs(tiempoRestante));
    const porcentaje = (tiempoRestante / tiempoTotal) * 100;

    if (porcentaje >= 50) {
        setEstado('Bueno');
    } else if (porcentaje > 25) {
        setEstado('Medio');
    } else {
        setEstado('Malo');
    }
    
  };

  const calcularNuevaFecha = (fechaInicial, fechaDepreciacion) => {
    const fechaInicio = new Date(fechaInicial);
    const fechaDepr = new Date(fechaDepreciacion);
    const hoy = new Date();
  
    const tiempoTotal = fechaDepr - fechaInicio;
    const fechaNueva = new Date(hoy.getTime() + tiempoTotal);
  
    return formatearFecha(fechaNueva);
  };

  const clickMantenimiento = async () => {

    let fechaNueva;

    if (implemento.primer_mantenimiento){
        fechaNueva = calcularNuevaFecha(implemento.ultima_fecha_depreciacion, implemento.fecha_depreciacion);
    } else {
        fechaNueva = calcularNuevaFecha(implemento.fecha_adquisicion, implemento.fecha_depreciacion);
    };

    calcularEstado(implemento.fechaDepreciacion, fechaNueva);

    const resp = await fetch(`/api/profesores/inventario/mantenimiento/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fecha_depreciacion: fechaNueva, ultima_fecha_depreciacion: implemento.fecha_depreciacion, primer_mantenimiento: true}),
      });

  };


  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/profesores/inventario/${id}`);
        if (!res.ok) {
          throw new Error('Error al solicitar');
        }
        const data = await res.json();
        setImplemento(data);
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
    if (implemento && implemento.fecha_adquisicion && implemento.fecha_depreciacion) {
        if (implemento.primer_mantenimiento){
            calcularEstado(implemento.ultima_fecha_depreciacion, implemento.fecha_depreciacion);
        } else {
            calcularEstado(implemento.fecha_adquisicion, implemento.fecha_depreciacion);
        }
        setCantidad(implemento.cantidad);
    }     
  }, [implemento]);

  if (loading) return <LoadingMessage />; 
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
        <button className='btn btn-primary' onClick={() => clickVolver()}>Volver</button>
        <h1 style={{ marginTop: '100px', marginBottom: '90px' }}>{implemento.descripcion}</h1>
        {implemento ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '35px', justifyContent: 'space-evenly'}}>
            <label style={{fontSize: '22px'}}><strong>Cantidad: </strong>
                <input style={{fontSize: '20px', width: '128px'}} type='text' value={cantidad} onChange={handleCantidadChange} placeholder='Cantidad'></input>
                <button style={{marginLeft: '5px'}}className='btn btn-primary' disabled={cantidadChange} onClick={guardarCantidad}>Guardar Cantidad</button>
                {errorNum && (
                <span style={{ color: '#d9534f', fontSize: '0.9em', marginLeft: '10px' }}>
                    Por favor, ingrese números solamente.
                </span>
                )}
            </label>
            <p><strong>Estado:</strong> {estado}</p>
            <p><strong>Tiempo Estimado de Depreciación:</strong> {aproximadoDepr}</p>
            <button className='btn btn-primary' style={{flex: '0 0 auto', alignSelf: 'flex-start', marginLeft: '100px'} } onClick={clickMantenimiento}>Mantenimiento Realizado</button>
        </div>
        ) : (
            <p>No se encontró el implemento.</p>
        )}
        
      {implemento.FotoInventario && implemento.FotoInventario.length > 0 && implemento.FotoInventario[0].foto ? (
            <div>
              <img
                src={implemento.FotoInventario[0].foto}
                alt="Foto del implemento"
                style={imagen}
              />
              <button style={{marginLeft: '992px', marginTop: '-560px'}} className='btn btn-danger' onClick={borrarImplemento}>Borrar Implemento</button>
            </div>
          ) : (
            <div>
              <p style={noDisp}>Imagen no Disponible</p>
              <button style={{marginLeft: '992px', marginTop: '-155px'}} className='btn btn-danger' onClick={borrarImplemento}>Borrar Implemento</button>
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
      <span style={{ marginLeft: '10px' }}>Cargando implemento...</span>
    </div>
  );
};

const imagen = {
  position: 'relative',
  bottom: '400px',
  left: '950px',
  width: '250px' 
};

const noDisp = {
    position: 'relative',
    bottom: '400px',
    left: '950px',
  };
