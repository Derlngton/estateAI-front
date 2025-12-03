<template>
  <div class="app">
    <Header
      :is-authenticated="isAuthenticated"
      :user="currentUser"
      @logout="handleLogout"
      @show-login="currentPage = 'login'"
    />

    <LoginForm
      v-if="currentPage === 'login'"
      @login-success="handleLoginSuccess"
      @switch-to-register="currentPage = 'register'"
    />

    <RegisterForm
      v-else-if="currentPage === 'register'"
      @register-success="handleRegisterSuccess"
      @switch-to-login="currentPage = 'login'"
    />

    <CreateAgentForm
      v-else-if="currentPage === 'create-agent'"
      @agent-created="handleAgentCreated"
      @back="handleBackFromForm"
    />

    <AgentDetails
      v-else-if="currentPage === 'agent-details'"
      :agent-id="selectedAgentId"
      @back="handleBackFromAgentDetails"
      @agent-updated="handleAgentUpdated"
      @agent-deleted="handleAgentDeleted"
    />

    <ConversationsHistory
      v-else-if="currentPage === 'conversations'"
      :agent-id="selectedAgentId"
      :agent-name="selectedAgentName"
      @back="handleBackFromConversations"
    />

    <StartAgentForm
      v-else-if="currentPage === 'start-agent'"
      :agent-id="selectedAgentId"
      :agent-name="selectedAgentName"
      @back="handleBackFromStartAgent"
      @agent-started="handleAgentStarted"
    />

    <main v-else class="main">
      <div class="container">
        <h1 class="main-title">AI-ассистенты для работы с клиентами</h1>

        <div v-if="agents.length === 0" class="page-description">
          <p class="empty-state-text">У вас пока нет агентов. Создайте первого AI-агента для автоматизации общения с клиентами</p>
        </div>

        <div v-else class="page-description">
          <p class="description-text">Управляйте агентами, отслеживайте результаты работы и создавайте новых помощников</p>
        </div>

        <div class="search-panel">
          <button class="create-agent-btn" @click="createNewAgent">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Создать агента
          </button>
        </div>

        <section class="agents-section">
          <div v-if="agents.length > 0" class="agents-grid">
            <AgentCard
              v-for="agent in agents"
              :key="agent.id"
              :agent="agent"
              @click="handleAgentClick(agent.id)"
              @start-agent="handleStartAgent"
              @view-conversations="handleViewConversations(agent.id, agent.name)"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'
import AgentCard from './components/AgentCard.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import CreateAgentForm from './components/CreateAgentForm.vue'
import AgentDetails from './components/AgentDetails.vue'
import ConversationsHistory from './components/ConversationsHistory.vue'
import StartAgentForm from './components/StartAgentForm.vue'
import { fetchWithAuth } from './utils/api.js'

const currentPage = ref('login')
const isAuthenticated = ref(false)
const currentUser = ref(null)
const selectedAgentId = ref(null)
const selectedAgentName = ref('')

const agents = ref([])

const createNewAgent = () => {
  currentPage.value = 'create-agent'
}

const handleAgentCreated = (response) => {
  console.log('✅ [APP] Агент создан, получен ответ:', response)

  const agentData = response.data || response
  console.log('✅ [APP] Добавляю агента в список:', agentData)

  agents.value.push(agentData)
  currentPage.value = 'agents'
}

const handleBackFromForm = () => {
  currentPage.value = 'agents'
}

const loadAgents = async () => {
  if (!isAuthenticated.value) {
    console.log('⚠️ [LOAD_AGENTS] Пользователь не авторизован')
    return
  }

  try {
    console.log('📡 [LOAD_AGENTS] Загрузка агентов пользователя...')

    const response = await fetchWithAuth('http://localhost:8000/agents/get_all_agents', {
      method: 'GET'
    })

    console.log('📥 [LOAD_AGENTS] Получен ответ:', {
      status: response.status,
      statusText: response.statusText
    })

    if (!response.ok) {
      throw new Error('Ошибка при загрузке агентов')
    }

    const result = await response.json()
    console.log('📥 [LOAD_AGENTS] Получены данные:', result)

    const agentsData = result.data || result.agents || result
    const agentsList = Array.isArray(agentsData) ? agentsData : []

    console.log('📥 [LOAD_AGENTS] Загружено агентов:', agentsList.length)

    agents.value = agentsList
  } catch (error) {
    console.error('💥 [LOAD_AGENTS] Ошибка загрузки агентов:', error)
    agents.value = []
  }
}

const handleAgentClick = (id) => {
  console.log('Agent clicked:', id)
  selectedAgentId.value = id
  currentPage.value = 'agent-details'
}

const handleBackFromAgentDetails = () => {
  currentPage.value = 'agents'
  selectedAgentId.value = null
}

const handleAgentUpdated = (updatedAgent) => {
  console.log('✅ [APP] Агент обновлен:', updatedAgent)

  const index = agents.value.findIndex(a => a.id === selectedAgentId.value)
  if (index !== -1) {
    agents.value[index] = { ...agents.value[index], ...updatedAgent }
  }

  currentPage.value = 'agents'
  selectedAgentId.value = null
}

const handleAgentDeleted = (agentId) => {
  console.log('✅ [APP] Агент удален:', agentId)

  agents.value = agents.value.filter(a => a.id !== agentId)

  currentPage.value = 'agents'
  selectedAgentId.value = null
}

const handleStartAgent = (agentId) => {
  console.log('🚀 [APP] Открытие формы запуска агента:', agentId)
  const agent = agents.value.find(a => a.id === agentId)
  selectedAgentId.value = agentId
  selectedAgentName.value = agent ? agent.name : 'Агент'
  currentPage.value = 'start-agent'
}

const handleBackFromStartAgent = () => {
  currentPage.value = 'agents'
  selectedAgentId.value = null
  selectedAgentName.value = ''
}

const handleAgentStarted = (response) => {
  console.log('✅ [APP] Агент успешно запущен:', response)
  currentPage.value = 'agents'
  selectedAgentId.value = null
  selectedAgentName.value = ''
  // Можно добавить уведомление об успешном запуске
}

const handleViewConversations = (agentId, agentName) => {
  console.log('💬 [APP] Просмотр диалогов агента:', agentId)
  selectedAgentId.value = agentId
  selectedAgentName.value = agentName
  currentPage.value = 'conversations'
}

const handleBackFromConversations = () => {
  currentPage.value = 'agents'
  selectedAgentId.value = null
  selectedAgentName.value = ''
}

const handleLoginSuccess = async (userData) => {
  console.log('🎉 [APP] Обработка успешного входа', {
    userData,
    timestamp: new Date().toISOString()
  })

  isAuthenticated.value = true
  currentUser.value = userData
  currentPage.value = 'agents'

  localStorage.setItem('user', JSON.stringify(userData))

  console.log('✅ [APP] Пользователь авторизован, состояние обновлено', {
    isAuthenticated: isAuthenticated.value,
    currentUser: currentUser.value,
    currentPage: currentPage.value
  })

  await loadAgents()
}

const handleRegisterSuccess = async (userData) => {
  console.log('🎉 [APP] Обработка успешной регистрации', {
    userData,
    timestamp: new Date().toISOString()
  })

  isAuthenticated.value = true
  currentUser.value = userData
  currentPage.value = 'agents'

  localStorage.setItem('user', JSON.stringify(userData))

  console.log('✅ [APP] Пользователь зарегистрирован, состояние обновлено', {
    isAuthenticated: isAuthenticated.value,
    currentUser: currentUser.value,
    currentPage: currentPage.value
  })

  await loadAgents()
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
    currentPage.value = 'login'
    console.log('🏁 [LOGOUT] Завершение процесса выхода, переход на страницу логина')
  }
}

onMounted(async () => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      currentUser.value = JSON.parse(savedUser)
      isAuthenticated.value = true
      currentPage.value = 'agents'
      console.log('✅ [AUTH] Пользователь восстановлен из localStorage', currentUser.value)

      await loadAgents()
    } catch (error) {
      console.error('❌ [AUTH] Ошибка парсинга данных пользователя:', error)
      localStorage.removeItem('user')
    }
  }

  window.addEventListener('auth:logout', () => {
    console.log('🔔 [AUTH] Получено событие auth:logout, выполняем принудительный выход')
    isAuthenticated.value = false
    currentUser.value = null
    currentPage.value = 'login'
    agents.value = []
  })
})
</script>

<style>
@import './style.css';
</style>
