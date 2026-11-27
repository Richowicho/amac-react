# AMAC · Plataforma de empleo (React + Supabase + Vercel)

AMAC (asociAMayores A.C.) es una bolsa de trabajo pensada para personas adultas mayores. Esta es la **Entrega 3 (final)** del proyecto OT2026-WEB: el HTML y CSS de la Entrega 2 ahora es una aplicación React conectada a una base de datos real en Supabase y publicada en Vercel.

- **Sitio publicado:** https://amac-react-alpha.vercel.app
- **Diseño en Figma:** https://www.figma.com/design/HhhZoudePl9a0XC1QkL7iF
- **Video de la presentación:** _(pegar enlace)_
- **Diapositivas:** _(pegar enlace)_

## Integrantes

| Integrante | Qué hizo |
|---|---|
| _(nombre)_ | _(por ejemplo: base de datos y políticas RLS)_ |
| _(nombre)_ | _(por ejemplo: flujo del candidato)_ |
| _(nombre)_ | _(por ejemplo: flujo de la empresa)_ |
| _(nombre)_ | _(por ejemplo: despliegue, README y video)_ |

## Tecnologías

- **React 19** con **Vite**, **React Router** (rutas y rutas protegidas) y Context API (sesión).
- **Supabase**: Auth (usuarios), PostgreSQL y Row Level Security (RLS).
- **Vercel**: despliegue continuo desde GitHub, con HTTPS.
- HTML semántico y CSS propio (sin Bootstrap ni Tailwind), con variables CSS tomadas de Figma.

## Cómo correrlo en tu computadora

Necesitas Node.js 20 o superior.

```bash
git clone https://github.com/Richowicho/amac-react.git
cd amac-react
npm install
cp .env.example .env.local     # y llena tus valores (ver abajo)
npm run dev                    # abre http://localhost:5173
```

El archivo `.env.local` lleva la URL y la *publishable key* de tu proyecto de Supabase (Project Settings → API Keys):

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

`.env.local` no se sube a GitHub. Nunca se usa la llave `service_role` / secret en el código. La *publishable key* sí puede ir en el navegador porque la protección real la hacen las políticas RLS.

Para crear la base de datos, ejecuta `supabase/esquema.sql` en Supabase → SQL Editor. Si quieres vacantes de ejemplo, ejecuta después `supabase/datos-ejemplo.sql` (después de registrar una empresa).

## Estructura del código

```
src/
├── main.jsx            punto de entrada (BrowserRouter + AuthProvider)
├── App.jsx             definición de rutas
├── lib/supabase.js     cliente de Supabase
├── context/            AuthContext: quién está conectado y con qué rol
├── components/         Encabezado, Pie, TarjetaVacante, EtiquetaEstatus,
│                       CampoFormulario, Mensaje, RutaProtegida
├── pages/              ListadoVacantes, DetalleVacante, Login, RegistroCandidato,
│                       RegistroEmpresa, MisSolicitudes, EmpresaVacantes,
│                       PublicarVacante, SolicitudesRecibidas
└── styles/             variables, base, layout y componentes (de la Entrega 2)
```

`vercel.json` hace que rutas como `/mis-solicitudes` sigan funcionando al recargar la página (si no, Vercel buscaría un archivo que no existe y daría 404).

## Base de datos

Tres tablas relacionadas: `perfiles` (un perfil por usuario de Auth), `vacantes` (de una empresa) y `solicitudes` (de un candidato a una vacante).

```
auth.users 1───1 perfiles 1───* vacantes 1───* solicitudes *───1 perfiles (candidato)
```

> **Pendiente:** pega aquí la captura del diagrama (Supabase → Database → Schema Visualizer).

Reglas que protege la base de datos (no solo la pantalla):

- `unique (vacante_id, candidato_id)`: nadie se postula dos veces a la misma vacante (RF-004).
- `check` en horario, estado, estatus, sueldo > 0 y edad entre 18 y 120.
- Un trigger (`crear_perfil`) crea el perfil automáticamente al registrarse.

### Políticas RLS (qué hace cada una)

| Tabla | Política | Para qué sirve |
|---|---|---|
| perfiles | Cada quien ve su perfil | Solo puedes leer tus propios datos. |
| perfiles | Todos ven los perfiles de empresas | Para mostrar el nombre de la empresa en cada vacante. |
| perfiles | La empresa ve a quien aplicó a sus vacantes | Una empresa ve los datos de sus candidatos, y solo de ellos. |
| perfiles | Cada quien edita su perfil | Solo puedes editar el tuyo; además `rol` y `aprobado` no se pueden cambiar (permisos por columna). |
| vacantes | Ver vacantes activas o las propias | El público solo ve las `activa`; la empresa ve todas las suyas. |
| vacantes | El candidato sigue viendo las vacantes a las que aplicó | Aunque la empresa la pause, el candidato no pierde su historial (RF-021). |
| vacantes | Solo empresas publican, a su nombre | Un candidato no puede publicar ni hacerlo a nombre de otra empresa. |
| vacantes | La empresa edita sus vacantes | Pausar, reactivar y cerrar solo sobre las propias. |
| solicitudes | Candidato ve las suyas; empresa ve las de sus vacantes | Nadie ve solicitudes ajenas. |
| solicitudes | Solo candidatos aprobados se postulan | Si no estás aprobado por AMAC (RF-054), la base rechaza el insert. |
| solicitudes | Candidato cancela si no está resuelta | Solo desde "Enviada" o "En revisión", y solo a "Cancelada". |
| solicitudes | Empresa cambia el estatus | Solo en sus vacantes y solo a En revisión, Aceptada o Rechazada. |

La ruta protegida de React solo **esconde pantallas**. La seguridad real está en estas políticas: aunque alguien manipule el navegador, PostgreSQL no entrega ni modifica datos ajenos.

## Cuentas de prueba

> **Pendiente:** llena estas cuentas (créalas en la app y aprueba al candidato desde Supabase → Table Editor → `perfiles` → `aprobado = true`).

| Rol | Correo | Contraseña |
|---|---|---|
| Candidato aprobado | _(correo)_ | _(contraseña)_ |
| Candidato sin aprobar | _(correo)_ | _(contraseña)_ |
| Empresa | _(correo)_ | _(contraseña)_ |

## Requerimientos implementados

Estado según el código del repositorio. Revisa la columna antes de entregar.

| Funcionalidad | RF | Estado |
|---|---|---|
| Listado de vacantes desde la BD (solo activas) | RF-001 | ✅ |
| Búsqueda por palabra clave y filtros de horario y categoría | RF-002, RF-007 | ✅ |
| Detalle de vacante con botón "Llamar" solo si hay teléfono | RF-003, RF-051 | ✅ |
| Registro de candidato con términos obligatorios | RF-011, RF-012, RF-013 | ✅ |
| Inicio y cierre de sesión con error genérico | RF-008, RF-009 | ✅ |
| Postularme (solo aprobados, sin duplicar, con confirmación) | RF-004, RF-054 | ✅ |
| Mis solicitudes y cancelar con confirmación | RF-005, RF-006 | ✅ |
| Registro de empresa (versión simplificada) | RF-015 | ✅ |
| Publicar vacante con validaciones y teléfono opcional | RF-019 | ✅ |
| Mis vacantes con conteo de solicitudes, pausar, reactivar, cerrar | RF-020, RF-021 | ✅ |
| Solicitudes recibidas y cambio de estatus | RF-022, RF-024 | ✅ |
| Rutas protegidas por rol + RLS | RF-010 | ✅ |
| Aprobación de candidatos (desde Table Editor) | RF-054 | 🟡 manual, sin panel de administrador |
| Panel de administrador, editar perfil, logo, favoritas, recuperar contraseña | Extra | ❌ pendiente |

## Accesibilidad y responsivo

Se mantiene lo de la Entrega 2: texto de 18 px o más en `rem`, contraste mínimo 4.5:1, botones de 44 px o más (52 px), etiquetas visibles en todos los campos, foco visible, enlace "Saltar al contenido", un solo `h1` por página, `lang="es"` y sin scroll horizontal de 320 a 1440 px.

## Despliegue en Vercel

1. Cada `git push` a `main` publica una versión nueva; cada Pull Request genera una URL de vista previa.
2. Vercel detecta Vite solo (build: `npm run build`, salida: `dist`).
3. Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` se configuran en Vercel → Settings → Environment Variables. Si cambian, hay que hacer *Redeploy*.
4. En Supabase → Authentication → URL Configuration, la *Site URL* es la URL de Vercel.

## Qué cambiamos en esta revisión

- Componentes reutilizables nuevos: `EtiquetaEstatus` (antes repetido en 3 páginas), `CampoFormulario` y `Mensaje`.
- Mensaje al registrarse: avisa que AMAC debe aprobar al candidato antes de postularse.
- Los botones de cancelar, pausar/cerrar y cambiar estatus ahora muestran un error si la base de datos rechaza el cambio.
- La búsqueda limpia comas y paréntesis para no romper la consulta.
- Se quitaron los archivos sobrantes de la plantilla de Vite y se agregó favicon y `.env.example`.
