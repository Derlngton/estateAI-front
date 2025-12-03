<template>
  <div class="auth-page">
    <div class="auth-container agent-details-container">
      <div class="auth-card">
        <div class="auth-header">
          <button
            type="button"
            @click="handleBack"
            class="back-btn"
          >
            ← Назад
          </button>
          <h1 class="auth-title">Детали агента</h1>
          <p class="auth-subtitle">Просмотр и редактирование агента</p>
        </div>

        <div v-if="isLoading" class="loading-state">
          <p>Загрузка...</p>
        </div>

        <div v-else-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        
        

        <form v-else @submit.prevent class="auth-form">

          <div class="form-group">
            <label class="form-label">Аватар</label>
            <div class="avatar-selector">
              <div class="avatar-preview">
                <img v-if="formData.avatar" :src="formData.avatar" alt="Avatar preview" class="avatar-image" />
                <div v-else class="avatar-placeholder">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="23" stroke="currentColor" stroke-width="2"/>
                    <path d="M24 24C27.3137 24 30 21.3137 30 18C30 14.6863 27.3137 12 24 12C20.6863 12 18 14.6863 18 18C18 21.3137 20.6863 24 24 24Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 36C12 31.5817 15.5817 28 20 28H28C32.4183 28 36 31.5817 36 36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <button
                type="button"
                @click="generateAvatar"
                class="avatar-generate-btn"
              >
                <img src="../assets/icons/auto-generate.svg" alt="" width="16" height="16" />
                Сгенерировать аватар
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="name" class="form-label">Имя</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="Анна Соколова"
              required
            />
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">Телефон</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="form-input"
              placeholder="+7 (926) 555-1234"
              required
            />
          </div>

          <div class="form-group">
            <label for="type" class="form-label">Тип агента</label>
            <select
              id="type"
              v-model="formData.type"
              class="form-input"
              required
            >
              <option value="">Выберите тип</option>
              <option value="Работа с базой клиентов">Работа с базой клиентов</option>
            </select>
          </div>

          <div class="form-group">
            <label for="messenger" class="form-label">Мессенджер</label>
            <select
              id="messenger"
              v-model="formData.messenger"
              class="form-input"
              required
            >
              <option value="">Выберите мессенджер</option>
              <option value="Telegram">Telegram</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Viber">Viber</option>
            </select>
          </div>

          <div class="form-group">
            <label for="description" class="form-label">Описание</label>
            <textarea
              id="description"
              v-model="formData.description"
              class="form-input form-textarea"
              placeholder="Специализируюсь на квартирах в новостройках..."
              required
              rows="4"
            ></textarea>
          </div>

          <div class="form-actions-row">
            <button
              type="button"
              @click="handleSave"
              class="auth-btn"
              :disabled="!hasChanges || isSaving"
            >
              {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
            <button
              type="button"
              @click="handleDelete"
              class="auth-btn delete-btn"
            >
              Удалить агента
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '../utils/api.js'

const router = useRouter()

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

// Используем id из props (передаётся через роутер)
const agentId = props.id

const emit = defineEmits(['agent-updated', 'agent-deleted'])

const formData = ref({
  name: '',
  phone: '',
  type: '',
  description: '',
  messenger: '',
  avatar: ''
})

const originalData = ref({})
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')

const avatarOptions = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'
]

const hasChanges = computed(() => {
  return JSON.stringify(formData.value) !== JSON.stringify(originalData.value)
})

const generateAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarOptions.length)
  formData.value.avatar = avatarOptions[randomIndex]
}

const loadAgent = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    console.log('📡 [AGENT_DETAILS] Загрузка агента:', agentId)

    const response = await fetchWithAuth(`http://localhost:8000/agents/get_agent/${agentId}`, {
      method: 'GET'
    })

    console.log('📥 [AGENT_DETAILS] Получен ответ:', {
      status: response.status,
      statusText: response.statusText
    })

    if (!response.ok) {
      throw new Error('Ошибка при загрузке агента')
    }

    const result = await response.json()
    console.log('📥 [AGENT_DETAILS] Данные агента:', result)

    const agentData = result.data || result

    formData.value = {
      name: agentData.name || '',
      phone: agentData.phone || '',
      type: agentData.type || '',
      description: agentData.description || '',
      messenger: agentData.messenger || '',
      avatar: agentData.avatar || ''
    }

    originalData.value = { ...formData.value }

    console.log('✅ [AGENT_DETAILS] Агент загружен')
  } catch (error) {
    errorMessage.value = error.message || 'Произошла ошибка при загрузке агента'
    console.error('💥 [AGENT_DETAILS] Ошибка загрузки:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSave = async () => {
  isSaving.value = true
  errorMessage.value = ''

  try {
    console.log('📤 [AGENT_DETAILS] Сохранение изменений:', formData.value)

    const response = await fetchWithAuth(`http://localhost:8000/agents/${agentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value)
    })

    console.log('📥 [AGENT_DETAILS] Ответ на сохранение:', {
      status: response.status,
      statusText: response.statusText
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Ошибка при сохранении')
    }

    const result = await response.json()
    console.log('✅ [AGENT_DETAILS] Изменения сохранены')

    originalData.value = { ...formData.value }

    emit('agent-updated', result.data || result)

    // Отправляем событие для перезагрузки списка агентов
    window.dispatchEvent(new Event('agents:reload'))

    router.push('/agents')
  } catch (error) {
    errorMessage.value = error.message || 'Произошла ошибка при сохранении'
    console.error('💥 [AGENT_DETAILS] Ошибка сохранения:', error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Вы уверены, что хотите удалить этого агента?')) {
    return
  }

  try {
    console.log('📤 [AGENT_DETAILS] Удаление агента:', agentId)

    const response = await fetchWithAuth(`http://localhost:8000/agents/${agentId}`, {
      method: 'DELETE'
    })

    console.log('📥 [AGENT_DETAILS] Ответ на удаление:', {
      status: response.status,
      statusText: response.statusText
    })

    if (!response.ok) {
      throw new Error('Ошибка при удалении агента')
    }

    console.log('✅ [AGENT_DETAILS] Агент удален')
    emit('agent-deleted', agentId)

    // Отправляем событие для перезагрузки списка агентов
    window.dispatchEvent(new Event('agents:reload'))

    router.push('/agents')
  } catch (error) {
    errorMessage.value = error.message || 'Произошла ошибка при удалении'
    console.error('💥 [AGENT_DETAILS] Ошибка удаления:', error)
  }
}

const handleBack = () => {
  if (hasChanges.value) {
    if (!confirm('У вас есть несохраненные изменения. Вы уверены, что хотите выйти?')) {
      return
    }
  }
  router.push('/agents')
}

onMounted(() => {
  loadAgent()
})
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

.agent-details-container {
  max-width: 640px;
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
  padding-top: var(--spacing-md);
  position: relative;
}

.back-btn {
  position: absolute;
  left: -24px;
  top: -24px;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 0;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.back-btn:hover {
  color: var(--color-text-primary);
  transform: translateX(-4px);
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

.loading-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
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

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
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

.avatar-selector {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--color-text-tertiary);
}

.avatar-generate-btn {
  background: var(--color-bg);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-none);
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
}

.avatar-generate-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.form-actions-row {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.auth-btn {
  flex: 1;
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
}

.auth-btn:hover:not(:disabled) {
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

.secondary-btn {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.secondary-btn:hover:not(:disabled) {
  background: var(--color-bg-alt);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

.delete-btn {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.delete-btn:hover:not(:disabled) {
  background: #f5c6cb;
  color: #721c24;
  border-color: #721c24;
}

/* .start-btn  {*/
.start-btn:hover:not(:disabled){
  background: #e6f7ed;
  color: #1e7e34;
  border: 1px solid #c3e6cb;
}

.start-btn {
/* .start-btn:hover:not(:disabled) { */
  /* background: #c3e6cb; */
  background: #ffffff;
  color: #1e7e34;
  border-color: #1e7e34;
  /* border-color: #c3e6cb; */
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

  .form-actions-row {
    flex-direction: column;
  }

  .avatar-selector {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
