<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="app-layout">

    <NavBar />

    <Dashboard />

    <main class="main-content">
      <router-view />
    </main>

  </div>
</template>

<style scoped>

.app-layout {
  min-height: 100vh;
  background-color: #f4f6f9;
}

.main-content {
  padding: 2rem;
}

</style>