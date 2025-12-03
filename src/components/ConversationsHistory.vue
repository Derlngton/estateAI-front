<template>
  <div class="auth-page">
    <div class="conversations-container">
      <div class="auth-card">
        <div class="auth-header">
          <button
            type="button"
            @click="handleBack"
            class="back-btn"
          >
            ← Назад
          </button>
          <h1 class="auth-title">История диалогов</h1>
          <p class="auth-subtitle">{{ agentName }} • {{ conversations.length }} диалогов</p>
        </div>

        <div v-if="isLoading" class="loading-state">
          <p>Загрузка...</p>
        </div>

        <div v-else-if="conversations.length === 0" class="empty-state">
          <p>Нет диалогов для отображения</p>
        </div>

        <div v-else class="conversations-list">
          <div
            v-for="conversation in conversations"
            :key="conversation.id"
            class="conversation-card"
            @click="selectConversation(conversation.id)"
          >
            <div class="conversation-header">
              <div class="client-info">
                <div class="messenger-badge">
                  <img
                    v-if="conversation.messenger.toLowerCase() === 'whatsapp'"
                    src="../assets/icons/whatsapp.svg"
                    alt="WhatsApp"
                    width="20"
                    height="20"
                  />
                  <img
                    v-if="conversation.messenger.toLowerCase() === 'telegram'"
                    src="../assets/icons/telegram.svg"
                    alt="Telegram"
                    width="20"
                    height="20"
                  />
                  <img
                    v-if="conversation.messenger.toLowerCase() === 'viber'"
                    src="../assets/icons/viber.svg"
                    alt="Viber"
                    width="20"
                    height="20"
                  />
                </div>
                <div class="client-details">
                  <div class="client-name">{{ conversation.clientName || 'Без имени' }}</div>
                  <div class="client-meta">
                    <span class="client-phone">{{ conversation.clientPhone }}</span>
                    <span v-if="conversation.clientNickname" class="client-nickname">@{{ conversation.clientNickname }}</span>
                  </div>
                </div>
              </div>
              <div class="conversation-meta">
                <span class="message-count">{{ conversation.messageCount }} сообщений</span>
                <span class="last-message-date">{{ formatDate(conversation.lastMessageDate) }}</span>
              </div>
            </div>

            <div class="last-message">
              <span class="message-label">Последнее сообщение:</span>
              <span class="message-text">{{ conversation.lastMessage }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  id: {
    type: String,
    required: false
  }
})

// Получаем ID из props или из route params
const agentId = computed(() => props.id || route.params.id)

const emit = defineEmits(['select-conversation'])

const isLoading = ref(false)
const agentName = ref('Агент')
const conversations = ref([
  {
    id: 1,
    messenger: 'WhatsApp',
    clientPhone: '+7 (926) 555-1234',
    clientName: 'Иван Петров',
    clientNickname: 'ivan_petrov',
    messageCount: 24,
    lastMessage: 'Спасибо за информацию! Буду думать над предложением.',
    lastMessageDate: '2024-12-03T10:30:00'
  },
  {
    id: 2,
    messenger: 'Telegram',
    clientPhone: '+7 (916) 777-8899',
    clientName: 'Мария Сидорова',
    clientNickname: 'maria_s',
    messageCount: 15,
    lastMessage: 'Можно посмотреть квартиру в субботу?',
    lastMessageDate: '2024-12-03T09:15:00'
  },
  {
    id: 3,
    messenger: 'WhatsApp',
    clientPhone: '+7 (903) 444-5566',
    clientName: null,
    clientNickname: null,
    messageCount: 8,
    lastMessage: 'Здравствуйте, интересуют квартиры в новостройках',
    lastMessageDate: '2024-12-02T18:45:00'
  },
  {
    id: 4,
    messenger: 'Viber',
    clientPhone: '+7 (985) 222-3344',
    clientName: 'Алексей Иванов',
    clientNickname: null,
    messageCount: 32,
    lastMessage: 'Отлично! Договорились на встречу в понедельник в 14:00',
    lastMessageDate: '2024-12-02T16:20:00'
  },
  {
    id: 5,
    messenger: 'Telegram',
    clientPhone: '+7 (915) 888-9900',
    clientName: 'Елена Волкова',
    clientNickname: 'elena_v',
    messageCount: 19,
    lastMessage: 'Подскажите, есть ли варианты с ремонтом?',
    lastMessageDate: '2024-12-02T14:10:00'
  }
])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes} мин назад`
  } else if (hours < 24) {
    return `${hours} ч назад`
  } else if (days === 1) {
    return 'Вчера'
  } else if (days < 7) {
    return `${days} дн назад`
  } else {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }
}

const handleBack = () => {
  router.push('/agents')
}

const selectConversation = (conversationId) => {
  emit('select-conversation', conversationId)
  console.log('Selected conversation:', conversationId)
}

onMounted(() => {
  // В будущем здесь будет загрузка реальных данных с сервера
  console.log('Loading conversations for agent:', agentId.value)
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

.conversations-container {
  max-width: 1000px;
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

.loading-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-secondary);
  font-size: 15px;
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.conversation-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all 0.2s ease;
}

.conversation-card:hover {
  border-color: var(--color-border);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
}

.client-info {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  flex: 1;
}

.messenger-badge {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.client-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.client-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.client-meta {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.client-phone {
  font-weight: 400;
}

.client-nickname {
  font-weight: 500;
  color: var(--color-text-tertiary);
}

.client-nickname::before {
  content: '•';
  margin-right: var(--spacing-sm);
}

.conversation-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.message-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.last-message-date {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.last-message {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
  font-size: 14px;
  line-height: 1.6;
}

.message-label {
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-right: var(--spacing-xs);
}

.message-text {
  color: var(--color-text-primary);
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

  .conversation-header {
    flex-direction: column;
  }

  .conversation-meta {
    align-items: flex-start;
  }
}
</style>
