# DashboardView.vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const proyectos = ref([])
const loading = ref(true)
const error = ref('')

const busqueda = ref('')
const filtroEstado = ref('TODOS')
const filtroTecnologia = ref('TODAS')

const obtenerProyectos = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/public/proyectos')

    proyectos.value = response.data
  }
  catch (err) {
    error.value = 'Error al cargar los proyectos'
    console.error(err)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  obtenerProyectos()
})

const tecnologiasDisponibles = computed(() => {

  const tecnologias = proyectos.value.flatMap(
    proyecto => proyecto.tecnologias
  )

  return [...new Set(tecnologias)]
})

const proyectosFiltrados = computed(() => {

  return proyectos.value.filter(proyecto => {

    const coincideBusqueda = proyecto.nombre
      .toLowerCase()
      .includes(busqueda.value.toLowerCase())

    const coincideEstado =
      filtroEstado.value === 'TODOS' ||
      proyecto.estado === filtroEstado.value

    const coincideTecnologia =
      filtroTecnologia.value === 'TODAS' ||
      proyecto.tecnologias.includes(filtroTecnologia.value)

    return (
      coincideBusqueda &&
      coincideEstado &&
      coincideTecnologia
    )
  })
})

const obtenerClaseEstado = (estado) => {

  switch (estado) {

    case 'PRODUCCION':
      return 'estado-produccion'

    case 'DESARROLLO':
      return 'estado-desarrollo'

    case 'MANTENIMIENTO':
      return 'estado-mantenimiento'

    default:
      return ''
  }
}
</script>

<template>

  <section class="dashboard">

    <!-- HEADER -->

    <div class="dashboard-header">

      <div>
        <h1>Catálogo de Proyectos</h1>

        <p>
          Gestión interna de herramientas y aplicaciones corporativas.
        </p>
      </div>

      <div class="dashboard-stats">

        <div class="stat-card">
          <span class="stat-number">
            {{ proyectos.length }}
          </span>

          <span class="stat-label">
            Proyectos
          </span>
        </div>

      </div>

    </div>

    <!-- FILTROS -->

    <div class="filtros-container">

      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar proyecto..."
        class="buscador"
      >

      <select
        v-model="filtroEstado"
        class="select-filtro"
      >
        <option value="TODOS">Todos los estados</option>
        <option value="PRODUCCION">Producción</option>
        <option value="DESARROLLO">Desarrollo</option>
        <option value="MANTENIMIENTO">Mantenimiento</option>
      </select>

      <select
        v-model="filtroTecnologia"
        class="select-filtro"
      >
        <option value="TODAS">Todas las tecnologías</option>

        <option
          v-for="tecnologia in tecnologiasDisponibles"
          :key="tecnologia"
          :value="tecnologia"
        >
          {{ tecnologia }}
        </option>

      </select>

    </div>

    <!-- LOADING -->

    <div v-if="loading" class="estado-mensaje">
      Cargando proyectos...
    </div>

    <!-- ERROR -->

    <div v-else-if="error" class="estado-error">
      {{ error }}
    </div>

    <!-- GRID -->

    <div v-else class="proyectos-grid">

      <article
        v-for="proyecto in proyectosFiltrados"
        :key="proyecto.id"
        class="proyecto-card"
      >

        <div class="card-header">

          <h2>
            {{ proyecto.nombre }}
          </h2>

          <span
            class="estado-badge"
            :class="obtenerClaseEstado(proyecto.estado)"
          >
            {{ proyecto.estado }}
          </span>

        </div>

        <p class="descripcion">
          {{ proyecto.descripcion }}
        </p>

        <div class="tecnologias">

          <span
            v-for="tecnologia in proyecto.tecnologias"
            :key="tecnologia"
            class="tag"
          >
            {{ tecnologia }}
          </span>

        </div>

      </article>

    </div>

  </section>

</template>

<style scoped>

.dashboard {
  padding: 2rem;
}

/* ===== HEADER ===== */

.dashboard-header {

  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 2rem;

  gap: 2rem;
}

.dashboard-header h1 {

  font-size: 2rem;
  font-weight: 700;

  color: #1e293b;

  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: #64748b;
}

.stat-card {

  background-color: white;

  border-radius: 18px;

  padding: 1rem 1.5rem;

  box-shadow: 0 4px 14px rgba(0,0,0,0.05);

  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 1.7rem;
  font-weight: bold;
  color: #2563eb;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
}

/* ===== FILTROS ===== */

.filtros-container {

  display: flex;
  gap: 1rem;

  flex-wrap: wrap;

  margin-bottom: 2rem;
}

.buscador,
.select-filtro {

  background-color: white;

  border: 1px solid #cbd5e1;

  border-radius: 12px;

  padding: 0.9rem 1rem;

  font-size: 0.95rem;

  min-width: 220px;

  outline: none;

  transition: border-color 0.2s ease;
}

.buscador:focus,
.select-filtro:focus {
  border-color: #2563eb;
}

/* ===== GRID ===== */

.proyectos-grid {

  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(320px, 320px));

  gap: 1.5rem;
}

/* ===== CARD ===== */

.proyecto-card {

  background-color: white;

  border-radius: 20px;

  padding: 1.5rem;

  box-shadow: 0 6px 20px rgba(0,0,0,0.05);

  transition: transform 0.2s ease;
}

.proyecto-card:hover {
  transform: translateY(-4px);
}

.card-header {

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 1rem;

  margin-bottom: 1rem;
}

.card-header h2 {
  color: #1e293b;
  font-size: 1.2rem;
}

.descripcion {

  color: #64748b;

  margin-bottom: 1.5rem;

  line-height: 1.5;
}

/* ===== TAGS ===== */

.tecnologias {

  display: flex;
  gap: 0.5rem;

  flex-wrap: wrap;
}

.tag {

  background-color: #eff6ff;

  color: #2563eb;

  padding: 0.45rem 0.8rem;

  border-radius: 999px;

  font-size: 0.8rem;
  font-weight: 600;
}

/* ===== ESTADOS ===== */

.estado-badge {

  padding: 0.45rem 0.8rem;

  border-radius: 999px;

  font-size: 0.75rem;
  font-weight: 700;

  color: white;
}

.estado-produccion {
  background-color: #22c55e;
}

.estado-desarrollo {
  background-color: #eab308;
}

.estado-mantenimiento {
  background-color: #94a3b8;
}

/* ===== MENSAJES ===== */

.estado-mensaje,
.estado-error {

  background-color: white;

  padding: 2rem;

  border-radius: 18px;

  text-align: center;
}

.estado-error {
  color: #dc2626;
}

/* ===== RESPONSIVE ===== */

@media (max-width: 768px) {

  .dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filtros-container {
    flex-direction: column;
  }

  .buscador,
  .select-filtro {
    width: 100%;
  }
}

</style>