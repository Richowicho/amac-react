import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import TarjetaVacante from '../components/TarjetaVacante'
import CampoFormulario from '../components/CampoFormulario'
import Mensaje from '../components/Mensaje'

export default function ListadoVacantes() {
  const [vacantes, setVacantes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [horario, setHorario] = useState('')
  const [categoria, setCategoria] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Se vuelve a consultar cada vez que cambia la búsqueda o un filtro (por eso están en el arreglo de dependencias)
  useEffect(() => {
    async function cargar() {
      setCargando(true)
      setError('')
      let consulta = supabase
        .from('vacantes')
        .select('*, empresa:perfiles(nombre)') // JOIN con la empresa
        .eq('estado', 'activa') // RF-001: solo vacantes activas
        .order('creada_en', { ascending: false })

      // Se quitan comas y paréntesis para que no rompan el filtro .or() de PostgREST
      const termino = busqueda.trim().replace(/[,()]/g, ' ')
      if (termino) {
        consulta = consulta.or(`titulo.ilike.%${termino}%,ubicacion.ilike.%${termino}%`) // ilike = sin distinguir mayúsculas
      }
      if (horario) consulta = consulta.eq('horario', horario)
      if (categoria) consulta = consulta.eq('categoria', categoria)

      const { data, error: errorConsulta } = await consulta
      if (errorConsulta) {
        setError('No se pudieron cargar las vacantes. Intente de nuevo.')
        setVacantes([])
      } else {
        setVacantes(data)
      }
      setCargando(false)
    }
    cargar()
  }, [busqueda, horario, categoria])

  return (
    <div className="contenedor pila">
      <h1>Encuentre su próximo trabajo</h1>
      <p className="texto-grande texto-suave">Busque vacantes cerca de usted. Es fácil y gratis.</p>

      <form className="buscador" role="search" aria-label="Buscar vacantes" onSubmit={(e) => e.preventDefault()}>
        <CampoFormulario id="q" etiqueta="¿Qué trabajo busca?" type="search" placeholder="Ejemplo: recepcionista o Monterrey" autoComplete="off" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <CampoFormulario id="horario" etiqueta="Horario" como="select" value={horario} onChange={(e) => setHorario(e.target.value)}>
          <option value="">Cualquier horario</option>
          <option value="Matutino">Matutino</option>
          <option value="Vespertino">Vespertino</option>
          <option value="Medio tiempo">Medio tiempo</option>
          <option value="Fines de semana">Fines de semana</option>
        </CampoFormulario>
        <CampoFormulario id="categoria" etiqueta="Categoría" como="select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          <option value="Atención al cliente">Atención al cliente</option>
          <option value="Administración">Administración</option>
          <option value="Cocina y servicios">Cocina y servicios</option>
          <option value="Comercio">Comercio</option>
        </CampoFormulario>
      </form>

      <Mensaje tipo="error">{error}</Mensaje>
      {cargando && <p role="status">Cargando vacantes...</p>}

      {!cargando && !error && (
        <>
          <h2>{vacantes.length} {vacantes.length === 1 ? 'vacante encontrada' : 'vacantes encontradas'}</h2>
          {vacantes.length === 0 ? (
            <p className="texto-grande">No hay vacantes para mostrar.</p>
          ) : (
            <ul className="lista-vacantes">
              {vacantes.map((v) => (
                <TarjetaVacante key={v.id} vacante={v} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
