import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Encabezado() {
  const { perfil } = useAuth()
  const navigate = useNavigate()

  async function cerrarSesion() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <>
      <a className="saltar-contenido" href="#principal">Saltar al contenido</a>
      <header className="encabezado">
        <div className="contenedor encabezado__fila">
          <Link className="logotipo" to="/" aria-label="AMAC, ir al inicio">
            <svg width="52" height="24" viewBox="0 0 52 24" fill="none" aria-hidden="true" focusable="false">
              <path d="M3 20H9L16 11L22 17L29 5L36 17L41 10L48 20" stroke="#FF815C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="logotipo__texto">AMAC</span>
          </Link>

          <a className="boton boton--ayuda" href="tel:+528100000000" aria-label="Llamar para ayuda">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#202945" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="texto-largo" aria-hidden="true">Llamar para ayuda</span>
            <span className="texto-corto" aria-hidden="true">Ayuda</span>
          </a>

          <nav className="navegacion" aria-label="Navegación principal">
            <ul>
              <li><NavLink to="/" end>Vacantes</NavLink></li>
              {perfil?.rol === 'candidato' && (
                <li><NavLink to="/mis-solicitudes">Mis solicitudes</NavLink></li>
              )}
              {perfil?.rol === 'empresa' && (
                <>
                  <li><NavLink to="/empresa/vacantes">Mis vacantes</NavLink></li>
                  <li><NavLink to="/empresa/publicar">Publicar vacante</NavLink></li>
                </>
              )}
              {!perfil ? (
                <>
                  <li><NavLink to="/login">Iniciar sesión</NavLink></li>
                  <li><NavLink to="/registro">Registrarme</NavLink></li>
                </>
              ) : (
                <li>
                  <button type="button" className="boton boton--secundario" onClick={cerrarSesion}>
                    Cerrar sesión ({perfil.nombre})
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}
