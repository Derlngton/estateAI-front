import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import CreateAgentForm from '../components/CreateAgentForm.vue'
import AgentDetails from '../components/AgentDetails.vue'
import ConversationsHistory from '../components/ConversationsHistory.vue'
import StartAgentForm from '../components/StartAgentForm.vue'
import AgentsList from '../views/AgentsList.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginForm,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterForm,
    meta: { requiresGuest: true }
  },
  {
    path: '/agents',
    name: 'agents',
    component: AgentsList,
    meta: { requiresAuth: true }
  },
  {
    path: '/agents/create',
    name: 'create-agent',
    component: CreateAgentForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/agents/:id',
    name: 'agent-details',
    component: AgentDetails,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/agents/:id/start',
    name: 'start-agent',
    component: StartAgentForm,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/agents/:id/conversations',
    name: 'conversations',
    component: ConversationsHistory,
    meta: { requiresAuth: true },
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards для защиты роутов
router.beforeEach((to, from, next) => {
  const savedUser = localStorage.getItem('user')
  const isAuthenticated = !!savedUser

  // Если роут требует авторизации, но пользователь не авторизован
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // Если роут для гостей (логин/регистрация), но пользователь уже авторизован
  else if (to.meta.requiresGuest && isAuthenticated) {
    next('/agents')
  }
  // Иначе разрешаем переход
  else {
    next()
  }
})

export default router
