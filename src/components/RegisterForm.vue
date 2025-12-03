<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Создать аккаунт</h1>
          <p class="auth-subtitle">Присоединяйтесь к ESTATE AI</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div class="form-group">
            <label for="name" class="form-label">Имя</label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="form-input"
              placeholder="Иван Иванов"
              :disabled="isLoading"
              required
            />
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="example@domain.com"
              :disabled="isLoading"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Пароль</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="Минимум 8 символов"
              :disabled="isLoading"
              required
              minlength="8"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="form-input"
              placeholder="Повторите пароль"
              :disabled="isLoading"
              required
            />
          </div>

          <div class="form-footer">
            <label class="checkbox-label">
              <input type="checkbox" v-model="acceptTerms" class="checkbox-input" :disabled="isLoading" required />
              <span class="checkbox-text">
                Я принимаю <a href="#" class="terms-link">условия использования</a>
              </span>
            </label>
          </div>

          <button type="submit" class="auth-btn" :disabled="isLoading">
            {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
        </form>

        <div class="auth-switch">
          <span class="auth-switch-text">Уже есть аккаунт?</span>
          <a href="#" @click.prevent="$emit('switch-to-login')" class="auth-switch-link">
            Войти
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const emit = defineEmits(['register-success', 'switch-to-login'])

const handleRegister = async () => {
  errorMessage.value = ''

  console.log('📝 [REGISTER] Начало процесса регистрации', {
    name: name.value,
    email: email.value,
    timestamp: new Date().toISOString()
  })

  if (password.value !== confirmPassword.value) {
    console.warn('⚠️ [REGISTER] Пароли не совпадают')
    errorMessage.value = 'Пароли не совпадают'
    return
  }

  if (!acceptTerms.value) {
    console.warn('⚠️ [REGISTER] Условия использования не приняты')
    errorMessage.value = 'Необходимо принять условия использования'
    return
  }

  isLoading.value = true

  try {
    console.log('📡 [REGISTER] Отправка запроса на сервер...')

    const response = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })
    })

    console.log('📥 [REGISTER] Получен ответ от сервера', {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'content-type': response.headers.get('content-type'),
        'set-cookie': response.headers.get('set-cookie') ? 'присутствует' : 'отсутствует'
      }
    })

    const data = await response.json()

    console.log('📦 [REGISTER] Данные ответа:', data)

    if (!response.ok) {
      console.error('❌ [REGISTER] Ошибка регистрации', {
        status: response.status,
        message: data.message || 'Неизвестная ошибка'
      })
      throw new Error(data.message || 'Ошибка при регистрации')
    }

    console.log('✅ [REGISTER] Успешная регистрация', {
      name: name.value,
      email: email.value,
      userData: data
    })

    emit('register-success', { name: name.value, email: email.value })
  } catch (error) {
    errorMessage.value = error.message || 'Произошла ошибка при регистрации'
    console.error('💥 [REGISTER] Критическая ошибка:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
  } finally {
    isLoading.value = false
    console.log('🏁 [REGISTER] Завершение процесса регистрации')
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

.form-footer {
  margin-top: var(--spacing-xs);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-primary);
  margin-top: 2px;
  flex-shrink: 0;
}

.checkbox-text {
  font-size: 14px;
  color: var(--color-text-secondary);
  user-select: none;
  line-height: 1.5;
}

.terms-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.terms-link:hover {
  opacity: 0.7;
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
