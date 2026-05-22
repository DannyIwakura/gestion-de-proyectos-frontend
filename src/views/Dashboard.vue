<script setup>
</script>

<template>
  <section class="dashboard">

    <div class="welcome-card">

      <h1>Bienvenido al Portal de Gestión</h1>

      <p>
        Plataforma interna para la consulta y administración de proyectos,
        herramientas y servicios de la empresa.
      </p>

      <div class="info-grid">

        <div class="info-item">
          <h3>📊 Proyectos</h3>
          <p>Consulta el catálogo completo de proyectos activos.</p>
        </div>

        <div class="info-item">
          <h3>🔧 Herramientas</h3>
          <p>Explora las tecnologías utilizadas en la empresa.</p>
        </div>

        <div class="info-item">
          <h3>👥 Usuarios</h3>
          <p>Gestión de roles y permisos del sistema.</p>
        </div>

      </div>

    </div>

  </section>
</template>

<style scoped>

.dashboard {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.welcome-card {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  max-width: 900px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  text-align: center;
}

h1 {
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

p {
  color: #64748b;
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 16px;
}

.info-item h3 {
  margin-bottom: 0.5rem;
  color: #2563eb;
}

.info-item p {
  font-size: 0.9rem;
}

</style>