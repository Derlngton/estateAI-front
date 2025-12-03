let isRefreshing = false
let refreshSubscribers = []

const onRefreshed = () => {
  refreshSubscribers.forEach(callback => callback())
  refreshSubscribers = []
}

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback)
}

export const refreshToken = async () => {
  try {
    console.log('🔄 [REFRESH] Обновление access токена...')

    const response = await fetch('http://localhost:8000/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      console.error('❌ [REFRESH] Refresh токен протух')
      throw new Error('Refresh token expired')
    }

    console.log('✅ [REFRESH] Access токен успешно обновлен')
    return true
  } catch (error) {
    console.error('💥 [REFRESH] Ошибка обновления токена:', error)
    throw error
  }
}

export const fetchWithAuth = async (url, options = {}) => {
  const makeRequest = async () => {
    const response = await fetch(url, {
      ...options,
      credentials: 'include'
    })

    if (response.status === 401) {
      console.log('⚠️ [API] Получен 401, необходимо обновить токен')

      if (isRefreshing) {
        console.log('⏳ [API] Ожидание обновления токена...')
        return new Promise((resolve) => {
          addRefreshSubscriber(async () => {
            const retryResponse = await fetch(url, {
              ...options,
              credentials: 'include'
            })
            resolve(retryResponse)
          })
        })
      }

      isRefreshing = true

      try {
        await refreshToken()
        isRefreshing = false
        onRefreshed()

        console.log('🔁 [API] Повторный запрос после обновления токена')
        return await fetch(url, {
          ...options,
          credentials: 'include'
        })
      } catch (error) {
        isRefreshing = false
        console.error('❌ [API] Не удалось обновить токен, требуется logout')

        localStorage.removeItem('user')
        window.dispatchEvent(new CustomEvent('auth:logout'))

        throw error
      }
    }

    return response
  }

  return makeRequest()
}
