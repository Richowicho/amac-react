import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import EtiquetaEstatus from '../components/EtiquetaEstatus'
import Mensaje from '../components/Mensaje'

export default function SolicitudesRecibidas() {
  const { id } = useParams()
  const [solicitudes, setSolicitudes] = useState([])
  const [tituloVacante, setTituloVacante] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  async function cargar() {
    setCargando(true)
    const { data: vac } = await supabase.from('vacantes').select('titulo').eq('id', id).single()
    if (vac) setTituloVacante(vac.titulo)

    const { data } = await supabase
      .from('solicitudes')
      .select('id, estatus, creada_en, candidato:perfiles(nombre, edad, colonia, experiencia)')
      .eq('vacante_id', id)
      .neq('estatus', 'Cancelada')
      .order('creada_en', { ascending: false })
    setSolicitudes(data || [])
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [id])

  async function actualizarEstatus(solicitudId, nuevoEstatus) {
    setError('')
    const { error: errorUpdate } = await supabase.from('solicitudes').update({ estatus: nuevoEstatus }).eq('id', solicitudId)
    if (errorUpdate) setError('No se pudo cambiar el estatus. Intente de nuevo.')
    cargar()
  }

  return (
    <div className="contenedor pila">
      <Link className="enlace-volver" to="/empresa/vacantes">← Volver a mis vacantes</Link>
      <h1>Solicitudes recibidas</h1>
      {tituloVacante && <p className="texto-grande texto-suave">Vacante: {tituloVacante}</p>}

      <Mensaje tipo="error">{error}</Mensaje>

      {cargando ? (
        <p role="status">Cargando candidatos...</p>
      ) : solicitudes.length === 0 ? (
        <p className="texto-grande">Aún no hay solicitudes para esta vacante.</p>
      ) : (
        <ul className="lista-vertical">
          {solicitudes.map((s) => (
            <li key={s.id}>
              <article className="tarjeta-solicitud">
                <div className="tarjeta-solicitud__datos">
                  <h3>{s.candidato?.nombre}</h3>
                  <p className="tarjeta-solicitud__subtitulo">
                    {s.candidato?.edad} años · Col. {s.candidato?.colonia}
                  </p>
                  <p className="texto-grande">{s.candidato?.experiencia}</p>
                  <p className="texto-suave">Recibida el {new Date(s.creada_en).toLocaleDateString('es-MX')}</p>
                </div>
                <EtiquetaEstatus valor={s.estatus} />
                <div className="grupo-botones">
                  <button className="boton boton--secundario" type="button" onClick={() => actualizarEstatus(s.id, 'En revisión')}>
                    En revisión
                  </button>
                  <button className="boton boton--primario" type="button" onClick={() => actualizarEstatus(s.id, 'Aceptada')}>
                    Aceptada
                  </button>
                  <button className="boton boton--peligro" type="button" onClick={() => actualizarEstatus(s.id, 'Rechazada')}>
                    Rechazada
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
