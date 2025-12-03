<template>
  <div class="auth-page">
    <div class="auth-container start-agent-container">
      <div class="auth-card">
        <div class="auth-header">
          <button
            type="button"
            @click="handleBack"
            class="back-btn"
          >
            ← Назад
          </button>
          <h1 class="auth-title">Запуск агента</h1>
          <p class="auth-subtitle">{{ agentName }} • Настройка параметров работы</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div class="form-group">
            <label for="prompt" class="form-label">Инструкция для агента</label>
            <textarea
              id="prompt"
              v-model="formData.prompt"
              class="form-input form-textarea"
              placeholder="Опишите, что должен делать агент. Например: Связаться с клиентами из базы, представиться, рассказать о доступных квартирах в новостройках и записать на просмотр..."
              :disabled="isLoading"
              required
              rows="6"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="city" class="form-label">Город</label>
            <input
              id="city"
              v-model="formData.city"
              type="text"
              class="form-input"
              placeholder="Москва"
              :disabled="isLoading"
              required
            />
            <span class="form-hint">Город, в котором находится недвижимость (для определения часового пояса)</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="initStartTime" class="form-label">Время начала инициализации</label>
              <input
                id="initStartTime"
                v-model="formData.initStartTime"
                type="time"
                class="form-input"
                :disabled="isLoading"
                required
              />
            </div>
            <div class="form-group">
              <label for="initEndTime" class="form-label">Время окончания инициализации</label>
              <input
                id="initEndTime"
                v-model="formData.initEndTime"
                type="time"
                class="form-input"
                :disabled="isLoading"
                required
              />
            </div>
          </div>
          <span class="form-hint">Время, когда агент может инициировать новые диалоги с клиентами из базы</span>

          <div class="form-group">
            <label class="form-label">Режим ответов на сообщения</label>
            <div class="radio-group">
              <label class="radio-option">
                <input
                  type="radio"
                  v-model="formData.responseMode"
                  value="24/7"
                  :disabled="isLoading"
                />
                <span class="radio-label">
                  <span class="radio-title">Круглосуточно</span>
                  <span class="radio-description">Агент отвечает на сообщения в любое время</span>
                </span>
              </label>
              <label class="radio-option">
                <input
                  type="radio"
                  v-model="formData.responseMode"
                  value="work_hours"
                  :disabled="isLoading"
                />
                <span class="radio-label">
                  <span class="radio-title">В рабочие часы</span>
                  <span class="radio-description">Агент отвечает только в указанное время инициализации</span>
                </span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="clientsFile" class="form-label">База клиентов (Excel)</label>
            <div class="file-upload">
              <input
                id="clientsFile"
                ref="fileInput"
                type="file"
                accept=".xlsx,.xls"
                @change="handleFileChange"
                :disabled="isLoading"
                class="file-input"
                required
              />
              <div class="file-upload-area" @click="triggerFileInput">
                <div v-if="!formData.fileName" class="file-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M7 18C7 18 7 16.5 7 15C7 13.5 7 12 9 12C11 12 11 13.5 11 15V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13 18V14C13 13.5 13 12 15 12C17 12 17 13.5 17 14V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <p class="file-placeholder-text">Нажмите для выбора файла</p>
                  <p class="file-placeholder-hint">Поддерживаются форматы: .xlsx, .xls</p>
                </div>
                <div v-else class="file-selected">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <div class="file-info">
                    <p class="file-name">{{ formData.fileName }}</p>
                    <p class="file-size">{{ formatFileSize(formData.fileSize) }}</p>
                  </div>
                  <button
                    type="button"
                    @click.stop="clearFile"
                    class="file-remove"
                    :disabled="isLoading"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="file-format-info">
              <p class="file-format-title">Формат таблицы Excel:</p>
              <ul class="file-format-list">
                <li>Столбец "Телефон" - номер телефона клиента (обязательный)</li>
                <li>Столбец "ФИО" - имя клиента (опциональный)</li>
                <li>Столбец "Примечание" - дополнительная информация (опциональный)</li>
              </ul>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="auth-btn" :disabled="isLoading || !isFormValid">
              {{ isLoading ? 'Запуск...' : 'Запустить агента' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { fetchWithAuth } from '../utils/api.js'

const props = defineProps({
  agentId: {
    type: [Number, String],
    required: true
  },
  agentName: {
    type: String,
    default: 'Агент'
  }
})

const emit = defineEmits(['back', 'agent-started'])

const formData = ref({
  prompt: '',
  city: '',
  initStartTime: '09:00',
  initEndTime: '19:00',
  responseMode: '24/7',
  file: null,
  fileName: '',
  fileSize: 0
})

const isLoading = ref(false)
const errorMessage = ref('')
const fileInput = ref(null)

const isFormValid = computed(() => {
  return formData.value.prompt.trim() &&
    formData.value.city.trim() &&
    formData.value.initStartTime &&
    formData.value.initEndTime &&
    formData.value.file !== null
})

const triggerFileInput = () => {
  if (!isLoading.value) {
    fileInput.value.click()
  }
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.file = file
    formData.value.fileName = file.name
    formData.value.fileSize = file.size
  }
}

const clearFile = () => {
  formData.value.file = null
  formData.value.fileName = ''
  formData.value.fileSize = 0
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handleSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    console.log('🚀 [START_AGENT] Запуск агента:', {
      agentId: props.agentId,
      ...formData.value
    })

    const formDataToSend = new FormData()
    formDataToSend.append('agent_id', props.agentId)
    formDataToSend.append('prompt', formData.value.prompt)
    formDataToSend.append('city', formData.value.city)
    formDataToSend.append('init_start_time', formData.value.initStartTime)
    formDataToSend.append('init_end_time', formData.value.initEndTime)
    formDataToSend.append('response_mode', formData.value.responseMode)
    formDataToSend.append('clients_file', formData.value.file)

    const response = await fetchWithAuth('http://localhost:8000/agents/start', {
      method: 'POST',
      body: formDataToSend
    })

    console.log('📥 [START_AGENT] Получен ответ:', {
      status: response.status,
      statusText: response.statusText
    })

    const data = await response.json()
    console.log('📥 [START_AGENT] Данные ответа:', data)

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при запуске агента')
    }

    console.log('✅ [START_AGENT] Агент успешно запущен')
    emit('agent-started', data)
  } catch (error) {
    errorMessage.value = error.message || 'Произошла ошибка при запуске агента'
    console.error('💥 [START_AGENT] Ошибка:', error)
  } finally {
    isLoading.value = false
  }
}

const handleBack = () => {
  emit('back')
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

.start-agent-container {
  max-width: 800px;
  width: 100%;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
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
  min-height: 120px;
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

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-border-light);
}

.form-hint {
  font-size: 12px;
  color: var(--color-text-tertiary);
  line-height: 1.5;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-option:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-alt);
}

.radio-option input[type="radio"] {
  margin-top: 2px;
  cursor: pointer;
}

.radio-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.radio-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.radio-description {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.file-upload {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.file-upload-area {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-2xl);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-bg);
}

.file-upload-area:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-alt);
}

.file-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-tertiary);
}

.file-placeholder-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.file-placeholder-hint {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.file-selected {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  background: var(--color-bg-alt);
  border-radius: var(--radius-sm);
}

.file-info {
  flex: 1;
  text-align: left;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.file-size {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.file-remove {
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
}

.file-remove:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: #fff5f5;
}

.file-format-info {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-bg-alt);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-light);
}

.file-format-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-sm);
}

.file-format-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.file-format-list li {
  font-size: 12px;
  color: var(--color-text-secondary);
  padding-left: 16px;
  position: relative;
  line-height: 1.6;
}

.file-format-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-text-tertiary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.auth-btn {
  background: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-none);
  padding: 16px 40px;
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

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
