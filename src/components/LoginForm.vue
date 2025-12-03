<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Добро пожаловать</h1>
          <p class="auth-subtitle">Войдите в свой аккаунт</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              :class="{ 'form-input-error': fieldErrors.email }"
              placeholder="example@domain.com"
              :disabled="isLoading"
              required
            />
            <FieldError :error="fieldErrors.email" />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Пароль</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              :class="{ 'form-input-error': fieldErrors.password }"
              placeholder="Введите пароль"
              :disabled="isLoading"
              required
            />
            <FieldError :error="fieldErrors.password" />
          </div>

          <div class="form-footer">
            <!-- <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe" class="checkbox-input" :disabled="isLoading" />
              <span class="checkbox-text">Запомнить меня</span>
            </label> -->
            <a href="#" class="forgot-link">Забыли пароль?</a>
          </div>

          <button type="submit" class="auth-btn" :disabled="isLoading">
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>
        </form>

        <div class="auth-switch">
          <span class="auth-switch-text">Нет аккаунта?</span>
          <router-link to="/register" class="auth-switch-link">
            Зарегистрироваться
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FieldError from './FieldError.vue'
import { handleApiError } from '../utils/errorHandler.js'

const email = ref('')
const password = ref('')
// const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const fieldErrors = ref({})

const emit = defineEmits(['login-success'])

const handleLogin = async () => {
  errorMessage.value = ''
  fieldErrors.value = {}
  isLoading.value = true

  try {
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()
    console.log('response: ',data)

    if (!response.ok) {
      const errorInfo = await handleApiError(response, data)
      errorMessage.value = errorInfo.generalError
      fieldErrors.value = errorInfo.fieldErrors
      return
    }

    emit('login-success', { email: email.value })
  } catch (error) {
    errorMessage.value = 'Произошла ошибка при входе'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.auth-container {
  width: 100%;
  max-width: 440px;
}

.auth-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-none);
  padding: var(--spacing-3xl);
  box-shadow: var(--shadow-md);
  animation: fadeInUp 0.4s ease;
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.auth-title {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.02em;
}

.auth-subtitle {
  font-size: 15px;
  color: var(--color-text-secondary);
  font-weight: 400;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.error-message {
  padding: 14px 16px;
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
  border-radius: var(--radius-none);
  font-size: 14px;
  font-weight: 500;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  color: var(--color-text-primary);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-none);
  transition: all 0.2s ease;
  outline: none;
}

.form-input::placeholder {
  color: var(--color-text-tertiary);
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.form-input:hover:not(:focus) {
  border-color: var(--color-text-tertiary);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-border-light);
}

.form-input-error {
  border-color: #feb2b2;
  background: #fff5f5;
}

.form-input-error:focus {
  border-color: #fc8181;
  box-shadow: 0 0 0 3px rgba(252, 129, 129, 0.1);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-xs);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.checkbox-text {
  font-size: 14px;
  color: var(--color-text-secondary);
  user-select: none;
}

.forgot-link {
  font-size: 14px;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: var(--color-primary);
}

.auth-btn {
  width: 100%;
  background: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-none);
  padding: 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.2s ease;
  margin-top: var(--spacing-md);
}

.auth-btn:hover {
  background: transparent;
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.auth-btn:active {
  transform: translateY(0);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.auth-switch {
  text-align: center;
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-2xl);
  border-top: 1px solid var(--color-border-light);
}

.auth-switch-text {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-right: var(--spacing-sm);
}

.auth-switch-link {
  font-size: 14px;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.auth-switch-link:hover {
  opacity: 0.7;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .auth-page {
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .auth-card {
    padding: var(--spacing-2xl);
  }

  .auth-title {
    font-size: 28px;
  }
}
</style>
