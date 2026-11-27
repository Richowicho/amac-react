// Etiqueta de color para el estatus de una solicitud o el estado de una vacante.
const TIPOS = {
  Enviada: 'revision', 'En revisión': 'revision', Aceptada: 'aceptada', Rechazada: 'rechazada', Cancelada: 'rechazada',
  activa: 'activa', pausada: 'revision', cerrada: 'cerrada',
}

export default function EtiquetaEstatus({ valor, titulo = 'Estatus' }) {
  const tipo = TIPOS[valor] || 'revision'
  return (
    <p className={`etiqueta-estatus etiqueta-estatus--${tipo} tarjeta-solicitud__estatus`}>
      <span className="solo-lectores">{titulo}: </span>
      {valor}
    </p>
  )
}
