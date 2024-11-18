import Link from 'next/link'

export default function InstalacionItem({ id_instalacion_deportiva, nombre, foto, descripcion, se_presta, disponibilidad_horario }) {

    foto = foto ?? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
    descripcion = descripcion ?? 'Sin descripción'

    return (
        <Link href={`/profesores/desperfectos/${id_instalacion_deportiva}`} style={{ textDecoration: 'none' }}>
            <div className="card">
                <img src={foto} className="card-img-top" alt={nombre} style={{ maxHeight: 200 }} />
                <div className="card-body">
                    <h5 className="card-title">{nombre}</h5>
                    <p className="card-text">{descripcion}</p>
                    <div className="d-grid gap-2">
                        <button className='btn btn-primary'>Ver reportes</button>
                    </div>
                </div>
            </div>
        </Link>
    )
}