import 'style.css'
import 'leaflet/dist/leaflet.css';

// Maps to hold data
const allDataMap = new Map();
const ageDistributionMap = new Map();
const communeMap = new Map();
let allCityData = [];

const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();

// Fetches data from given endpoint and returns it as JSON
async function fetchData(endpoint) {
    const response = await fetch(endpoint);
    return response.json();
}

// Display main page cities info
const displayCitiesInfo = (city, ageData, allData, communeData) => {

  const annualPopChange = allData?.annualPopChange ?? 'N/A';
  const emoji = annualPopChange > 0 ? '🔺' : (annualPopChange < 0 ? '🔻' : '📈');

  return `
    <div class="city-info-header">
      <h2>${city.label}</h2>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
    ${createInfoCard('👥', 'Population', (allData?.population?.toLocaleString('fr-FR').replace(/,/g, ' ') ?? 'N/A'))}
    ${createInfoCard('📉', 'Taux de chômage', (allData?.unemploymentRate2022 ?? 'N/A') + ' %')}
    ${createInfoCard(emoji, 'Évolution annuelle de la population', annualPopChange + ' %')}
    ${createInfoCard('💶', 'Salaire net horaire moyen', (allData?.averageNetSalary2021 ?? 'N/A') + ' €')}
    ${createInfoCard('👩‍💼', 'Salaire net horaire moyen des femmes', (allData?.womenNetSalary2021 ?? 'N/A') + ' €')}
    ${createInfoCard('👨‍💼', 'Salaire net horaire moyen des hommes', (allData?.menNetSalary2021 ?? 'N/A') + ' €')}
    ${createInfoCard('👶', 'Part des personnes de moins de 15 ans', (allData?.percentageYoungerThan15 ?? 'N/A') + ' %')}
    ${createInfoCard('👦👧', 'Part des personnes de moins de 25 ans', (allData?.percentageYoungerThan25 ?? 'N/A') + ' %')}
    ${createInfoCard('👩👨', 'Part des personnes de 25 à 64 ans', (allData?.percentageBetween25And64 ?? 'N/A') + ' %')}
    ${createInfoCard('👴👵', 'Part des personnes de 65 ans ou plus', (allData?.percentageOlderThan65 ?? 'N/A') + ' %')}
    ${createInfoCard('📉', 'Taux de pauvreté', (allData?.povertyRate ?? 'N/A') + ' %')}
    ${createInfoCard('📊', 'Taux d\'activité', (allData?.activityRateOverall ?? 'N/A') + ' %')}
    ${createInfoCard('👦📈', 'Taux d\'activité des 15 - 24 ans', (allData?.activityRate15To24 ?? 'N/A') + ' %')}
    ${createInfoCard('👩📈', 'Taux d\'activité des 25 - 54 ans', (allData?.activityRate25To54 ?? 'N/A') + ' %')}
    ${createInfoCard('👵📈', 'Taux d\'activité des 55 - 64 ans', (allData?.activityRate55To64 ?? 'N/A') + ' %')}
    ${createInfoCard('📬', 'Code Postal', communeData?.code_postal ?? 'N/A')}
    ${createInfoCard('📍', 'Code département', communeData?.code_departement ?? 'N/A')}
    ${createInfoCard('🏞️', 'Département', communeData?.nom_departement ?? 'N/A')}
    ${createInfoCard('🗺️', 'Code Région', communeData?.code_region ?? 'N/A')}
    ${createInfoCard('🌍', 'Région', communeData?.nom_region ?? 'N/A')}

    <h3>👨‍👩‍👧‍👦 Répartition par âge</h3>
    ${createInfoCard('👶', 'Moins de 15 ans', (ageData?.below15 ?? 'N/A') + ' %')}
    ${createInfoCard('👦', '15 - 24 ans', (ageData?.below25 ?? 'N/A') + ' %')}
    ${createInfoCard('👨', '25 - 64 ans', (ageData?.between25and64 ?? 'N/A') + ' %')}
    ${createInfoCard('👴', 'Plus de 65 ans', (ageData?.above65 ?? 'N/A') + ' %')}
    ${createInfoCard('🧓', 'Plus de 75 ans', (ageData?.above75 ?? 'N/A') + ' %')}
  `;
};

// Generate map
const generateMap = (city) => {
  const normalizedCityLabel = normalizeString(city.label);
  const communeData = communeMap.get(normalizedCityLabel);

  const map = L.map('map', {
    zoomControl: false, // Disable the default zoom control
  }).setView([communeData.latitude, communeData.longitude], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 6,
  }).addTo(map);

  L.marker([communeData.latitude, communeData.longitude]).addTo(map);
};

// Display info in city page
const displayCityInfo = (city, ageData, allData, communeData) => {

  const annualPopChange = allData?.annualPopChange ?? 'N/A';
  const emoji = annualPopChange > 0 ? '🔺' : (annualPopChange < 0 ? '🔻' : '📈');

  return `
    <div class="city-info-header">
      <h2>${city.label}</h2>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
    ${createInfoCard('👥', 'Population', (allData?.population?.toLocaleString('fr-FR').replace(/,/g, ' ') ?? 'N/A'))}
    ${createInfoCard('📉', 'Taux de chômage', (allData?.unemploymentRate2022 ?? 'N/A') + ' %')}
    ${createInfoCard(emoji, 'Évolution annuelle de la population', annualPopChange + ' %')}
    ${createInfoCard('💶', 'Salaire net horaire moyen', (allData?.averageNetSalary2021 ?? 'N/A') + ' €')}
    ${createInfoCard('👩‍💼', 'Salaire net horaire moyen des femmes', (allData?.womenNetSalary2021 ?? 'N/A') + ' €')}
    ${createInfoCard('👨‍💼', 'Salaire net horaire moyen des hommes', (allData?.menNetSalary2021 ?? 'N/A') + ' €')}
    ${createInfoCard('👶', 'Part des personnes de moins de 15 ans', (allData?.percentageYoungerThan15 ?? 'N/A') + ' %')}
    ${createInfoCard('👦👧', 'Part des personnes de moins de 25 ans', (allData?.percentageYoungerThan25 ?? 'N/A') + ' %')}
    ${createInfoCard('👩👨', 'Part des personnes de 25 à 64 ans', (allData?.percentageBetween25And64 ?? 'N/A') + ' %')}
    ${createInfoCard('👴👵', 'Part des personnes de 65 ans ou plus', (allData?.percentageOlderThan65 ?? 'N/A') + ' %')}
    ${createInfoCard('📉', 'Taux de pauvreté', (allData?.povertyRate ?? 'N/A') + ' %')}
    ${createInfoCard('📊', 'Taux d\'activité', (allData?.activityRateOverall ?? 'N/A') + ' %')}
    ${createInfoCard('👦📈', 'Taux d\'activité des 15 - 24 ans', (allData?.activityRate15To24 ?? 'N/A') + ' %')}
    ${createInfoCard('👩📈', 'Taux d\'activité des 25 - 54 ans', (allData?.activityRate25To54 ?? 'N/A') + ' %')}
    ${createInfoCard('👵📈', 'Taux d\'activité des 55 - 64 ans', (allData?.activityRate55To64 ?? 'N/A') + ' %')}
    ${createInfoCard('📬', 'Code Postal', communeData?.code_postal ?? 'N/A')}
    ${createInfoCard('📍', 'Code département', communeData?.code_departement ?? 'N/A')}
    ${createInfoCard('🏞️', 'Département', communeData?.nom_departement ?? 'N/A')}
    ${createInfoCard('🗺️', 'Code Région', communeData?.code_region ?? 'N/A')}
    ${createInfoCard('🌍', 'Région', communeData?.nom_region ?? 'N/A')}

    <h3>👨‍👩‍👧‍👦 Répartition par âge</h3>
    ${createInfoCard('👶', 'Moins de 15 ans', (ageData?.below15 ?? 'N/A') + ' %')}
    ${createInfoCard('👦', '15 - 24 ans', (ageData?.below25 ?? 'N/A') + ' %')}
    ${createInfoCard('👨', '25 - 64 ans', (ageData?.between25and64 ?? 'N/A') + ' %')}
    ${createInfoCard('👴', 'Plus de 65 ans', (ageData?.above65 ?? 'N/A') + ' %')}
    ${createInfoCard('🧓', 'Plus de 75 ans', (ageData?.above75 ?? 'N/A') + ' %')}

    <h3>🗺️ Localisation</h3>
    <div id="map"></div>
  `;
};




function createInfoCard(emoji, text, value) {
  return `
    <div class="info-card">
      <div class="emoji">${emoji}</div>
      <div class="info-value">${value}</div>
      <div class="info-text">${text}</div>
    </div>
  `;
}


// Fetch all city-related data and populate the respective maps
async function fetchCityData() {
    try {
        const [ageData, allData, communes] = await Promise.all([
            fetchData('/data/repartition_ages.json').then(data => data.Data),
            fetchData('/data/all_data.json').then(data => data.Data),
            fetchData('/data/communes_departement_region.json')
        ]);

        // Initialize allCityData
        allCityData = allData.map(entry => ({
            label: entry['Libellé']
        }));

        // Populate allDataMap
        allData.forEach(entry => {
            const normalizedLabel = normalizeString(entry.Libellé);
              
                allDataMap.set(normalizedLabel, {
                population: parseInt(entry["Population municipale 2020"], 10),
                annualPopChange: entry["Évol. annuelle moy. de la population 2014-2020"],
                unemploymentRate2022: entry["Taux de chômage annuel moyen 2022"],
                averageNetSalary2021: entry["Salaire net horaire moyen 2021"],
                womenNetSalary2021: entry["Salaire net hor. moy. des femmes 2021"],
                menNetSalary2021: entry["Salaire net hor. moy. des hommes 2021"],
                percentageYoungerThan15: entry["Part des pers. âgées de - 15 ans 2020"],
                percentageYoungerThan25: entry["Part des pers. âgées de - de 25 ans 2020"],
                percentageBetween25And64: entry["Part des pers. âgées de 25 à 64 ans 2020"],
                percentageOlderThan65: entry["Part des pers. âgées de 65 ans ou + 2020"],
                povertyRate: entry["Taux de pauvreté 2020"],
                activityRateOverall: entry["Taux d'activité par tranche d'âge 2020\r\r\nEnsemble"],
                activityRate15To24: entry["Taux d'activité par tranche d'âge 2020\r\r\n15 à 24 ans"],
                activityRate25To54: entry["Taux d'activité par tranche d'âge 2020\r\r\n25 à 54 ans"],
                activityRate55To64: entry["Taux d'activité par tranche d'âge 2020\r\r\n55 à 64 ans"]
            });
        });

        communes.forEach(entry => {
            const normalizedCommuneName = normalizeString(entry.libelle_acheminement);

                communeMap.set(normalizedCommuneName, {
                code_postal: entry.code_postal,
                latitude: entry.latitude,
                longitude: entry.longitude,
                code_departement: entry.code_departement,
                nom_departement: entry.nom_departement,
                code_region: entry.code_region,
                nom_region: entry.nom_region,
            });
        });

        // Populate ageDistributionMap
        ageData.forEach(entry => {
            const normalizedLabel = normalizeString(entry.Libellé);

            ageDistributionMap.set(normalizedLabel, {
                below15: entry["Part des pers. âgées de - 15 ans 2020"],
                below25: entry["Part des pers. âgées de - de 25 ans 2020"],
                between25and64: entry["Part des pers. âgées de 25 à 64 ans 2020"],
                above65: entry["Part des pers. âgées de 65 ans ou + 2020"],
                above75: entry["Part des pers. âgées de 75 ans ou + 2020"],
            });
        });

        // Initial display of cities
        displayCities(allCityData.slice(0, 10));

        console.log("All Data Map:", allDataMap);
        console.log("Age Distribution Map:", ageDistributionMap);
        console.log("Commune Map:", communeMap);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to display cities
const displayCities = (cities) => {
    const cityInfoDiv = document.getElementById('cityInfo');
    cityInfoDiv.innerHTML = "";

    // Sort cities by population
    cities.sort((a, b) => {
        const populationA = allDataMap.get(normalizeString(a.label))?.population ?? 0;
        const populationB = allDataMap.get(normalizeString(b.label))?.population ?? 0;
        return populationB - populationA; // Descending order
    });

    cities.forEach(city => {
        const normalizedCityLabel = normalizeString(city.label);
        const allData = allDataMap.get(normalizedCityLabel);
        const ageData = ageDistributionMap.get(normalizedCityLabel);
        const communeData = communeMap.get(normalizedCityLabel);
        
        // Check if communeData exists; if not, skip this city.
        if (communeData) {
          const cityElement = document.createElement('div');
          cityElement.id = 'city';
          
          cityElement.addEventListener('click', () => navigateToCity(city.label));
          
          cityElement.innerHTML = displayCitiesInfo(
            city,
            ageData,
            allData,
            communeData
          );
            cityInfoDiv.appendChild(cityElement);
        }
    });
};


// Event listener for the search bar
document.getElementById('searchBar').addEventListener('input', function (e) {
    const searchTerm = e.target.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics

    const filteredCities = allCityData.filter(city => {
        const normalizedCityLabel = city.label
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics

        return normalizedCityLabel.includes(searchTerm);
    });

    displayCities(filteredCities.slice(0, 10));
});

// Initial fetching of city data
fetchCityData();

// ---------------------------------------- Navigation ---------------------------------------- //

// Function to navigate to a city onclick
function navigateToCity(cityLabel) {
  history.pushState(null, '', `/city/${cityLabel}`);
  displaySingleCity(cityLabel);
}

// Function to display single city
function displaySingleCity(cityLabel) {
  const cityInfoDiv = document.getElementById('cityInfo');

  const containerDiv = document.createElement('div');
  containerDiv.className = 'city-card';

  const normalizedCityLabel = normalizeString(cityLabel);
  const allData = allDataMap.get(normalizedCityLabel);
  const ageData = ageDistributionMap.get(normalizedCityLabel);
  const communeData = communeMap.get(normalizedCityLabel);
  
  if (communeData) {

    // Generate city info and set it as the innerHTML of the container div
    containerDiv.innerHTML = displayCityInfo(
      { label: cityLabel },
      ageData,
      allData,
      communeData
      );
      
      // Clear existing content and append the new container div
      cityInfoDiv.innerHTML = '';
      cityInfoDiv.appendChild(containerDiv);

      // Generate map
      generateMap({ label: cityLabel });
  }
}

window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  const cityLabel = path.split('/city/')[1];
  
  if (cityLabel) {
    displaySingleCity(cityLabel);
  } else {
    // Logic to go back to main page
    displayCities(allCityData.slice(0, 10));
  }
});

// Function to return to the initial list of cities
function returnToInitialView() {
  window.history.pushState({}, "", "/");
  displayCities(allCityData.slice(0, 10));
}

// Add a click event listener to the element with id 'returnButton'
document.getElementById('returnButton').addEventListener('click', returnToInitialView);

