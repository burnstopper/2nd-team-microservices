# Microservice "Questionnaire"

Микросервис "Анкета".
После запуска можно посмотреть документацию на страницу http://localhost:8001/docs

Конфигурационный файл с переменными окружения должен находиться по пути "Questionnaire/backend/.env" .
В нём находятся следующие переменные:\
SQLALCHEMY_DATABASE_URI="sqlite+aiosqlite:///app/storage/questionnaire_database.db"
BEARER_TOKEN="JhbGciOiJIUzI1NiIsInR5I6IkpXVCJ9JzdWIiOiJKdXN0IGFGF2VzcyB0b2tlbiB0byBjb21t5pY2F0ZSB3dGloIFVzIifQ"
HOST="185.46.11.65"
TOKEN_SERVICE_PORT="80"

Последнее относится к микросервису Пользователь (к которому происходит обращения за токеном и айди пользователя).\
При деплое микросервиса README желательно обновить до финальной версии.