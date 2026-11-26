import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import TarjetaVacante from '../components/TarjetaVacante'

export default function ListadoVacantes() {
  const [vacantes, setVacantes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [horario, setHorario] = useState('')
  const [categoria, setCategoria] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      let consulta = supabase
        .from('vacantes')
        .select('*, empresa:perfiles(nombre)')
        .eq('estado', 'activa')
        .order('creada_en', { ascending: false })

      if (busqueda.trim()) {
        consulta = consulta.or(`titulo.ilike.%${busqueda.trim()}%,ubicacion.ilike.%${busqueda.trim()}%`)
      }
      if (horario) consulta = consulta.eq('horario', horario)
      if (categoria) consulta = consulta.eq('categoria', categoria)

      const { data, error } = await consulta
      if (!error && data) setVacantes(data)
      setCargando(false)
    }
    cargar()
  }, [busqueda, horario, categoria])

  return (
    <div className="contenedor pila">
      <h1>Encuentre su próximo trabajo</h1>
      <p className="texto-grande texto-suave">Busque vacantes cerca de usted. Es fácil y gratis.</p>

      <form className="buscador" role="search" aria-label="Buscar vacantes" onSubmit={(e) => e.preventDefault()}>
        <div className="campo">
          <label htmlFor="q">¿Qué trabajo busca?</label>
          <input
            id="q"
            type="search"
            placeholder="Ejemplo: recepcionista o Monterrey"
            autoComplete="off"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="horario">Horario</label>
          <select id="horario" value={horario} onChange={(e) => setHorario(e.target.value)}>
            <option value="">Cualquier horario</option>
            <option value="Matutino">Matutino</option>
            <option value="Vespertino">Vespertino</option>
            <option value="Medio tiempo">Medio tiempo</option>
            <option value="Fines de semana">Fines de semana</option>
          </select>
        </div>
        <div className="campo">
          <label htmlFor="categoria">Categoría</label>
          <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            <option value="Atención al cliente">Atención al cliente</option>
            <option value="Administración">Administración</option>
            <option value="Cocina y servicios">Cocina y servicios</option>
            <option value="Comercio">Comercio</option>
          </select>
        </div>
      </form>

      {cargando && <p role="status">Cargando vacantes...</p>}

      {!cargando && (
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
