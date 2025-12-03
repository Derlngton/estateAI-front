<template>
  <div class="agent-card" @click="$emit('click')">
    <div class="status-badge" :class="`status-${agent.status?.toLowerCase()}`">{{ agent.status }}</div>
    <img :src="agent.avatar" :alt="agent.name" class="agent-avatar">
    <h3 class="agent-name">{{ agent.name }}</h3>
    <p class="agent-phone">{{ agent.phone }}</p>
    <p class="agent-type">{{ agent.type }}</p>
    <p class="agent-description">{{ agent.description }}</p>

    <div class="messenger-icon">
      <img
        v-if="agent.messenger?.toLowerCase() === 'whatsapp'"
        src="../assets/icons/whatsapp.svg"
        alt="WhatsApp"
        width="28"
        height="28"
      />
      <img
        v-if="agent.messenger?.toLowerCase() === 'telegram'"
        src="../assets/icons/telegram.svg"
        alt="Telegram"
        width="28"
        height="28"
      />
      <img
        v-if="agent.messenger?.toLowerCase() === 'viber'"
        src="../assets/icons/viber.svg"
        alt="Viber"
        width="28"
        height="28"
      />
    </div>

    <div class="agent-stats">
      <span
        class="agent-stat"
        @click.stop="$emit('view-conversations', agent.id)"
      >
        💬 {{ agent.conversations }} диалогов
      </span>
      <button
        class="start-agent-btn"
        @click.stop="$emit('start-agent', agent.id)"
      >
        Запустить
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  agent: {
    type: Object,
    required: true
  }
})

defineEmits(['click', 'start-agent', 'view-conversations'])
</script>

<style scoped>
</style>
