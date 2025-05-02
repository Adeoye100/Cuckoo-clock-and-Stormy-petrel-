// Configuration
const API_KEY = "64a4704b26d8e08d3a10e60bafccea2e"; 
const USE_MOCK_DATA = false; 

// Weather data cache
const weatherDataCache = {
  Ilorin: null,
  Lagos: null,
  Abuja: null,
  London: null,
  "New York": null,
};

// Mock data as fallback
const mockWeatherData = {
  Ilorin: {
    temperature: 32,
    conditions: "Sunny",
    icon: "sun",
    humidity: 65,
    wind: 10,
  },
  Lagos: {
    temperature: 30,
    conditions: "Partly Cloudy",
    icon: "cloud-sun",
    humidity: 70,
    wind: 12,
  },
  Abuja: {
    temperature: 34,
    conditions: "Hot",
    icon: "temperature-high",
    humidity: 55,
    wind: 8,
  },
  London: {
    temperature: 18,
    conditions: "Cloudy",
    icon: "cloud",
    humidity: 80,
    wind: 15,
  },
  "New York": {
    temperature: 22,
    conditions: "Rainy",
    icon: "cloud-rain",
    humidity: 75,
    wind: 20,
  },
};

// Map OpenWeatherMap condition codes to icons
function getWeatherIcon(conditionCode) {
  if (conditionCode >= 200 && conditionCode < 300) return "bolt"; // Thunderstorm
  if (conditionCode >= 300 && conditionCode < 400) return "cloud-rain"; // Drizzle
  if (conditionCode >= 500 && conditionCode < 600) return "cloud-showers-heavy"; // Rain
  if (conditionCode >= 600 && conditionCode < 700) return "snowflake"; // Snow
  if (conditionCode >= 700 && conditionCode < 800) return "smog"; // Atmosphere
  if (conditionCode === 800) return "sun"; // Clear
  if (conditionCode > 800) return "cloud"; // Clouds
  return "question";
}

// Fetch weather data from API
async function fetchWeatherData(city) {
  if (USE_MOCK_DATA) {
    return mockWeatherData[city];
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      conditions: data.weather[0].main,
      icon: getWeatherIcon(data.weather[0].id),
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Fallback to mock data if API fails
    return mockWeatherData[city];
  }
}

// Update weather display
async function updateWeather() {
  const city = document.getElementById("citySelect").value;

  // Check cache first
  if (!weatherDataCache[city]) {
    weatherDataCache[city] = await fetchWeatherData(city);
  }

  const data = weatherDataCache[city];

  document.getElementById("location").textContent = city;
  document.getElementById("temperature").textContent = `${data.temperature}°C`;
  document.getElementById("conditions").textContent = data.conditions;

  const iconElement = document.querySelector(".weather-icon i");
  iconElement.className = `fas fa-${data.icon}`;

  // Set appropriate color based on weather
  if (data.icon.includes("sun")) {
    iconElement.style.color = "#f39c12";
  } else if (data.icon.includes("cloud")) {
    iconElement.style.color = "#bdc3c7";
  } else if (data.icon.includes("rain") || data.icon.includes("shower")) {
    iconElement.style.color = "#3498db";
  } else if (data.icon.includes("temperature-high")) {
    iconElement.style.color = "#e74c3c";
  } else {
    iconElement.style.color = "#7f8c8d";
  }
}

// Refresh weather data (can be called periodically)
async function refreshWeather() {
  const city = document.getElementById("citySelect").value;
  weatherDataCache[city] = await fetchWeatherData(city);
  updateWeather();
}

// Initialize weather display
updateWeather();

// Refresh weather every 30 minutes (1800000 ms)
setInterval(refreshWeather, 1800000);

// Add event listener for city change
document.getElementById("citySelect").addEventListener("change", function () {
  updateWeather();
});

// Default cities to display (modified as requested)
  const defaultCities = ["Lagos,NG", "Ilorin,NG", "Abuja,NG", "London,GB"];

  // Fetch weather for default city (Lagos)
  fetchWeather("Lagos,NG", apiKey);

  // Fetch weather for multiple cities
  fetchMultipleCities(apiKey);

  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeather(city, apiKey);
    }
  });

  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const city = cityInput.value.trim();
      if (city) {
        fetchWeather(city, apiKey);
      }
    }
  });
});

// Fetch weather for multiple cities
function fetchMultipleCities(apiKey) {
  const container = document.getElementById("multi-city-container");
  const cities = ["Lagos,NG", "Ilorin,NG", "Abuja,NG", "London,GB"];

  cities.forEach((city) => {
    fetchWeatherForMultiCity(city, apiKey, container);
  });
}

// Function to fetch weather for individual city in multi-city display
function fetchWeatherForMultiCity(city, apiKey, container) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not fetch data for ${city}`);
      }
      return response.json();
    })
    .then((data) => {
      const cityCard = document.createElement("div");
      cityCard.className = "col-md-6 col-lg-3 mb-3";
      cityCard.innerHTML = `
        <div class="city-card">
          <div class="h5">${data.name}, ${data.sys.country}</div>
          <div class="h4">${Math.round(data.main.temp)}°C</div>
          <div>${data.weather[0].description}</div>
          <img src="https://openweathermap.org/img/wn/${
            data.weather[0].icon
          }.png" 
               alt="${data.weather[0].description}">
        </div>
      `;
      container.appendChild(cityCard);
    })
    .catch((error) => {
      console.error(`Error fetching weather for ${city}:`, error);
      // Optionally show error message in the UI
    });
}
