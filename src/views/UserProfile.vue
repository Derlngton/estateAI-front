<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-container">
        <button
          type="button"
          @click="handleBack"
          class="back-btn"
        >
          ← Назад
        </button>
        <h1 class="profile-title">Профиль пользователя</h1>

        <div v-if="loading" class="loading">
          Загрузка...
        </div>

        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-else class="profile-content">
          <div class="profile-field">
            <label class="field-label">Имя</label>
            <div class="field-value">{{ userData.name || 'Не указано' }}</div>
          </div>

          <div class="profile-field">
            <label class="field-label">Email</label>
            <div class="field-value">{{ userData.email }}</div>
          </div>

          <div class="profile-field">
            <label class="field-label">Пароль</label>
            <div class="field-value password-field">
              <span class="password-hidden">••••••••</span>
              <button class="change-password-btn" @click="handleChangePassword">
                изменить пароль
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '../utils/api.js'

const router = useRouter()

const loading = ref(true)
const error = ref(null)
const userData = ref({
  id: null,
  name: '',
  email: ''
})

const fetchUserProfile = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('📡 [PROFILE] Загрузка данных профиля...')

    const response = await fetchWithAuth('http://localhost:8000/auth/me', {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error('Ошибка загрузки профиля')
    }

    const data = await response.json()
    console.log('✅ [PROFILE] Данные получены:', data)

    // Если в ответе есть обертка {status, data}, извлекаем data
    const profileData = data.data || data

    userData.value = {
      id: profileData.id,
      name: profileData.name || '',
      email: profileData.email
    }

    // Если name отсутствует в API, попробуем взять из localStorage
    if (!userData.value.name) {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser)
          userData.value.name = parsed.name || ''
        } catch (e) {
          console.error('Ошибка парсинга localStorage:', e)
        }
      }
    }
  } catch (err) {
    console.error('❌ [PROFILE] Ошибка:', err)
    error.value = 'Не удалось загрузить данные профиля'
  } finally {
    loading.value = false
  }
}

const handleChangePassword = () => {
  // Заглушка для изменения пароля
  console.log('🔒 [PROFILE] Изменение пароля (заглушка)')
  alert('Функция изменения пароля будет реализована позже')
}

const handleBack = () => {
  router.push('/agents')
}

onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 80px);
  background: #fafafa;
  padding: 60px 0;
}

.profile-container {
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  padding: 48px;
  border: 1px solid #e0e0e0;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.back-btn:hover {
  color: var(--color-text-primary);
}

.profile-title {
  /* font-family: 'Playfair Display', serif; */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 32px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 40px 0;
  letter-spacing: 0.5px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666666;
  font-size: 16px;
}

.error-message {
  padding: 20px;
  background: #ffe0e0;
  color: #cc0000;
  border: 1px solid #cc0000;
  font-size: 14px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.profile-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-value {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #000000;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.password-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.password-hidden {
  letter-spacing: 2px;
}

.change-password-btn {
  background: transparent;
  border: none;
  color: #000000;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s ease;
}

.change-password-btn:hover {
  opacity: 0.6;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 40px 0;
  }

  .profile-container {
    padding: 32px 24px;
  }

  .profile-title {
    font-size: 24px;
    margin-bottom: 32px;
  }

  .field-value {
    font-size: 15px;
  }
}
</style>
