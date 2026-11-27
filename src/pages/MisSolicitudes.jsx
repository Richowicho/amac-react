import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import EtiquetaEstatus from '../components/EtiquetaEstatus'
import Mensaje from '../components/Mensaje'

export default function MisSolicitudes() {
  const { sesion } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

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
    if (!window.confirm('¿Seguro que quieres cancelar esta solicitud?')) return // RF-006: pedir confirmación
    setError('')
    const { error: errorUpdate } = await supabase.from('solicitudes').update({ estatus: 'Cancelada' }).eq('id', solicitud.id)
    if (errorUpdate) {
      // La política RLS solo deja cancelar solicitudes "Enviada" o "En revisión"
      setError('No se pudo cancelar la solicitud. Puede que ya haya sido resuelta por la empresa.')
    }
    cargar()
  }

  return (
    <div className="contenedor pila">
      <h1>Mis solicitudes</h1>
      <p className="texto-grande texto-suave">Aquí ve a qué vacantes se postuló y cómo va cada una.</p>

      <Mensaje tipo="error">{error}</Mensaje>

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
                <EtiquetaEstatus valor={s.estatus} />
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
