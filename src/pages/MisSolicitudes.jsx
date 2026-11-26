import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function MisSolicitudes() {
  const { sesion } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)

  async function cargar() {
    if (!sesion?.user.id) return
    setCargando(true)
    const { data } = await supabase
      .from('solicitudes')
      .select('id, estatus, creada_en, vacante:vacantes(id, titulo, empresa:perfiles(nombre))')
      .eq('candidato_id', sesion.user.id)
      .order('creada_en', { ascending: false })
    setSolicitudes(data || [])
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [sesion?.user.id])

  async function cancelar(solicitud) {
    if (!window.confirm('¿Seguro que quieres cancelar esta solicitud?')) return
    await supabase.from('solicitudes').update({ estatus: 'Cancelada' }).eq('id', solicitud.id)
    cargar()
  }

  function claseEstatus(estatus) {
    if (estatus === 'Aceptada') return 'etiqueta-estatus--aceptada'
    if (estatus === 'Rechazada' || estatus === 'Cancelada') return 'etiqueta-estatus--rechazada'
    return 'etiqueta-estatus--revision'
  }

  return (
    <div className="contenedor pila">
      <h1>Mis solicitudes</h1>
      <p className="texto-grande texto-suave">Aquí ve a qué vacantes se postuló y cómo va cada una.</p>

      {cargando ? (
        <p role="status">Cargando solicitudes...</p>
      ) : solicitudes.length === 0 ? (
        <p className="texto-grande">Aún no se ha postulado a ninguna vacante.</p>
      ) : (
        <ul className="lista-vertical">
          {solicitudes.map((s) => (
            <li key={s.id}>
              <article className="tarjeta-solicitud">
                <div className="tarjeta-solicitud__datos">
                  <h3>{s.vacante?.titulo}</h3>
                  <p className="tarjeta-solicitud__subtitulo">{s.vacante?.empresa?.nombre}</p>
                  <p className="texto-suave">
                    Postulada el {new Date(s.creada_en).toLocaleDateString('es-MX')}
                  </p>
                </div>
                <p className={`etiqueta-estatus ${claseEstatus(s.estatus)} tarjeta-solicitud__estatus`}>
                  <span className="solo-lectores">Estatus: </span>{s.estatus}
                </p>
                <div className="grupo-botones">
                  {s.vacante?.id && (
                    <Link className="boton boton--secundario" to={`/vacantes/${s.vacante.id}`}>
                      Ver vacante
                    </Link>
                  )}
                  {(s.estatus === 'Enviada' || s.estatus === 'En revisión') && (
                    <button className="boton boton--peligro" type="button" onClick={() => cancelar(s)}>
                      Cancelar solicitud
                    </button>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
