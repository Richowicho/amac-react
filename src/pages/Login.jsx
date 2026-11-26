import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function manejarLogin(e) {
    e.preventDefault()
    setMensaje('')
    setCargando(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password: clave,
    })
    setCargando(false)
    if (error) {
      setMensaje('Correo o contraseña incorrectos.')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="contenedor pila centrado">
      <section className="panel formulario-angosto" aria-labelledby="h-login">
        <h1 id="h-login">Iniciar sesión</h1>
        <p className="texto-grande texto-suave">Escriba su correo y su contraseña para entrar.</p>

        {mensaje && <p role="alert" style={{ color: '#b00020', fontWeight: 600 }}>{mensaje}</p>}

        <form className="pila pila--estrecha" onSubmit={manejarLogin}>
          <div className="campo">
            <label htmlFor="correo">Correo electrónico <span aria-hidden="true">*</span></label>
            <input
              id="correo"
              type="email"
              autoComplete="email"
              placeholder="nombre@correo.com"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="clave">Contraseña <span aria-hidden="true">*</span></label>
            <input
              id="clave"
              type="password"
              autoComplete="current-password"
              required
              aria-describedby="clave-ayuda"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
            <p className="campo__ayuda" id="clave-ayuda">Use la contraseña que eligió al registrarse.</p>
          </div>
          <button className="boton boton--primario boton--bloque" type="submit" disabled={cargando}>
            {cargando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <hr style={{ width: '100%', border: 0, borderTop: '2px solid var(--color-linea)' }} />
        <h2>¿Es su primera vez aquí?</h2>
        <div className="grupo-botones grupo-botones--columna">
          <Link className="boton boton--secundario" to="/registro">Crear mi cuenta de candidato</Link>
          <Link className="boton boton--secundario" to="/registro-empresa">Soy una empresa: registrar mi empresa</Link>
        </div>
      </section>
    </div>
  )
}
