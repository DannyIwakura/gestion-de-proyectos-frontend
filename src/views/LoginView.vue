<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { login, verifyTotp, loginGoogle, isAuthenticated } = useAuth()
const router = useRouter()
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

if (isAuthenticated()) {
  router.push('/')
}

const step = ref('login')
const username = ref('')
const password = ref('')
const totpCode = ref('')
const preToken = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const result = await login(username.value, password.value)
    if (result.requiresTotp) {
        preToken.value = result.preToken
      step.value = 'totp'
    } else {
      router.push('/')
    }
  } catch (err) {
    error.value = err.response?.data || 'Credenciales inválidas'
  } finally {
    loading.value = false
  }
}

async function handleTotp() {
  error.value = ''
  loading.value = true
  try {
    await verifyTotp(preToken.value, Number(totpCode.value))
    router.push('/')
  } catch (err) {
    error.value = err.response?.data || 'Código inválido'
  } finally {
    loading.value = false
  }
}

    const callback = async (response) => {
  error.value = ''
  loading.value = true
  try {
    await loginGoogle(response.credential)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login-page">
    <div class="login-card">
      <div class="logo-container">
        <div class="logo">GP</div>
      </div>

      <h1>Gestión de Proyectos</h1>
      <p class="subtitle">
        Plataforma interna para gestión y seguimiento de aplicaciones corporativas.
      </p>

      <div v-if="error" class="error-message">{{ error }}</div>

      <!-- Step 1: Login -->
      <form v-if="step === 'login'" @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">Usuario</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Ingresa tu usuario"
            autocomplete="username"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            autocomplete="current-password"
            required
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <!-- Step 2: TOTP -->
      <div v-if="step === 'totp'">
        <p class="totp-info">
          Ingresa el código de 6 dígitos generado por la aplicación Google Authenticator.
        </p>

        <form @submit.prevent="handleTotp">
          <div class="input-group">
            <label for="totpCode">Código de verificación</label>
            <input
              id="totpCode"
              v-model="totpCode"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="000000"
              autocomplete="one-time-code"
              required
            />
          </div>

          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Verificando...' : 'Verificar' }}
          </button>
        </form>

        <button class="btn-link" @click="step = 'login'">
          Volver al inicio de sesión
        </button>
      </div>

      <div class="divider">
        <span>O continúa con</span>
      </div>

      <div class="login-button">
        <GoogleLogin :callback="callback" :client-id="googleClientId" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background-color: white;
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background-color: #2563eb;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
}

h1 {
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.subtitle {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.input-group {
  text-align: left;
  margin-bottom: 1.25rem;
}

.input-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.4rem;
}

.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.btn-primary {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 12px;
  background-color: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-link {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.btn-link:hover {
  text-decoration: underline;
}

.totp-info {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  color: #94a3b8;
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #e2e8f0;
}

.login-button {
  display: flex;
  justify-content: center;
}

@media (max-width: 500px) {
  .login-card {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.7rem;
  }
}
</style>
