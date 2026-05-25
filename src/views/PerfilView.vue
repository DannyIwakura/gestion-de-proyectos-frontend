<script setup>
import { ref } from 'vue'
import QRCode from 'qrcode'
import { useAuth } from '../composables/useAuth'

const { user, setupTotp, enableTotp, disableTotp } = useAuth()

const qrCodeDataUrl = ref('')
const secret = ref('')
const setupCode = ref('')
const disableCode = ref('')
const setupStep = ref('idle')
const loading = ref(false)
const message = ref('')
const error = ref('')

function cancelSetup() {
  setupStep.value = 'idle'
  secret.value = ''
  qrCodeDataUrl.value = ''
  setupCode.value = ''
}

async function handleSetup() {
  error.value = ''
  message.value = ''
  loading.value = true
  try {
    const result = await setupTotp()
    secret.value = result.secret
    qrCodeDataUrl.value = await QRCode.toDataURL(result.qrCodeUri, {
      width: 200,
      margin: 2,
    })
    setupStep.value = 'secret'
  } catch (err) {
    error.value = err.response?.data || 'Error al generar código'
  } finally {
    loading.value = false
  }
}

async function handleEnable() {
  error.value = ''
  message.value = ''
  loading.value = true
  try {
    await enableTotp(Number(setupCode.value))
    setupStep.value = 'enabled'
    message.value = 'Autenticación de dos factores activada correctamente.'
  } catch (err) {
    error.value = err.response?.data || 'Código inválido'
  } finally {
    loading.value = false
  }
}

async function handleDisable() {
  error.value = ''
  message.value = ''
  loading.value = true
  try {
    await disableTotp(Number(disableCode.value))
    setupStep.value = 'idle'
    secret.value = ''
    qrCodeDataUrl.value = ''
    setupCode.value = ''
    disableCode.value = ''
    message.value = 'Autenticación de dos factores desactivada.'
  } catch (err) {
    error.value = err.response?.data || 'Código inválido'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="perfil">
    <div class="card">
      <h1>Mi Perfil</h1>

      <div v-if="user" class="user-info">
        <div class="info-row">
          <span class="label">Email:</span>
          <span>{{ user.email || '—' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Rol:</span>
          <span class="role-badge">{{ user.role }}</span>
        </div>
      </div>

      <hr class="divider" />

      <h2>Autenticación de Dos Factores (2FA)</h2>
      <p class="description">
        Usa la aplicación Google Authenticator para generar códigos de verificación
        temporales al iniciar sesión.
      </p>

      <div v-if="message" class="success-message">{{ message }}</div>
      <div v-if="error" class="error-message">{{ error }}</div>

      <!-- TOTP: Not configured -->
      <div v-if="setupStep === 'idle'">
        <button class="btn-primary" @click="handleSetup" :disabled="loading">
          {{ loading ? 'Generando...' : 'Configurar 2FA' }}
        </button>
      </div>

      <!-- TOTP: Secret generated, waiting for verification -->
      <div v-if="setupStep === 'secret'" class="totp-setup">
        <div class="qr-section">
          <p class="step-title">1. Escanea el código QR con Google Authenticator</p>
          <div class="qr-wrapper">
            <img :src="qrCodeDataUrl" alt="QR Code" />
          </div>
          <p class="or-text">O ingresa manualmente esta clave:</p>
          <div class="secret-box">{{ secret }}</div>
        </div>

        <div class="verify-section">
          <p class="step-title">2. Ingresa el código de 6 dígitos para verificar</p>
          <input
            v-model="setupCode"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="000000"
            class="code-input"
          />
          <button class="btn-primary" @click="handleEnable" :disabled="loading || setupCode.length !== 6">
            {{ loading ? 'Verificando...' : 'Activar 2FA' }}
          </button>
        </div>

        <button class="btn-link" @click="cancelSetup">
          Cancelar
        </button>
      </div>

      <!-- TOTP: Enabled -->
      <div v-if="setupStep === 'enabled'">
        <div class="totp-enabled">
          <div class="enabled-badge">✓ 2FA activado</div>

          <p class="description">
            Para desactivarlo, ingresa un código válido de Google Authenticator.
          </p>
          <input
            v-model="disableCode"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="000000"
            class="code-input"
          />
          <button class="btn-danger" @click="handleDisable" :disabled="loading || disableCode.length !== 6">
            {{ loading ? 'Desactivando...' : 'Desactivar 2FA' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.perfil {
  max-width: 600px;
  margin: 0 auto;
}

.card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

h1 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.15rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.description {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.user-info {
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.label {
  font-weight: 600;
  color: #475569;
  min-width: 60px;
}

.role-badge {
  background: #dbeafe;
  color: #2563eb;
  padding: 0.15rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.5rem 0;
}

.success-message {
  background: #f0fdf4;
  color: #16a34a;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  background-color: #2563eb;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  background-color: #dc2626;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-link {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.btn-link:hover {
  text-decoration: underline;
}

.totp-setup {
  margin-top: 1rem;
}

.qr-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.step-title {
  font-weight: 600;
  color: #334155;
  margin-bottom: 1rem;
}

.qr-wrapper {
  display: inline-block;
  padding: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.qr-wrapper img {
  width: 180px;
  height: 180px;
  image-rendering: pixelated;
}

.or-text {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.secret-box {
  display: inline-block;
  background: #f1f5f9;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  letter-spacing: 2px;
  color: #334155;
  word-break: break-all;
}

.verify-section {
  text-align: center;
  margin-bottom: 1rem;
}

.code-input {
  width: 160px;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 4px;
  margin-bottom: 1rem;
}

.code-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.totp-enabled {
  text-align: center;
}

.enabled-badge {
  display: inline-block;
  background: #dcfce7;
  color: #16a34a;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}
</style>
