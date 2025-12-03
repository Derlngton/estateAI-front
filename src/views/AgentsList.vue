<template>
  <main class="main">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AgentCard from '../components/AgentCard.vue'
import { fetchWithAuth } from '../utils/api.js'

const router = useRouter()
const agents = ref([])

const createNewAgent = () => {
  router.push('/agents/create')
}

const loadAgents = async () => {
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
  router.push(`/agents/${id}`)
}

const handleStartAgent = (agentId) => {
  console.log('🚀 [AGENTS_LIST] Открытие формы запуска агента:', agentId)
  router.push(`/agents/${agentId}/start`)
}

const handleViewConversations = (agentId, agentName) => {
  console.log('💬 [AGENTS_LIST] Просмотр диалогов агента:', agentId)
  router.push(`/agents/${agentId}/conversations`)
}

onMounted(async () => {
  await loadAgents()

  // Слушаем событие обновления списка агентов
  window.addEventListener('agents:reload', loadAgents)
})
</script>

<style scoped>
/* Все стили уже есть в style.css */
</style>
