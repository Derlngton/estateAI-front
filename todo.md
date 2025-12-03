
Нужно заняться корректной обработкой ошибок на фронтенде. Если нужно, ориентируйся на документацию @OpenApi.json. Так же дополнительно ниже опишу список отбрасываемых исключений на бекенде:
class UserNotFoundHTTPException(EstateAiHTTPException):
    status_code = 404
    detail = "Пользователь не найден"

class UserAlreadyExistsHTTPException(EstateAiHTTPException):
    status_code = 409
    detail = "Такой пользователь уже зарегистрирован"


class WrongTokenHTTPException(EstateAiHTTPException):
    status_code=401
    detail="Неверный токен"

class TokenNotFoundHTTPException(EstateAiHTTPException):
    status_code=401
    detail="Не получен токен"

class AccessTokenNotFoundHTTPException(TokenNotFoundHTTPException):
    detail="Не получен access токен"

class RefreshTokenNotFoundHTTPException(TokenNotFoundHTTPException):
    detail="Не получен refresh токен"

class WrongPasswordHTTPException(EstateAiHTTPException):
    status_code = 401
    detail = "Неверный пароль"

class TokenAlreadyExistsHTTPException(EstateAiHTTPException):
    status_code = 409
    detail = "Вы уже авторизованы"

class AgentAlreadyExistsHTTPException(EstateAiHTTPException):
    status_code = 409
    detail = "Агент с таким номером уже существует"

class FieldOfAgentNotNullHTTPException(EstateAiHTTPException):
    status_code = 422
    detail = "Не заполнены все обязательные поля для агента"

class AgentNotFoundHTTPException(EstateAiHTTPException):
    status_code = 404
    detail = "Агент не найден"


Исходя из этого, реализуй корректную обработку ошибок на фронтенде. Если ошибка связана с каким-то одним полем, отобрази это в интерфейсе страницы. В других случаях, если нужно добавь всплывающую форму с информацией по ошибке

Информация по ошибке должна содержать максимально лаконичную и понятную пользователю информацию, но без технических деталей. Для поддержания высокого уровня безопасности


Перед принятием решения о форма обработки ошибки (всплывающее окно, отображение под полем и т.п) ВСЕГДА спрашивай у меня




#Стек
Frontend: Vue.js


#Агенты
Используй всех созданных агентов по необходимости:
1) @web-design-conslutant для поиска дизайнгайдов и референсов в интернете
2) @ux-ui-design-analyzer для анализа конкретного сайта или макета и создания похожего дизайна

#MCP
1) Используй context7 для получения самой актуальной документации по библиотекам и фреймворкам
2) Используй playwright для работый с браузером 

