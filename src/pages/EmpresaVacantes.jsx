import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import EtiquetaEstatus from '../components/EtiquetaEstatus'
import Mensaje from '../components/Mensaje'

export default function EmpresaVacantes() {
  const { sesion } = useAuth()
  const [vacantes, setVacantes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  async function cargar() {
    if (!sesion?.user.id) return
    setCargando(true)
    const { data } = await supabase
      .from('vacantes')
      .select('id, titulo, estado, creada_en, solicitudes(count)')
      .eq('empresa_id', sesion.user.id)
      .order('creada_en', { ascending: false })
    setVacantes(data || [])
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [sesion?.user.id])

  async function cambiarEstado(id, nuevoEstado) {
    setError('')
    const { error: errorUpdate } = await supabase.from('vacantes').update({ estado: nuevoEstado }).eq('id', id)
    if (errorUpdate) setError('No se pudo cambiar el estado de la vacante. Intente de nuevo.')
    cargar()
  }

  return (
    <div className="contenedor pila">
      <div className="grupo-botones" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="pila pila--estrecha" style={{ flex: '1 1 20rem' }}>
          <h1>Mis vacantes</h1>
          <p className="texto-grande texto-suave">Aquí publica y administra las vacantes de su empresa.</p>
        </div>
        <Link className="boton boton--acento" to="/empresa/publicar">Publicar nueva vacante</Link>
      </div>

      <Mensaje tipo="error">{error}</Mensaje>

      {cargando ? (
        <p role="status">Cargando vacantes...</p>
      ) : vacantes.length === 0 ? (
        <p className="texto-grande">Aún no ha publicado vacantes.</p>
      ) : (
        <ul className="lista-vertical">
          {vacantes.map((v) => {
            const totalSolicitudes = v.solicitudes?.[0]?.count ?? 0
            return (
              <li key={v.id}>
                <article className="tarjeta-solicitud">
                  <div className="tarjeta-solicitud__datos">
                    <h3>{v.titulo}</h3>
                    <p className="texto-suave">
                      Publicada el {new Date(v.creada_en).toLocaleDateString('es-MX')} · {totalSolicitudes} {totalSolicitudes === 1 ? 'solicitud' : 'solicitudes'}
                    </p>
                  </div>
                  <EtiquetaEstatus valor={v.estado} titulo="Estado" />
                  <div className="grupo-botones">
                    <Link className="boton boton--primario" to={`/empresa/vacantes/${v.id}/solicitudes`}>
                      Ver solicitudes
                    </Link>
                    {v.estado === 'activa' && (
                      <button className="boton boton--secundario" type="button" onClick={() => cambiarEstado(v.id, 'pausada')}>
                        Pausar
                      </button>
                    )}
                    {v.estado === 'pausada' && (
                      <button className="boton boton--secundario" type="button" onClick={() => cambiarEstado(v.id, 'activa')}>
                        Reactivar
                      </button>
                    )}
                    {v.estado !== 'cerrada' && (
                      <button className="boton boton--peligro" type="button" onClick={() => cambiarEstado(v.id, 'cerrada')}>
                        Cerrar
                      </button>
                    )}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
