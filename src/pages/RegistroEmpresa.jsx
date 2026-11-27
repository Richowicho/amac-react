import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CampoFormulario from '../components/CampoFormulario'
import Mensaje from '../components/Mensaje'

export default function RegistroEmpresa() {
  const [nombre, setNombre] = useState('')
  const [giro, setGiro] = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function manejarRegistro(e) {
    e.preventDefault()
    setMensaje('')
    setCargando(true)
    const { error } = await supabase.auth.signUp({
      email: correo.trim(),
      password: clave,
      options: { data: { rol: 'empresa', nombre: nombre.trim(), giro, telefono: telefono.trim() } },
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
      <section className="panel formulario-ancho" aria-labelledby="h-emp">
        <h1 id="h-emp">Registre su empresa</h1>
        <p className="texto-grande texto-suave">Publique vacantes y encuentre personal con experiencia. Los campos con * son obligatorios.</p>

        <Mensaje tipo="error">{mensaje}</Mensaje>

        <form className="pila" onSubmit={manejarRegistro}>
          <fieldset className="grupo-campos">
            <legend>Datos de la empresa</legend>
            <div className="rejilla-campos">
              <CampoFormulario id="empresa" etiqueta="Nombre de la empresa" requerido type="text" placeholder="Ejemplo: Hotel Casa Real" autoComplete="organization" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <CampoFormulario id="giro" etiqueta="Giro o sector" requerido como="select" value={giro} onChange={(e) => setGiro(e.target.value)}>
                <option value="">Elija una opción</option>
                <option value="Servicios">Servicios</option>
                <option value="Comercio">Comercio</option>
                <option value="Salud">Salud</option>
                <option value="Educación">Educación</option>
                <option value="Otro">Otro</option>
              </CampoFormulario>
              <CampoFormulario id="telefono" etiqueta="Teléfono" requerido type="tel" autoComplete="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              <CampoFormulario id="correo" etiqueta="Correo electrónico" requerido type="email" placeholder="empresa@correo.com" autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
              <CampoFormulario id="clave" etiqueta="Contraseña" requerido ancho ayuda="Mínimo 6 caracteres." type="password" minLength={6} autoComplete="new-password" value={clave} onChange={(e) => setClave(e.target.value)} />
            </div>
          </fieldset>

          <div className="grupo-botones">
            <button className="boton boton--primario" type="submit" disabled={cargando}>
              {cargando ? 'Registrando...' : 'Registrar mi empresa'}
            </button>
            <Link className="boton boton--secundario" to="/login">Ya tengo cuenta</Link>
          </div>
        </form>
      </section>
    </div>
  )
}
