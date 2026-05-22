# NavBar.vue
<script setup>
import { ref } from 'vue'

const menuAbierto = ref(false)

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">

      <!-- Logo / Nombre -->
      <div class="navbar-brand">
        <div class="logo">
          GP
        </div>

        <div class="brand-text">
          <h1>Gestión Proyectos</h1>
          <span>Portal Corporativo</span>
        </div>
      </div>

      <!-- Botón móvil -->
      <button class="mobile-button" @click="toggleMenu">
        ☰
      </button>

      <!-- Navegación -->
      <nav :class="['navbar-links', { open: menuAbierto }]">

        <RouterLink to="/" class="nav-link">
          Dashboard
        </RouterLink>

        <RouterLink to="/proyectos" class="nav-link">
          Proyectos
        </RouterLink>

        <RouterLink to="/herramientas" class="nav-link">
          Herramientas
        </RouterLink>

        <RouterLink to="/usuarios" class="nav-link">
          Usuarios
        </RouterLink>

      </nav>

      <!-- Usuario -->
      <div class="navbar-user">
        <div class="user-avatar">
          D
        </div>

        <div class="user-info">
          <span class="user-name">Administrador</span>
          <span class="user-role">ADMIN</span>
        </div>
      </div>

    </div>
  </header>
</template>

<style scoped>

/* ===== NAVBAR ===== */

.navbar {
  background-color: #1e293b;
  color: white;

  position: sticky;
  top: 0;
  z-index: 1000;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1400px;

  margin: 0 auto;
  padding: 0 2rem;

  height: 72px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ===== BRAND ===== */

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 42px;
  height: 42px;

  border-radius: 12px;

  background: linear-gradient(135deg, #3b82f6, #2563eb);

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  font-size: 1rem;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-text h1 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.brand-text span {
  font-size: 0.75rem;
  color: #cbd5e1;
}

/* ===== LINKS ===== */

.navbar-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: #e2e8f0;

  text-decoration: none;

  padding: 0.7rem 1rem;

  border-radius: 10px;

  transition: all 0.2s ease;

  font-size: 0.95rem;
  font-weight: 500;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
}

.router-link-active {
  background-color: #2563eb;
  color: white;
}

/* ===== USER ===== */

.navbar-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;

  border-radius: 50%;

  background-color: #2563eb;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.user-role {
  font-size: 0.75rem;
  color: #cbd5e1;
}

/* ===== MOBILE ===== */

.mobile-button {
  display: none;

  background: none;
  border: none;

  color: white;

  font-size: 1.5rem;

  cursor: pointer;
}

/* ===== RESPONSIVE ===== */

@media (max-width: 768px) {

  .navbar-container {
    padding: 1rem;
    height: auto;

    flex-wrap: wrap;
  }

  .mobile-button {
    display: block;
  }

  .navbar-links {
    width: 100%;

    display: none;

    flex-direction: column;
    align-items: flex-start;

    margin-top: 1rem;
  }

  .navbar-links.open {
    display: flex;
  }

  .nav-link {
    width: 100%;
  }

  .navbar-user {
    display: none;
  }
}

</style>