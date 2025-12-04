import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CreateAgentView from '../views/CreateAgentView.vue'
import AgentDetailsView from '../views/AgentDetailsView.vue'
import ConversationsHistoryView from '../views/ConversationsHistoryView.vue'
import StartAgentView from '../views/StartAgentView.vue'
import AgentsList from '../views/AgentsList.vue'
import UserProfile from '../views/UserProfile.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
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
    component: CreateAgentView,
    meta: { requiresAuth: true }
  },
  {
    path: '/agents/:id',
    name: 'agent-details',
    component: AgentDetailsView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/agents/:id/start',
    name: 'start-agent',
    component: StartAgentView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/agents/:id/conversations',
    name: 'conversations',
    component: ConversationsHistoryView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfile,
    meta: { requiresAuth: true }
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
