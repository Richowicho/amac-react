// Campo de formulario con etiqueta visible (nunca solo placeholder).
// Sirve para input, select y textarea con la propiedad "como".
export default function CampoFormulario({ id, etiqueta, requerido = false, ayuda, ancho = false, como: Control = 'input', children, ...resto }) {
  const idAyuda = ayuda ? `${id}-ayuda` : undefined
  return (
    <div className={ancho ? 'campo campo--ancho' : 'campo'}>
      <label htmlFor={id}>
        {etiqueta}
        {requerido ? <> <span aria-hidden="true">*</span></> : null}
      </label>
      <Control id={id} required={requerido} aria-describedby={idAyuda} {...resto}>
        {children}
      </Control>
      {ayuda ? <p className="campo__ayuda" id={idAyuda}>{ayuda}</p> : null}
    </div>
  )
}
