<template>
  <header class="header-fashion">
    <div class="container">
      <div class="header-content-fashion">
        <!-- Logo -->
        <div class="logo-fashion">
          <span class="logo-text-fashion">ESTATE AI</span>
        </div>

        <!-- Navigation -->
        <nav class="nav-fashion">
          <router-link to="/agents" class="nav-link-fashion">Агенты</router-link>
          <a href="#" class="nav-link-fashion">Каталог</a>
          <a href="#" class="nav-link-fashion">Аналитика</a>
          <a href="#" class="nav-link-fashion">Интеграции</a>
          <a href="#" class="nav-link-fashion">Тарифы</a>
          <a href="#" class="nav-link-fashion">О платформе</a>
        </nav>

        <!-- Actions -->
        <div class="header-actions-fashion">
          <button class="icon-btn-fashion" aria-label="Поиск">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>

          <template v-if="isAuthenticated">
            <button class="icon-btn-fashion" aria-label="Профиль" @click="goToProfile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            <!-- <button class="icon-btn-fashion" aria-label="Избранное">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button> -->
            <button class="icon-btn-fashion" aria-label="Уведомления">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            <button class="auth-btn-fashion" @click="$emit('logout')">Выйти</button>
          </template>

          <router-link v-else to="/login" class="auth-btn-fashion" style="text-decoration: none; display: inline-flex; align-items: center;">Войти</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  }
})

defineEmits(['logout'])

const goToProfile = () => {
  router.push('/profile')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');

.header-fashion {
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: none;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
}

.header-content-fashion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  gap: 48px;
}

/* Logo */
.logo-fashion {
  flex-shrink: 0;
}

.logo-text-fashion {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 700;
  color: #000000;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Navigation */
.nav-fashion {
  display: flex;
  align-items: center;
  gap: 40px;
  flex: 1;
  justify-content: center;
}

.nav-link-fashion {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  text-decoration: none;
  letter-spacing: 0;
  transition: opacity 0.2s ease;
  position: relative;
}

.nav-link-fashion:hover {
  opacity: 0.7;
}

/* Optional: Underline on hover */
.nav-link-fashion::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 1px;
  background: #000000;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.nav-link-fashion:hover::after {
  transform: scaleX(1);
}

/* Actions */
.header-actions-fashion {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.icon-btn-fashion {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  transition: opacity 0.2s ease;
}

.icon-btn-fashion:hover {
  opacity: 0.6;
}

.icon-btn-fashion svg {
  display: block;
}

.auth-btn-fashion {
  background: transparent;
  border: 1px solid #000000;
  color: #000000;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
  border-radius: 0;
  margin-left: 8px;
}

.auth-btn-fashion:hover {
  background: #000000;
  color: #ffffff;
}

/* Responsive */
@media (max-width: 1024px) {
  .nav-fashion {
    gap: 24px;
  }

  .header-content-fashion {
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .header-content-fashion {
    height: 64px;
  }

  .nav-fashion {
    display: none;
  }

  .logo-text-fashion {
    font-size: 18px;
  }

  .header-actions-fashion {
    gap: 16px;
  }
}
</style>
