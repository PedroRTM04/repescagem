// Função para obter o nome da cidade
function getCity() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        alert('Por favor, digite o nome de uma cidade.');
        return null;
    }
    return city;
}

// Função para buscar a temperatura atual
async function getCurrentWeather() {
    const city = getCity(); // Certifique-se de que getCity() retorne uma cidade válida.
    if (!city) {
        alert('Por favor, insira o nome de uma cidade.');
        return;
    }

    const url = `http://localhost:3003/weather?city=${encodeURIComponent(city)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Falha ao obter dados da API');
        }

        const data = await response.json();

        // Limpa os dados exibidos anteriormente
        clearDisplay();

        // Exibe os dados de clima
        displayCurrentWeather(data);
    } catch (error) {
        console.error('Erro ao buscar dados:', error.message);
        alert(`Erro: ${error.message}`);
    }
}

// Função para exibir as informações de clima na interface
function displayCurrentWeather(data) {
    const weatherContainer = document.getElementById('weatherContainer');
    if (!weatherContainer) return;

    if (data && data.city) {
        const temperature = Math.round(data.temperature); // Arredonda a temperatura

        weatherContainer.innerHTML = `
            <h2>Clima em ${data.city}</h2>
            <p>Temperatura: ${temperature}°C</p>
            <p>Descrição: ${data.description}</p>
            <p>Umidade: ${data.humidity}%</p>
        `;
    } else {
        weatherContainer.innerHTML = `
            <p>Não foi possível obter os dados de clima para a cidade informada.</p>
        `;
    }
}

// Função para buscar a previsão do tempo para 5 dias
async function getForecast() {
    const city = getCity();
    if (!city) return;

    const url = `http://localhost:3003/forecast?city=${encodeURIComponent(city)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Limpa os dados exibidos anteriormente
        clearDisplay();

        if (response.ok) {
            displayForecast(data);
        } else {
            throw new Error(data.error || 'Erro desconhecido.');
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error.message);
        alert(`Erro: ${error.message}`);
    }
}

// Função para exibir a previsão do tempo para 5 dias na tela
function displayForecast(data) {
    const output = document.getElementById('output');
    if (!output) return;

    output.innerHTML = `<h2>Previsão para os próximos 5 dias em ${data.forecast[0].date}</h2>`;
    output.innerHTML += `<p><strong>Fonte:</strong> ${data.source}</p>`;

    // Criar uma tabela para exibir as informações
    let table = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Temperatura (°C)</th>
                    <th>Clima</th>
                    <th>Umidade (%)</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Filtrar as previsões para mostrar apenas uma por dia
    const dailyForecast = getDailyForecast(data.forecast);

    // Iterar sobre as previsões diárias e exibir uma linha para cada dia
    dailyForecast.forEach(day => {
        table += `
            <tr>
                <td>${day.date}</td>
                <td>${day.temperature}</td>
                <td>${day.description}</td>
                <td>${day.humidity}</td>
            </tr>
        `;
    });

    table += '</tbody></table>';
    output.innerHTML += table;
}

// Função para filtrar as previsões diárias (apenas uma previsão por dia)
function getDailyForecast(forecast) {
    // Mapear as previsões por dia
    const days = {};
    
    forecast.forEach(item => {
        const date = item.date.split(' ')[0];  // Considera apenas a data (sem a hora)
        if (!days[date]) {
            days[date] = {
                date: item.date,
                temperature: item.temperature,
                description: item.description,
                humidity: item.humidity,
            };
        }
    });

    // Transformar o objeto em um array de 5 previsões
    return Object.values(days).slice(0, 5);
}

// Função para limpar os dados exibidos
function clearDisplay() {
    const weatherContainer = document.getElementById('weatherContainer');
    const output = document.getElementById('output');
    
    if (weatherContainer) {
        weatherContainer.innerHTML = '';
    }
    if (output) {
        output.innerHTML = '';
    }
}
