-- 1. Crear la tabla de alimentos
create table foods (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  unidad text not null,
  porcion numeric not null,
  grupo text not null
);

-- 2. Habilitar Row Level Security (RLS)
alter table foods enable row level security;

-- 3. Crear políticas de seguridad
-- Política de Lectura: Cualquiera puede ver los alimentos (público)
create policy "Alimentos públicos"
on foods for select
to anon, authenticated
using (true);

-- Política de Escritura: Solo usuarios autenticados pueden insertar/actualizar/borrar
create policy "Solo admin modifica"
on foods for all
to authenticated
using (true)
with check (true);

-- 4. Insertar datos iniciales (Opcional)
insert into foods (nombre, unidad, porcion, grupo) values
('Manzana', 'pza', 1, 'Frutas'),
('Arroz cocido', 'taza', 0.25, 'Cereales s/G'),
('Pechuga de pollo', 'g', 30, 'AOA MBAG'),
('Aceite de oliva', 'cdita', 1, 'Grasas s/P'),
('Leche light', 'taza', 1, 'Leche descremada');
