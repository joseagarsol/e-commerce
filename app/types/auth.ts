export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'customer'
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
}
