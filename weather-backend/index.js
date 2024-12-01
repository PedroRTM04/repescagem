const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Importe o pacote cors
const app = express();
const port = 3003;

// Use o CORS para permitir requisições de outros domínios
app.use(cors());

// URLs das APIs
const primaryAPI = 'https://api.openweathermap.org/data/2.5/weather';
const primaryForecastAPI = 'https://api.openweathermap.org/data/2.5/forecast';
const backupAPI = 'https://api.weatherapi.com/v1/current.json';
const backupForecastAPI = 'https://api.weatherapi.com/v1/forecast.json';

// Chaves das APIs
const apiKey = '8a60b2de14f7a17c7a11706b2cfcd87c';
const backupApiKey = '1047573e417f4d4cb24c606d0a27de0c';

// Função de retry com Axios
async function fetchWithRetry(url, params, retries = 3) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`Erro ao fazer requisição para ${url}: ${error.message}`);
    if (retries > 0) {
      console.log(`Tentando novamente... (${retries} tentativas restantes)`);
      return await fetchWithRetry(url, params, retries - 1);
    } else {
      throw error;
    }
  }
}

// Rota para buscar o clima atual
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).send({ error: 'Cidade não fornecida' });

  try {
    const params = { q: city, appid: apiKey, units: 'metric', lang: 'pt_br' };
    console.log(`Buscando clima para ${city} na API principal...`);
    const data = await fetchWithRetry(primaryAPI, params);
    res.json({
      source: 'OpenWeatherMap',
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
    });
  } catch (error) {
    console.error(`Erro na API principal: ${error.message}`);
    const params = { key: backupApiKey, q: city };
    try {
      console.log(`Tentando API de backup...`);
      const data = await fetchWithRetry(backupAPI, params);
      res.json({
        source: 'WeatherAPI (Backup)',
        city: data.location.name,
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        humidity: data.current.humidity,
      });
    } catch (backupError) {
      console.error(`Erro na API de backup: ${backupError.message}`);
      res.status(500).send({ error: 'Falha nas APIs', details: backupError.message });
    }
  }
});

// Rota para buscar a previsão do tempo (5 dias)
app.get('/forecast', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).send({ error: 'Cidade não fornecida' });

  try {
    const params = { q: city, appid: apiKey, units: 'metric', lang: 'pt_br' };
    console.log(`Buscando previsão para ${city} na API principal...`);
    const data = await fetchWithRetry(primaryForecastAPI, params);
    res.json({
      source: 'OpenWeatherMap',
      forecast: data.list.map(item => ({
        date: item.dt_txt,
        temperature: item.main.temp,
        description: item.weather[0].description,
        humidity: item.main.humidity,
      })),
    });
  } catch (error) {
    console.error(`Erro na API principal: ${error.message}`);
    const params = { key: backupApiKey, q: city, days: 5 };
    try {
      console.log(`Tentando API de backup...`);
      const data = await fetchWithRetry(backupForecastAPI, params);
      res.json({
        source: 'WeatherAPI (Backup)',
        forecast: data.forecast.forecastday.map(day => ({
          date: day.date,
          temperature: day.day.avgtemp_c,
          description: day.day.condition.text,
          humidity: day.day.avghumidity,
        })),
      });
    } catch (backupError) {
      console.error(`Erro na API de backup: ${backupError.message}`);
      res.status(500).send({ error: 'Falha nas APIs', details: backupError.message });
    }
  }
});

// Inicia o servidor
app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
