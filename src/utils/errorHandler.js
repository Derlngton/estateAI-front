// Маппинг ошибок бекенда на понятные пользователю сообщения
const ERROR_MESSAGES = {
  // 404 ошибки
  'Пользователь не найден': {
    userMessage: 'Пользователь не найден',
    field: null,
    displayType: 'form-top'
  },
  'Агент не найден': {
    userMessage: 'Агент не найден',
    field: null,
    displayType: 'form-top'
  },

  // 409 ошибки
  'Такой пользователь уже зарегистрирован': {
    userMessage: 'Этот email уже используется',
    field: 'email',
    displayType: 'field'
  },
  'Вы уже авторизованы': {
    userMessage: 'Вы уже авторизованы',
    field: null,
    displayType: 'form-top'
  },
  'Агент с таким номером уже существует': {
    userMessage: 'Агент с этим номером уже существует',
    field: 'phone',
    displayType: 'field'
  },

  // 401 ошибки
  'Неверный токен': {
    userMessage: 'Сессия истекла. Пожалуйста, войдите снова',
    field: null,
    displayType: 'form-top'
  },
  'Не получен токен': {
    userMessage: 'Ошибка авторизации',
    field: null,
    displayType: 'form-top'
  },
  'Не получен access токен': {
    userMessage: 'Ошибка авторизации',
    field: null,
    displayType: 'form-top'
  },
  'Не получен refresh токен': {
    userMessage: 'Ошибка авторизации',
    field: null,
    displayType: 'form-top'
  },
  'Неверный пароль': {
    userMessage: 'Неверный пароль',
    field: 'password',
    displayType: 'field'
  },

  // 422 ошибки
  'Не заполнены все обязательные поля для агента': {
    userMessage: 'Заполните все обязательные поля',
    field: null,
    displayType: 'form-top'
  }
}

// Маппинг полей из ValidationError на русские названия полей формы
const FIELD_NAMES = {
  'email': 'email',
  'password': 'password',
  'name': 'name',
  'phone': 'phone',
  'type': 'type',
  'messenger': 'messenger',
  'description': 'description',
  'avatar': 'avatar'
}

/**
 * Обрабатывает ответ API и возвращает структурированную информацию об ошибке
 * @param {Response} response - Ответ от fetch
 * @param {Object} data - Распарсенные данные ответа
 * @returns {Object} Объект с информацией об ошибке
 */
export const handleApiError = async (response, data) => {
  const errorInfo = {
    status: response.status,
    generalError: null, // Общая ошибка для отображения вверху формы
    fieldErrors: {}     // Ошибки для конкретных полей { fieldName: errorMessage }
  }

  // Обработка ValidationError (422)
  if (response.status === 422 && data.detail && Array.isArray(data.detail)) {
    data.detail.forEach(validationError => {
      // Извлекаем имя поля из loc (обычно ['body', 'field_name'])
      const fieldPath = validationError.loc
      const fieldName = fieldPath[fieldPath.length - 1]
      const mappedField = FIELD_NAMES[fieldName] || fieldName

      // Формируем понятное сообщение об ошибке
      let message = validationError.msg

      // Упрощаем типовые ошибки валидации
      if (message.includes('missing')) {
        message = 'Обязательное поле'
      } else if (message.includes('value is not a valid email')) {
        message = 'Некорректный email'
      } else if (message.includes('string type expected')) {
        message = 'Требуется текст'
      }

      errorInfo.fieldErrors[mappedField] = message
    })

    // Если есть ошибки полей, не нужна общая ошибка
    if (Object.keys(errorInfo.fieldErrors).length === 0) {
      errorInfo.generalError = 'Проверьте правильность заполнения полей'
    }

    return errorInfo
  }

  // Обработка кастомных ошибок бекенда (401, 404, 409)
  const errorDetail = typeof data.detail === 'string' ? data.detail : data.message

  if (errorDetail && ERROR_MESSAGES[errorDetail]) {
    const errorConfig = ERROR_MESSAGES[errorDetail]

    if (errorConfig.displayType === 'field' && errorConfig.field) {
      errorInfo.fieldErrors[errorConfig.field] = errorConfig.userMessage
    } else {
      errorInfo.generalError = errorConfig.userMessage
    }
  } else {
    // Дефолтные сообщения для статус-кодов
    switch (response.status) {
      case 400:
        errorInfo.generalError = 'Некорректный запрос'
        break
      case 401:
        errorInfo.generalError = 'Ошибка авторизации'
        break
      case 403:
        errorInfo.generalError = 'Доступ запрещен'
        break
      case 404:
        errorInfo.generalError = 'Ресурс не найден'
        break
      case 409:
        errorInfo.generalError = 'Конфликт данных'
        break
      case 422:
        errorInfo.generalError = 'Проверьте правильность заполнения полей'
        break
      case 500:
        errorInfo.generalError = 'Ошибка сервера. Попробуйте позже'
        break
      default:
        errorInfo.generalError = errorDetail || 'Произошла ошибка. Попробуйте позже'
    }
  }

  return errorInfo
}

/**
 * Упрощенная функция для получения текстового сообщения об ошибке
 * @param {Response} response - Ответ от fetch
 * @param {Object} data - Распарсенные данные ответа
 * @returns {Promise<string>} Сообщение об ошибке
 */
export const getErrorMessage = async (response, data) => {
  const errorInfo = await handleApiError(response, data)

  if (errorInfo.generalError) {
    return errorInfo.generalError
  }

  if (Object.keys(errorInfo.fieldErrors).length > 0) {
    return 'Проверьте правильность заполнения полей'
  }

  return 'Произошла ошибка'
}
