# Blueprint Maestro: Sistema de Gestión de Correduría de Seguros (SGDO)
**Estructura de UX y Workflow Lineal**

---

## 1. El Disparador: Modal de Inicio
Un botón global de **"Nueva Gestión"** despliega un modal con 3 opciones:
1. **Nuevo Cliente + Póliza**: Crea el perfil del cliente y su primer producto desde cero.
2. **Nueva Póliza (Cliente Existente)**: Busca un cliente en la base de datos y le añade un ramo nuevo.
3. **Renovación**: Busca una póliza vencida para clonarla (versión nueva) y aplicar depreciación.

---

## 2. Configuración Dinámica (Paso a Paso)

### A. Selección de Perfil (Cards)
Dos tarjetas visuales: **Persona Natural** o **Persona Jurídica**.
- Al elegir, el sistema precarga los campos básicos y define el primer nivel del checklist (ej. RUC para empresas, Cédula para personas).

### B. Selección de Ramo y Datos Técnicos
Dependiendo del Ramo elegido (SOA, Vehicular, Vida, etc.):
- **Campos Dinámicos**: Si es Vehicular, pide Placa/Chasis. Si es SOA, el precio se bloquea a valor fijo.
- **Lógica de Pagos**: Sección para elegir entre Pago de Contado o Plan de Cuotas (generando el calendario de pagos automáticamente).

---

## 3. Workflow de Digitalización (El Corazón del Sistema)

### Paso 1: El Checklist Previo
Antes de subir nada, el sistema te muestra el checklist basado en el Ramo y Perfil:
- Tú marcas con un **Check** los documentos que el cliente te entregó físicamente.
- **Campos de Alerta:** Aquí está tu solución. En el checklist, si el documento es "Vencible" (ej. Cédula), el sistema habilita un campo de **[Fecha de Vencimiento]**. Si no pones la fecha, no te deja avanzar. Así es como sacas las alertas después.

### Paso 2: Interfaz de Spliteo e Indexación
Una vez marcado el checklist, subes el archivo escaneado (PDF único) y se abre el editor:
1. **Visualización**: Miniaturas de todas las páginas del PDF con opción de Zoom.
2. **Edición**: Puedes eliminar páginas en blanco, rotar páginas o agregar nuevas páginas si te faltó algo.
3. **Asignación (Indexación)**: 
   - Seleccionas una página (o varias).
   - El sistema te despliega una lista basada únicamente en los ítems que marcaste en el **Checklist previo**.
   - Seleccionas: "Esta es la Cédula".
4. **Validación**: El ítem en el checklist cambia de estado a "Digitalizado ✅".

### Paso 3: Preview y Finalización
- El sistema muestra un resumen de los datos capturados y una galería de los documentos ya recortados.
- Al dar **"Confirmar y Emitir"**, se crea el registro en la base de datos, se archivan los archivos en su carpeta digital y se activan las alertas de cobro y vencimiento.

---

## 4. Sistema de Alertas (Vencimientos)
Para que esto funcione en tu base de datos:
1. **Tabla de Documentos**: Cada archivo guardado tiene una columna `fecha_vencimiento`.
2. **Lógica de Alertas**:
   - **Rojo**: `Hoy >= fecha_vencimiento`.
   - **Amarillo**: `fecha_vencimiento - Hoy <= 30 días`.
3. **Dashboard**: Tu tío verá un contador de "Documentos por Vencer" que le permitirá llamar al cliente para pedir la renovación antes de que expire.

---

## 5. Resumen de Flujo para el Demo
- **Entrada**: Datos -> Pagos.
- **Acción**: Marcar Checklist -> Subir PDF.
- **Proceso**: Cortar/Asignar páginas.
- **Salida**: Póliza Vigente + Historial Digital + Alertas de Vencimiento activas.



policies/
├── data/
│   └── policiesMock.ts      <-- Aquí metes la Hilux y el SOAS del Excel
├── types/
│   └── policy.types.ts      <-- Aquí defines si es Jurídico/Natural, Agente/G&M
├── hooks/
│   └── usePoliciesTable.ts  <-- Aquí va la lógica de búsqueda y filtros
├── components/
│   ├── PoliciesTable.tsx    <-- Aquí usas tu "CustomDataGrid"
│   ├── PolicyDetailDrawer.tsx <-- El Drawer que ya tienes (separado)
│   └── PolicyFilters.tsx    <-- El Select de G&M / Subagente
└── PoliciesView.tsx         <-- El "Director de Orquesta"

components/
  table/
    PoliciesTable.tsx
    policiesTableColumns.ts
    policiesTableActions.tsx

  filters/
    PolicyFilters.tsx

  drawer/
    PolicyDetailDrawer.tsx

  dialogs/
    CreatePolicyDialog.tsx
    RenewPolicyDialog.tsx