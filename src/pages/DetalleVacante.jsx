import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function DetalleVacante() {
  const { id } = useParams()
  const { sesion, perfil } = useAuth()
  const [vacante, setVacante] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [postulando, setPostulando] = useState(false)

  useEffect(() => {
    supabase
      .from('vacantes')
      .select('*, empresa:perfiles(nombre, giro)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setVacante(data)
        setCargando(false)
      })
  }, [id])

  async function postularme() {
    if (!sesion) {
      setMensaje('Inicie sesión como candidato para postularse.')
      return
    }
    setPostulando(true)
    setMensaje('')
    const { error } = await supabase
      .from('solicitudes')
      .insert({ vacante_id: vacante.id, candidato_id: sesion.user.id })
    setPostulando(false)

    if (error?.code === '23505') {
  setMensaje('Ya te postulaste a esta vacante.')
} else if (error?.code === '42501') {
  setMensaje('Tu registro aún no ha sido aprobado por AMAC o tu cuenta no es de candidato.')
} else if (error) {
  setMensaje(`Error al postularse: ${error.message}`)
} else {
  setMensaje('¡Listo! Tu solicitud fue enviada.')
}
  }

  if (cargando) return <div className="contenedor"><p role="status">Cargando detalles...</p></div>
  if (!vacante) return <div className="contenedor"><p>Vacante no encontrada.</p><Link to="/">Volver al inicio</Link></div>

  return (
    <div className="contenedor pila pila--estrecha">
      <Link className="enlace-volver" to="/">← Volver a las vacantes</Link>
      <h1>{vacante.titulo}</h1>
      <p className="texto-grande texto-suave">{vacante.empresa?.nombre} · {vacante.ubicacion}</p>
      <ul className="etiquetas" aria-label="Características de la vacante">
        <li className="etiqueta">{vacante.horario}</li>
        <li className="etiqueta">{vacante.categoria}</li>
      </ul>

      <div className="dos-columnas dos-columnas--lateral">
        <div className="pila pila--estrecha">
          <section className="pila pila--estrecha" aria-labelledby="h-trabajo">
            <h2 id="h-trabajo">¿Qué hará en este trabajo?</h2>
            <p className="texto-grande">{vacante.descripcion}</p>
          </section>
          <section className="pila pila--estrecha" aria-labelledby="h-requisitos">
            <h2 id="h-requisitos">Requisitos</h2>
            <p className="texto-grande" style={{ whiteSpace: 'pre-line' }}>{vacante.requisitos}</p>
          </section>
          <section className="pila pila--estrecha" aria-labelledby="h-prestaciones">
            <h2 id="h-prestaciones">Prestaciones</h2>
            <p className="texto-grande" style={{ whiteSpace: 'pre-line' }}>{vacante.prestaciones}</p>
          </section>
        </div>

        <aside className="panel lateral" aria-labelledby="h-resumen">
          <div className="grupo-botones grupo-botones--columna" style={{ order: 2 }}>
            {(!perfil || perfil.rol === 'candidato') && (
              <button
                className="boton boton--acento"
                type="button"
                onClick={postularme}
                disabled={postulando}
              >
                {postulando ? 'Enviando...' : 'Postularme a esta vacante'}
              </button>
            )}

            {vacante.telefono_contacto && (
              <a className="boton boton--secundario" href={`tel:${vacante.telefono_contacto}`}>
                Llamar a la empresa ({vacante.telefono_contacto})
              </a>
            )}

            {mensaje && (
              <p role="status" style={{ fontWeight: 600, marginTop: '0.5rem' }}>
                {mensaje}
              </p>
            )}
          </div>

          <div className="pila pila--estrecha" style={{ order: 1 }}>
            <h2 id="h-resumen">Resumen</h2>
            <dl className="lista-datos">
              <div className="dato"><dt>Sueldo</dt><dd>${Number(vacante.sueldo).toLocaleString('es-MX')} mensuales</dd></div>
              <div className="dato"><dt>Horario</dt><dd>{vacante.horario}</dd></div>
              <div className="dato"><dt>Lugar</dt><dd>{vacante.ubicacion}</dd></div>
              <div className="dato"><dt>Categoría</dt><dd>{vacante.categoria}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}
