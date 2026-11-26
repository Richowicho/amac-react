import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
      options: {
        data: {
          rol: 'empresa',
          nombre: nombre.trim(),
          giro,
          telefono: telefono.trim(),
        },
      },
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

        {mensaje && <p role="alert" style={{ color: '#b00020', fontWeight: 600 }}>{mensaje}</p>}

        <form className="pila" onSubmit={manejarRegistro}>
          <fieldset className="grupo-campos">
            <legend>Datos de la empresa</legend>
            <div className="rejilla-campos">
              <div className="campo">
                <label htmlFor="empresa">Nombre de la empresa <span aria-hidden="true">*</span></label>
                <input id="empresa" type="text" placeholder="Ejemplo: Hotel Casa Real" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="giro">Giro o sector <span aria-hidden="true">*</span></label>
                <select id="giro" required value={giro} onChange={(e) => setGiro(e.target.value)}>
                  <option value="">Elija una opción</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Comercio">Comercio</option>
                  <option value="Salud">Salud</option>
                  <option value="Educación">Educación</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="campo">
                <label htmlFor="telefono">Teléfono <span aria-hidden="true">*</span></label>
                <input id="telefono" type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="correo">Correo electrónico <span aria-hidden="true">*</span></label>
                <input id="correo" type="email" placeholder="empresa@correo.com" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
              </div>
              <div className="campo campo--ancho">
                <label htmlFor="clave">Contraseña <span aria-hidden="true">*</span></label>
                <input id="clave" type="password" minLength={6} required value={clave} onChange={(e) => setClave(e.target.value)} />
              </div>
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
