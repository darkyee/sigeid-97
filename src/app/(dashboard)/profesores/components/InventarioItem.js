import Link from 'next/link'
import { useEffect, useState } from 'react';


export default function InventarioItem({ id_implemento, descripcion, cantidad: initialCantidad, fecha_adquisicion, fecha_depreciacion, ultima_fecha_depreciacion, primer_mantenimiento, area, FotoInventario }) {

    var foto = FotoInventario?.[0]?.foto ?? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

    const [cantidad, setCantidad] = useState(initialCantidad);
    const [actualizar, setActualizar] = useState(false);
    const [sinImplemento, setSinImplemento] = useState(initialCantidad==0);

    const handleSuma = () => {
        setCantidad((prev) => prev + 1);
        setActualizar(true);
    };

    const handleResta = () => {
        setCantidad((prev) => (prev > 0 ? prev - 1 : 0));
        setActualizar(true);
    };

    const actualizarCantidad = async (cantidadNueva) => {
        await fetch(`/api/profesores/inventario/${id_implemento}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cantidad: cantidadNueva }),
          });
    }

    useEffect(() => {
        if (cantidad === 0) {
            setSinImplemento(true);
        } else {
            setSinImplemento(false);
        }
    }, [cantidad]);

    useEffect(() => {
        if (actualizar) {
            const delayDebounce = setTimeout(() => {  //Esta funcion se encarga de esperar el tiempo en ms para hacer la actualzacion de la DB hasta que el usuario deje de hacer clicks.
                actualizarCantidad(cantidad);
                setActualizar(false);
            }, 1500); // Espera en ms

            return () => clearTimeout(delayDebounce);
        }
    }, [cantidad, actualizar]);
    
    return (
            <div className="card" >
                <Link href={`/profesores/inventario/${id_implemento}`} style={{ textDecoration: 'none' }}>
                    <img src={foto} className="card-img-top" style={{ maxHeight: 200, objectFit: 'cover' }} />
                </Link>
                <div className="card-body">
                    <h5 className="card-title" style={{textAlign: 'center'}}>{descripcion}</h5>
                    <p className="card-text" style={{textAlign: 'center'}}>Cantidad: {cantidad}</p>
                    <div className='d-flex gap-3'>
                        <button className='btn btn-outline-danger' style={{ marginLeft: 55, width: '70px' }} onClick={handleResta} disabled={sinImplemento}>-1</button>
                        <button className='btn btn-outline-primary' style={{ width: '70px' }} onClick={handleSuma}>+1</button>
                    </div>
                </div>
            </div>
    )
}