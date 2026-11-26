import { Link } from 'react-router-dom'

export default function TarjetaVacante({ vacante }) {
  return (
    <li>
      <article className="tarjeta-vacante">
        <h3>{vacante.titulo}</h3>
        <p className="tarjeta-vacante__empresa">{vacante.empresa?.nombre || 'Empresa registrada'}</p>
        <ul className="tarjeta-vacante__datos">
          <li><strong>Sueldo:</strong> ${Number(vacante.sueldo).toLocaleString('es-MX')} mensuales</li>
          <li><strong>Ubicación:</strong> {vacante.ubicacion}</li>
          <li><strong>Horario:</strong> {vacante.horario}</li>
        </ul>
        <ul className="etiquetas">
          <li className="etiqueta">{vacante.categoria}</li>
        </ul>
        <Link className="boton boton--secundario" to={`/vacantes/${vacante.id}`}>
          Ver detalles<span className="solo-lectores"> de {vacante.titulo}</span>
        </Link>
      </article>
    </li>
  )
}
