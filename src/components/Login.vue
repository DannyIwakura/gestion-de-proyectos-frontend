<script setup>
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const callback = async (response) => {

  try {

    // Token que devuelve Google
    const googleToken = response.credential

    // Enviamos token Google al backend
    const res = await api.post('/auth/google', {
      token: googleToken
    })

    // JWT generado por TU backend
    localStorage.setItem('token', res.data.token)

    // Datos usuario
    localStorage.setItem(
      'user',
      JSON.stringify({
        nombre: res.data.nombre,
        email: res.data.email,
        role: res.data.role
      })
    )

    // Redirección
    router.push('/dashboard')

  } catch (error) {

    console.error(error)

    alert('Error al iniciar sesión')
  }
}
</script>

<template>
  <div class="login-container">

    <h1>Iniciar sesión</h1>

    <GoogleLogin :callback="callback" />

  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>