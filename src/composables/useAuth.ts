import { ref } from 'vue'
import api from '../services/api'

export interface User {
  nombre: string
  email: string
  role: string
}

const token = ref<string | null>(localStorage.getItem('token'))
const user = ref<User | null>(
  JSON.parse(localStorage.getItem('user') || 'null'),
)

function saveToken(newToken: string | null) {
  token.value = newToken
  if (newToken) {
    localStorage.setItem('token', newToken)
  } else {
    localStorage.removeItem('token')
  }
}

function saveUser(newUser: User | null) {
  user.value = newUser
  if (newUser) {
    localStorage.setItem('user', JSON.stringify(newUser))
  } else {
    localStorage.removeItem('user')
  }
}

export function useAuth() {
  async function login(username: string, password: string) {
    const res = await api.post('/auth/login', { username, password })
    const data = res.data as { requiresTotp: boolean; preToken?: string; token?: string }
    if (!data.requiresTotp && data.token) {
      saveToken(data.token)
    }
    return data
  }

  async function verifyTotp(preToken: string, totpCode: number) {
    const res = await api.post('/auth/totp/verify', { preToken, totpCode })
    const data = res.data as { token: string }
    saveToken(data.token)
    return data
  }

  async function loginGoogle(googleToken: string) {
    const res = await api.post('/auth/google', { token: googleToken })
    saveToken(res.data.token)
    saveUser({ nombre: res.data.nombre, email: res.data.email, role: res.data.role })
  }

  async function setupTotp() {
    const res = await api.post('/auth/totp/setup')
    return res.data as { secret: string; qrCodeUri: string }
  }

  async function enableTotp(totpCode: number) {
    await api.post('/auth/totp/enable', { totpCode })
  }

  async function disableTotp(totpCode: number) {
    await api.post('/auth/totp/disable', { totpCode })
  }

  function logout() {
    saveToken(null)
    saveUser(null)
  }

  function isAuthenticated() {
    return token.value !== null
  }

  return {
    token,
    user,
    login,
    verifyTotp,
    loginGoogle,
    setupTotp,
    enableTotp,
    disableTotp,
    logout,
    isAuthenticated,
  }
}
