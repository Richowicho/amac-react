# AMAC · Plataforma de empleo

Este es nuestro proyecto final de OT2026-WEB. La idea es una bolsa de trabajo para AMAC (asociAMayores A.C.), una asociación que ayuda a personas adultas mayores a conseguir empleo. Las empresas publican vacantes y los candidatos se postulan desde la misma página.

Empezamos con el diseño en Figma, después lo hicimos en HTML y CSS (Entrega 2), y ahora lo pasamos a React con una base de datos de verdad en Supabase. Está publicado en Vercel.

- Sitio: https://amac-react-alpha.vercel.app
- Figma: https://www.figma.com/design/HhhZoudePl9a0XC1QkL7iF
- Video: _(falta pegar el enlace)_
- Diapositivas: _(falta pegar el enlace)_

## Equipo

| Integrante | Qué hizo |
|---|---|
| Ricardo Baker Suárez | Arregló los códigos e implementó Supabase. |
| Jeongwon Kim | Hizo los códigos de la 2.ª entrega y ayudó a mejorar el código. |
| Rafael Castillo Urrutia | Implementó los valores entre el sitio y Supabase, y arregló Vercel. |

## Qué usamos

React con Vite, React Router para las páginas y Context para saber quién inició sesión. Para los usuarios y la base de datos usamos Supabase (Auth, PostgreSQL y RLS), y para publicar el sitio, Vercel. El CSS lo escribimos nosotros, sin Bootstrap ni Tailwind, usando los colores y tamaños que sacamos de Figma.

## Para correrlo en tu compu

Necesitas Node 20 o más nuevo.

```bash
git clone https://github.com/Richowicho/amac-react.git
cd amac-react
npm install
cp .env.example .env.local
npm run dev
```

Abre http://localhost:5173. Antes de eso, llena `.env.local` con los datos de tu proyecto de Supabase (están en Project Settings → API Keys):

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

Ese archivo no se sube a GitHub. Nunca usamos la llave `service_role` en el código; solo la publishable, que sí puede ir en el navegador porque la seguridad real la hacen las políticas RLS.

Para crear las tablas, copia `supabase/esquema.sql` en Supabase → SQL Editor y ejecútalo. Si quieres vacantes de ejemplo, primero registra una empresa en la app y luego ejecuta `supabase/datos-ejemplo.sql`.

## Cómo está el código

```
src/
├── main.jsx            punto de entrada
├── App.jsx             las rutas
├── lib/supabase.js     conexión a Supabase
├── context/            AuthContext (quién está conectado y su rol)
├── components/         Encabezado, Pie, TarjetaVacante, EtiquetaEstatus,
│                       CampoFormulario, Mensaje, RutaProtegida
├── pages/              una por cada pantalla (listado, detalle, login,
│                       registros, mis solicitudes, publicar vacante, etc.)
└── styles/             el CSS de la Entrega 2
```

`vercel.json` está para que al recargar una ruta como `/mis-solicitudes` no salga error 404.

## Base de datos

Tenemos tres tablas: `perfiles` (uno por usuario), `vacantes` (las publica una empresa) y `solicitudes` (cuando un candidato se postula a una vacante).

```
auth.users 1───1 perfiles 1───* vacantes 1───* solicitudes *───1 perfiles (candidato)
```

> Falta pegar aquí la captura del diagrama (Supabase → Database → Schema Visualizer).

Hay reglas que revisa la base de datos y no solo la pantalla. Por ejemplo, nadie puede postularse dos veces a la misma vacante (`unique (vacante_id, candidato_id)`), el sueldo tiene que ser mayor a 0 y la edad estar entre 18 y 120. También hay un trigger, `crear_perfil`, que crea el perfil solo cuando alguien se registra.

### Políticas RLS

| Tabla | Política | Qué hace |
|---|---|---|
| perfiles | Cada quien ve su perfil | Solo lees tus propios datos. |
| perfiles | Todos ven los perfiles de empresas | Para poder mostrar el nombre de la empresa en cada vacante. |
| perfiles | La empresa ve a quien aplicó a sus vacantes | Solo ve a sus candidatos, a nadie más. |
| perfiles | Cada quien edita su perfil | Solo el tuyo, y no puedes cambiar `rol` ni `aprobado`. |
| vacantes | Ver activas o las propias | El público solo ve las activas; la empresa ve todas las suyas. |
| vacantes | El candidato ve las vacantes a las que se postuló | Aunque la empresa la pause, no pierdes tu historial. |
| vacantes | Solo empresas publican, a su nombre | Un candidato no puede publicar nada. |
| vacantes | La empresa edita sus vacantes | Pausar, reactivar y cerrar, solo las suyas. |
| solicitudes | Cada quien ve las suyas | El candidato las suyas y la empresa las de sus vacantes. |
| solicitudes | Solo candidatos aprobados se postulan | Si AMAC no te aprobó, la base rechaza la solicitud. |
| solicitudes | El candidato cancela si no está resuelta | Solo desde "Enviada" o "En revisión". |
| solicitudes | La empresa cambia el estatus | Solo en sus vacantes y solo a En revisión, Aceptada o Rechazada. |

Las rutas protegidas de React solo esconden pantallas. Lo que de verdad protege los datos son estas políticas, así que aunque alguien le mueva al navegador, PostgreSQL no le da datos de otros.

## Cuentas de prueba

Falta llenar esto. Las cuentas se crean desde la app, y al candidato hay que aprobarlo a mano en Supabase → Table Editor → `perfiles` → `aprobado = true`.

| Rol | Correo | Contraseña |
|---|---|---|
| Candidato aprobado | _(correo)_ | _(contraseña)_ |
| Candidato sin aprobar | _(correo)_ | _(contraseña)_ |
| Empresa | _(correo)_ | _(contraseña)_ |

## Qué hace y qué no

Ya funciona:

- Ver las vacantes activas, buscar por palabra y filtrar por horario y categoría.
- Ver el detalle de una vacante (el botón "Llamar" solo sale si tiene teléfono).
- Registrarse como candidato o como empresa, iniciar y cerrar sesión.
- Postularse (solo si AMAC te aprobó y sin repetir), ver mis solicitudes y cancelarlas.
- Para empresas: publicar vacantes, pausarlas, reactivarlas o cerrarlas, ver las solicitudes que llegan y cambiarles el estatus.
- Rutas protegidas según el rol, más RLS en la base de datos.

Lo que todavía no:

- Aprobar candidatos se hace a mano desde Supabase, no tenemos panel de administrador.
- Tampoco hicimos editar perfil, subir logo, vacantes favoritas ni recuperar contraseña.

## Accesibilidad

Como la gente que usa AMAC son adultos mayores, cuidamos que se lea bien: texto de 18 px o más, buen contraste (mínimo 4.5:1), botones grandes (52 px), etiquetas visibles en todos los campos, foco visible al navegar con teclado y un enlace para saltar al contenido. Probamos que no salga scroll horizontal de 320 a 1440 px.

## Vercel

Cada `git push` a `main` publica una versión nueva. Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` se ponen en Vercel → Settings → Environment Variables, y si se cambian hay que hacer Redeploy. En Supabase → Authentication → URL Configuration, la Site URL tiene que ser la de Vercel.

## Cambios de la última revisión

- Creamos tres componentes para no repetir código: `EtiquetaEstatus` (estaba copiado en tres páginas), `CampoFormulario` y `Mensaje`.
- Al registrarse, el candidato ve un aviso de que AMAC lo tiene que aprobar antes de postularse.
- Si la base rechaza un cambio (cancelar, pausar, cerrar, cambiar estatus), ahora se muestra el error.
- La búsqueda ya no se rompe con comas ni paréntesis.
- Quitamos archivos que sobraban de la plantilla de Vite y agregamos favicon y `.env.example`.

Usamos Claude para ayudarnos a organizar nuestra reporte del README.
