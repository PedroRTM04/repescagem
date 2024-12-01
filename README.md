Projeto de Backend Redundante para Consulta de Clima
Descrição do Projeto
Este projeto implementa uma aplicação web com um backend tolerante a falhas para consultar dados climáticos de APIs públicas. Ele utiliza uma arquitetura de microserviços com redundância, fallback e configurações de retry para garantir alta disponibilidade e resiliência.

Funcionalidades
Consulta de temperatura atual e previsão para 5 dias.
Backend redundante com alternância entre serviços principal e de backup.
Mecanismo de retry e failover para lidar com falhas.

Pré-requisitos:
Node.js (versão recomendada: 16 ou superior)
Docker e Docker Compose
Git

Instalação e Configuração:

Clone o repositório:

git clone https://github.com/PedroRTM04/repescagem
cd repositorio

Instale as dependências do frontend e backend:

cd backend
npm install
cd ../frontend
npm install


Crie um arquivo .env no diretório backend:

PRIMARY_API_URL=https://api.openweathermap.org/data/2.5
PRIMARY_API_KEY=suachaveprincipal
BACKUP_API_URL=https://api.weatherbit.io/v2.0
BACKUP_API_KEY=suachavebackup
PORT=3003

Configuração e Execução dos Contêineres
Inicie os contêineres Docker:

docker-compose up --build
Acesse a aplicação web:

http://localhost:5500
Simulação de Falhas e Validação
Simule falhas no serviço principal:

Pare o contêiner do serviço principal usando:
bash
Copiar código
docker stop backend_primary
O backend deve automaticamente redirecionar as requisições para o serviço de backup.
Teste o retry e failover:

Induza falhas temporárias no serviço principal e observe as tentativas de retry no terminal.
Verifique os logs para confirmar a alternância entre APIs.
Validação do Sistema
Verifique o funcionamento normal da aplicação com o serviço principal ativo.
Induza falhas e observe a transição para o serviço de backup.
Teste os tempos de resposta e a estabilidade do sistema em condições de falha.
