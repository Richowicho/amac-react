import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RegistroCandidato() {
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [colonia, setColonia] = useState('')
  const [experiencia, setExperiencia] = useState('')
  const [clave, setClave] = useState('')
  const [terminos, setTerminos] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function manejarRegistro(e) {
    e.preventDefault()
    if (!terminos) return
    setMensaje('')
    setCargando(true)
    const { error } = await supabase.auth.signUp({
      email: correo.trim(),
      password: clave,
      options: {
        data: {
          rol: 'candidato',
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          edad: Number(edad),
          colonia: colonia.trim(),
          experiencia: experiencia.trim(),
        },
      },
    })
    setCargando(false)
    if (error) {
      setMensaje(error.message)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="contenedor pila centrado">
      <section className="panel formulario-ancho" aria-labelledby="h-reg">
        <h1 id="h-reg">Cree su cuenta</h1>
        <p className="texto-grande texto-suave">Llene sus datos para postularse a las vacantes. Los campos con * son obligatorios.</p>

        {mensaje && <p role="alert" style={{ color: '#b00020', fontWeight: 600 }}>{mensaje}</p>}

        <form className="pila" onSubmit={manejarRegistro}>
          <fieldset className="grupo-campos">
            <legend>Datos personales</legend>
            <div className="rejilla-campos">
              <div className="campo">
                <label htmlFor="nombre">Nombre completo <span aria-hidden="true">*</span></label>
                <input id="nombre" type="text" placeholder="Ejemplo: María Elena Gómez" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="edad">Edad <span aria-hidden="true">*</span></label>
                <input id="edad" type="number" min="18" max="120" required value={edad} onChange={(e) => setEdad(e.target.value)} />
              </div>
            </div>
          </fieldset>

          <fieldset className="grupo-campos">
            <legend>Contacto y ubicación</legend>
            <div className="rejilla-campos">
              <div className="campo">
                <label htmlFor="correo">Correo electrónico <span aria-hidden="true">*</span></label>
                <input id="correo" type="email" placeholder="nombre@correo.com" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="telefono">Teléfono <span aria-hidden="true">*</span></label>
                <input id="telefono" type="tel" placeholder="81 0000 0000" required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
              <div className="campo campo--ancho">
                <label htmlFor="colonia">Colonia <span aria-hidden="true">*</span></label>
                <input id="colonia" type="text" required value={colonia} onChange={(e) => setColonia(e.target.value)} />
              </div>
            </div>
          </fieldset>

          <fieldset className="grupo-campos">
            <legend>Experiencia</legend>
            <div className="rejilla-campos">
              <div className="campo campo--ancho">
                <label htmlFor="experiencia">Cuéntenos en qué ha trabajado <span aria-hidden="true">*</span></label>
                <textarea id="experiencia" required value={experiencia} onChange={(e) => setExperiencia(e.target.value)} />
              </div>
            </div>
          </fieldset>

          <fieldset className="grupo-campos">
            <legend>Su contraseña</legend>
            <div className="rejilla-campos">
              <div className="campo campo--ancho">
                <label htmlFor="clave">Contraseña <span aria-hidden="true">*</span></label>
                <input id="clave" type="password" minLength={6} required value={clave} onChange={(e) => setClave(e.target.value)} />
              </div>
            </div>
          </fieldset>

          <div className="casilla">
            <input id="terminos" type="checkbox" required checked={terminos} onChange={(e) => setTerminos(e.target.checked)} />
            <label htmlFor="terminos">Acepto los términos y el aviso de privacidad <span aria-hidden="true">*</span></label>
          </div>

          <div className="grupo-botones">
            <button className="boton boton--primario" type="submit" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </button>
            <Link className="boton boton--secundario" to="/login">Ya tengo cuenta</Link>
          </div>
        </form>
      </section>
    </div>
  )
}
