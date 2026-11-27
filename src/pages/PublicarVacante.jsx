import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import CampoFormulario from '../components/CampoFormulario'
import Mensaje from '../components/Mensaje'

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
      // El teléfono solo se guarda si la empresa eligió postulaciones por teléfono (RF-019)
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

        <Mensaje tipo="error">{mensaje}</Mensaje>

        <form className="pila" onSubmit={manejarPublicar}>
          <fieldset className="grupo-campos">
            <legend>Información del puesto</legend>
            <div className="rejilla-campos">
              <CampoFormulario id="titulo" etiqueta="Título del puesto" requerido type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              <CampoFormulario id="sueldo" etiqueta="Sueldo mensual ($)" requerido type="number" min="1" step="0.01" value={sueldo} onChange={(e) => setSueldo(e.target.value)} />
              <CampoFormulario id="ubicacion" etiqueta="Ubicación" requerido type="text" placeholder="Ejemplo: Monterrey" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
              <CampoFormulario id="horario" etiqueta="Horario" requerido como="select" value={horario} onChange={(e) => setHorario(e.target.value)}>
                <option value="">Elija un horario</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Medio tiempo">Medio tiempo</option>
                <option value="Fines de semana">Fines de semana</option>
              </CampoFormulario>
              <CampoFormulario id="categoria" etiqueta="Categoría" requerido ancho como="select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Elija una categoría</option>
                <option value="Atención al cliente">Atención al cliente</option>
                <option value="Administración">Administración</option>
                <option value="Cocina y servicios">Cocina y servicios</option>
                <option value="Comercio">Comercio</option>
              </CampoFormulario>
            </div>
          </fieldset>

          <fieldset className="grupo-campos">
            <legend>Detalles</legend>
            <div className="rejilla-campos">
              <CampoFormulario id="descripcion" etiqueta="Descripción del trabajo" requerido ancho como="textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
              <CampoFormulario id="requisitos" etiqueta="Requisitos" requerido como="textarea" value={requisitos} onChange={(e) => setRequisitos(e.target.value)} />
              <CampoFormulario id="prestaciones" etiqueta="Prestaciones" requerido como="textarea" value={prestaciones} onChange={(e) => setPrestaciones(e.target.value)} />
            </div>
          </fieldset>

          <div className="casilla">
            <input id="aceptaTelefono" type="checkbox" checked={aceptaTelefono} onChange={(e) => setAceptaTelefono(e.target.checked)} />
            <label htmlFor="aceptaTelefono">Permitir postulaciones por teléfono</label>
          </div>

          {aceptaTelefono && (
            <CampoFormulario id="telefonoContacto" etiqueta="Teléfono de contacto" requerido type="tel" placeholder="81 0000 0000" value={telefonoContacto} onChange={(e) => setTelefonoContacto(e.target.value)} />
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
