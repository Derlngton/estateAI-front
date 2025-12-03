<template>
  <div class="app">
    <Header
      :is-authenticated="isAuthenticated"
      :user="currentUser"
      @logout="handleLogout"
    />

    <router-view
      @login-success="handleLoginSuccess"
      @register-success="handleRegisterSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from './components/Header.vue'
import { fetchWithAuth } from './utils/api.js'

const router = useRouter()
const isAuthenticated = ref(false)
const currentUser = ref(null)

const handleLoginSuccess = async (userData) => {
  console.log('🎉 [APP] Обработка успешного входа', {
    userData,
    timestamp: new Date().toISOString()
  })

  isAuthenticated.value = true
  currentUser.value = userData

  localStorage.setItem('user', JSON.stringify(userData))

  console.log('✅ [APP] Пользователь авторизован, состояние обновлено', {
    isAuthenticated: isAuthenticated.value,
    currentUser: currentUser.value
  })

  router.push('/agents')
}

const handleRegisterSuccess = async (userData) => {
  console.log('🎉 [APP] Обработка успешной регистрации', {
    userData,
    timestamp: new Date().toISOString()
  })

  isAuthenticated.value = true
  currentUser.value = userData

  localStorage.setItem('user', JSON.stringify(userData))

  console.log('✅ [APP] Пользователь зарегистрирован, состояние обновлено', {
    isAuthenticated: isAuthenticated.value,
    currentUser: currentUser.value
  })

  router.push('/agents')
}

const handleLogout = async () => {
  console.log('🚪 [LOGOUT] Начало процесса выхода', {
    user: currentUser.value,
    timestamp: new Date().toISOString()
  })

  try {
    console.log('📡 [LOGOUT] Отправка запроса на сервер...')

    const response = await fetchWithAuth('http://localhost:8000/auth/logout', {
      method: 'POST'
    })

    console.log('📥 [LOGOUT] Получен ответ от сервера', {
      status: response.status,
      statusText: response.statusText
    })

    if (!response.ok) {
      console.error('❌ [LOGOUT] Ошибка при выходе', {
        status: response.status
      })
    } else {
      console.log('✅ [LOGOUT] Успешный выход из системы')
    }
  } catch (error) {
    console.error('💥 [LOGOUT] Критическая ошибка:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
  } finally {
    localStorage.removeItem('user')
    isAuthenticated.value = false
    currentUser.value = null
    router.push('/login')
    console.log('🏁 [LOGOUT] Завершение процесса выхода, переход на страницу логина')
  }
}

onMounted(async () => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      currentUser.value = JSON.parse(savedUser)
      isAuthenticated.value = true
      console.log('✅ [AUTH] Пользователь восстановлен из localStorage', currentUser.value)
    } catch (error) {
      console.error('❌ [AUTH] Ошибка парсинга данных пользователя:', error)
      localStorage.removeItem('user')
    }
  }

  window.addEventListener('auth:logout', () => {
    console.log('🔔 [AUTH] Получено событие auth:logout, выполняем принудительный выход')
    isAuthenticated.value = false
    currentUser.value = null
    router.push('/login')
  })
})
</script>

<style>
@import './style.css';
</style>
