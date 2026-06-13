import type { User, LoginForm, RegisterForm } from '~/types/auth'

interface CheckEmailResponse {
  isFound: boolean
  user?: User
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function fetchUser() {
    try {
      const headers = useRequestHeaders(['cookie'])
      user.value = await $fetch<User>('/api/auth/me', {
        headers
      })
    } catch {
      user.value = null
    }
  }

  async function checkUserEmail(email: string) {
    const response = await $fetch<CheckEmailResponse>('/api/auth/email', {
      params: {
        email
      }
    })
    if (response.isFound) {
      return true
    }
    return false
  }

  async function login(fields: LoginForm) {
    user.value = await $fetch<User>('/api/auth/login', {
      method: 'POST',
      body: fields
    })
  }

  async function register(fields: RegisterForm) {
    user.value = await $fetch<User>('/api/auth/register', {
      method: 'POST',
      body: fields
    })
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
    } finally {
      user.value = null
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    fetchUser,
    login,
    register,
    logout,
    checkUserEmail
  }
})
