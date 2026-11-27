import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CampoFormulario from '../components/CampoFormulario'
import Mensaje from '../components/Mensaje'

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
  const [registrado, setRegistrado] = useState(null)

  async function manejarRegistro(e) {
    e.preventDefault()
    if (!terminos) {
      setMensaje('Debe aceptar los términos y el aviso de privacidad.')
      return
    }
    setMensaje('')
    setCargando(true)
    // Los datos extra viajan en options.data y el trigger crear_perfil() los guarda en "perfiles"
    const { data, error } = await supabase.auth.signUp({
      email: correo.trim(),
      password: clave,
      options: {
        data: { rol: 'candidato', nombre: nombre.trim(), telefono: telefono.trim(), edad: Number(edad), colonia: colonia.trim(), experiencia: experiencia.trim() },
      },
    })
    setCargando(false)
    if (error) {
      setMensaje(error.message)
    } else {
      // Si el proyecto pide confirmar el correo, todavía no hay sesión
      setRegistrado({ conSesion: Boolean(data?.session) })
    }
  }

  if (registrado) {
    return (
      <div className="contenedor pila centrado">
        <section className="panel formulario-angosto" aria-labelledby="h-ok">
          <h1 id="h-ok">¡Su cuenta fue creada!</h1>
          <p className="texto-grande">Para postularse a una vacante, AMAC primero debe aprobar su registro. Mientras tanto, puede ver todas las vacantes.</p>
          {!registrado.conSesion && <p className="texto-suave">Revise su correo: le enviamos un mensaje para confirmar su cuenta antes de iniciar sesión.</p>}
          <div className="grupo-botones grupo-botones--columna">
            <Link className="boton boton--primario" to="/">Ver vacantes</Link>
            {!registrado.conSesion && <Link className="boton boton--secundario" to="/login">Ir a iniciar sesión</Link>}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="contenedor pila centrado">
      <section className="panel formulario-ancho" aria-labelledby="h-reg">
        <h1 id="h-reg">Cree su cuenta</h1>
        <p className="texto-grande texto-suave">Llene sus datos para postularse a las vacantes. Los campos con * son obligatorios.</p>

        <Mensaje tipo="error">{mensaje}</Mensaje>

        <form className="pila" onSubmit={manejarRegistro}>
          <fieldset className="grupo-campos">
            <legend>Datos personales</legend>
            <div className="rejilla-campos">
              <CampoFormulario id="nombre" etiqueta="Nombre completo" requerido type="text" placeholder="Ejemplo: María Elena Gómez" autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <CampoFormulario id="edad" etiqueta="Edad" requerido type="number" min="18" max="120" value={edad} onChange={(e) => setEdad(e.target.value)} />
            </div>
          </fieldset>

          <fieldset className="grupo-campos">
            <legend>Contacto y ubicación</legend>
            <div className="rejilla-campos">
              <CampoFormulario id="correo" etiqueta="Correo electrónico" requerido type="email" placeholder="nombre@correo.com" autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
              <CampoFormulario id="telefono" etiqueta="Teléfono" requerido type="tel" placeholder="81 0000 0000" autoComplete="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              <CampoFormulario id="colonia" etiqueta="Colonia" requerido ancho type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} />
            </div>
          </fieldset>

          <fieldset className="grupo-campos">
            <legend>Experiencia</legend>
            <div className="rejilla-campos">
              <CampoFormulario id="experiencia" etiqueta="Cuéntenos en qué ha trabajado" requerido ancho como="textarea" value={experiencia} onChange={(e) => setExperiencia(e.target.value)} />
            </div>
          </fieldset>

          <fieldset className="grupo-campos">
            <legend>Su contraseña</legend>
            <div className="rejilla-campos">
              <CampoFormulario id="clave" etiqueta="Contraseña" requerido ancho ayuda="Mínimo 6 caracteres." type="password" minLength={6} autoComplete="new-password" value={clave} onChange={(e) => setClave(e.target.value)} />
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
