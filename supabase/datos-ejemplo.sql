-- =========================================================
-- AMAC · Datos de ejemplo (opcional, para llenar la demo)
-- Ejecutar en Supabase -> SQL Editor DESPUÉS de esquema.sql y
-- DESPUÉS de registrar al menos una empresa desde la app.
-- Inserta 8 vacantes a nombre de la primera empresa registrada.
-- Si todavía no hay ninguna empresa, no inserta nada.
-- (El SQL Editor se ejecuta con permisos de administrador, por eso no le afecta RLS.)
-- =========================================================
insert into public.vacantes
  (empresa_id, titulo, sueldo, ubicacion, horario, categoria,
   descripcion, requisitos, prestaciones, telefono_contacto, estado)
select e.id, v.titulo, v.sueldo, v.ubicacion, v.horario, v.categoria,
       v.descripcion, v.requisitos, v.prestaciones, v.telefono_contacto, v.estado
from (select id from public.perfiles where rol = 'empresa' order by creado_en limit 1) e
cross join (values
  ('Auxiliar de recepción'::text, 9500::numeric, 'San Pedro Garza García'::text, 'Medio tiempo'::text, 'Atención al cliente'::text,
   'Recibirá a las personas con amabilidad, contestará el teléfono y apoyará con el registro de entradas y salidas.'::text,
   E'Trato amable con las personas\nSaber leer y escribir'::text,
   E'Capacitación pagada\nSeguro médico'::text, '81 1234 5678'::text, 'activa'::text),
  ('Cajero(a) de tienda', 8200, 'Monterrey', 'Matutino', 'Comercio',
   'Cobrará en caja y ayudará a acomodar la mercancía.',
   E'Saber hacer cuentas básicas\nTrato amable',
   E'Descuento en compras\nComida en el trabajo', null, 'activa'),
  ('Guía de museo', 7800, 'Monterrey', 'Fines de semana', 'Atención al cliente',
   'Acompañará a los visitantes y les contará la historia de las salas.',
   E'Gusto por la historia\nBuen trato con el público',
   E'Entrada libre a exposiciones', '81 2345 6789', 'activa'),
  ('Apoyo administrativo', 10000, 'San Nicolás de los Garza', 'Medio tiempo', 'Administración',
   'Archivará documentos, atenderá llamadas y apoyará con el control de pagos.',
   E'Uso básico de computadora\nOrden y puntualidad',
   E'Horario flexible\nSeguro médico', null, 'activa'),
  ('Ayudante de cocina', 8800, 'Guadalupe', 'Matutino', 'Cocina y servicios',
   'Preparará ingredientes y mantendrá limpia el área de cocina.',
   E'Disposición para aprender\nPoder estar de pie varias horas',
   E'Comida incluida\nCapacitación pagada', '81 3456 7890', 'activa'),
  ('Atención telefónica', 9200, 'Monterrey', 'Vespertino', 'Atención al cliente',
   'Contestará llamadas de clientes y registrará sus datos.',
   E'Buena dicción\nPaciencia con las personas',
   E'Capacitación pagada\nSeguro médico', null, 'activa'),
  ('Encargado de bodega', 9800, 'Apodaca', 'Matutino', 'Comercio',
   'Recibirá mercancía, la acomodará y llevará el inventario.',
   E'Saber leer y escribir\nPoder cargar cajas ligeras',
   E'Seguro médico\nDespensa', null, 'activa'),
  ('Apoyo de limpieza', 7500, 'Santa Catarina', 'Vespertino', 'Cocina y servicios',
   'Mantendrá limpias las oficinas y las áreas comunes.',
   E'Responsabilidad\nPuntualidad',
   E'Transporte incluido', null, 'pausada')
) as v(titulo, sueldo, ubicacion, horario, categoria, descripcion, requisitos, prestaciones, telefono_contacto, estado);

-- ---------------------------------------------------------
-- Aprobar a un candidato (RF-054), cambiando el correo por el de su cuenta de prueba:
-- update public.perfiles set aprobado = true
--  where id = (select id from auth.users where email = 'candidato.aprobado@ejemplo.com');
-- ---------------------------------------------------------
