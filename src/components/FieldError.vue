<template>
  <transition name="fade">
    <div v-if="error" class="field-error">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="error-icon">
        <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
        <path d="M7 4V7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="7" cy="9.5" r="0.5" fill="currentColor"/>
      </svg>
      <span class="error-text">{{ error }}</span>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  error: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.field-error {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: var(--radius-none);
  font-size: 13px;
  color: #c53030;
  margin-top: 6px;
  animation: slideDown 0.2s ease;
}

.error-icon {
  flex-shrink: 0;
  color: #c53030;
}

.error-text {
  font-weight: 500;
  line-height: 1.4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
