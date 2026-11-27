import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CampoFormulario from '../components/CampoFormulario'
import Mensaje from '../components/Mensaje'

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
    const { error } = await supabase.auth.signInWithPassword({ email: correo.trim(), password: clave })
    setCargando(false)
    if (error) {
      // Mensaje genérico a propósito: no se dice si falló el correo o la contraseña (RF-008)
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

        <Mensaje tipo="error">{mensaje}</Mensaje>

        <form className="pila pila--estrecha" onSubmit={manejarLogin}>
          <CampoFormulario id="correo" etiqueta="Correo electrónico" requerido type="email" autoComplete="email" placeholder="nombre@correo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          <CampoFormulario id="clave" etiqueta="Contraseña" requerido ayuda="Use la contraseña que eligió al registrarse." type="password" autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} />
          <button className="boton boton--primario boton--bloque" type="submit" disabled={cargando}>
            {cargando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <hr className="separador" />
        <h2>¿Es su primera vez aquí?</h2>
        <div className="grupo-botones grupo-botones--columna">
          <Link className="boton boton--secundario" to="/registro">Crear mi cuenta de candidato</Link>
          <Link className="boton boton--secundario" to="/registro-empresa">Soy una empresa: registrar mi empresa</Link>
        </div>
      </section>
    </div>
  )
}
