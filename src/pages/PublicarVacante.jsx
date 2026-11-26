import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function PublicarVacante() {
  const { sesion } = useAuth()
  const navigate = useNavigate()
  const [titulo, setTitulo] = useState('')
  const [sueldo, setSueldo] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [horario, setHorario] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [requisitos, setRequisitos] = useState('')
  const [prestaciones, setPrestaciones] = useState('')
  const [aceptaTelefono, setAceptaTelefono] = useState(false)
  const [telefonoContacto, setTelefonoContacto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function manejarPublicar(e) {
    e.preventDefault()
    setMensaje('')
    setCargando(true)
    const { error } = await supabase.from('vacantes').insert({
      empresa_id: sesion.user.id,
      titulo: titulo.trim(),
      sueldo: Number(sueldo),
      ubicacion: ubicacion.trim(),
      horario,
      categoria,
      descripcion: descripcion.trim(),
      requisitos: requisitos.trim(),
      prestaciones: prestaciones.trim(),
      telefono_contacto: aceptaTelefono ? telefonoContacto.trim() : null,
    })
    setCargando(false)
    if (error) {
      setMensaje(error.message)
    } else {
      navigate('/empresa/vacantes')
    }
  }

  return (
    <div className="contenedor pila centrado">
      <section className="panel formulario-ancho" aria-labelledby="h-pub">
        <Link className="enlace-volver" to="/empresa/vacantes">← Volver a mis vacantes</Link>
        <h1 id="h-pub">Publicar nueva vacante</h1>
        <p className="texto-grande texto-suave">Todos los campos con * son obligatorios.</p>

        {mensaje && <p role="alert" style={{ color: '#b00020', fontWeight: 600 }}>{mensaje}</p>}

        <form className="pila" onSubmit={manejarPublicar}>
          <fieldset className="grupo-campos">
            <legend>Información del puesto</legend>
            <div className="rejilla-campos">
              <div className="campo">
                <label htmlFor="titulo">Título del puesto <span aria-hidden="true">*</span></label>
                <input id="titulo" type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="sueldo">Sueldo mensual ($) <span aria-hidden="true">*</span></label>
                <input id="sueldo" type="number" min="1" step="0.01" required value={sueldo} onChange={(e) => setSueldo(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="ubicacion">Ubicación <span aria-hidden="true">*</span></label>
                <input id="ubicacion" type="text" placeholder="Ejemplo: Monterrey" required value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="horario">Horario <span aria-hidden="true">*</span></label>
                <select id="horario" required value={horario} onChange={(e) => setHorario(e.target.value)}>
                  <option value="">Elija un horario</option>
                  <option value="Matutino">Matutino</option>
                  <option value="Vespertino">Vespertino</option>
                  <option value="Medio tiempo">Medio tiempo</option>
                  <option value="Fines de semana">Fines de semana</option>
                </select>
              </div>
              <div className="campo campo--ancho">
                <label htmlFor="categoria">Categoría <span aria-hidden="true">*</span></label>
                <select id="categoria" required value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="">Elija una categoría</option>
                  <option value="Atención al cliente">Atención al cliente</option>
                  <option value="Administración">Administración</option>
                  <option value="Cocina y servicios">Cocina y servicios</option>
                  <option value="Comercio">Comercio</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset className="grupo-campos">
            <legend>Detalles</legend>
            <div className="rejilla-campos">
              <div className="campo campo--ancho">
                <label htmlFor="descripcion">Descripción del trabajo <span aria-hidden="true">*</span></label>
                <textarea id="descripcion" required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="requisitos">Requisitos <span aria-hidden="true">*</span></label>
                <textarea id="requisitos" required value={requisitos} onChange={(e) => setRequisitos(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="prestaciones">Prestaciones <span aria-hidden="true">*</span></label>
                <textarea id="prestaciones" required value={prestaciones} onChange={(e) => setPrestaciones(e.target.value)} />
              </div>
            </div>
          </fieldset>

          <div className="casilla">
            <input
              id="aceptaTelefono"
              type="checkbox"
              checked={aceptaTelefono}
              onChange={(e) => setAceptaTelefono(e.target.checked)}
            />
            <label htmlFor="aceptaTelefono">Permitir postulaciones por teléfono</label>
          </div>

          {aceptaTelefono && (
            <div className="campo">
              <label htmlFor="telefonoContacto">Teléfono de contacto <span aria-hidden="true">*</span></label>
              <input
                id="telefonoContacto"
                type="tel"
                required
                placeholder="81 0000 0000"
                value={telefonoContacto}
                onChange={(e) => setTelefonoContacto(e.target.value)}
              />
            </div>
          )}

          <div className="grupo-botones">
            <button className="boton boton--primario" type="submit" disabled={cargando}>
              {cargando ? 'Publicando...' : 'Publicar vacante'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
