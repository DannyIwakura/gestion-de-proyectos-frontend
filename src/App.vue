<script setup>
import NavBar from './components/NavBar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showLayout = computed(() => route.path !== '/login')
</script>

<template>
  <div class="app-layout">
    <NavBar v-if="showLayout" />

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
