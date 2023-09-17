// Maps to hold data
const allDataMap = new Map();
const ageDistributionMap = new Map();
const communeMap = new Map();
let allCityData = [];

const medianValues = {
  population: 125620,
  evolutionPopulation: 0.13,
  tauxDePauvrete: 13.5,
  tauxDeChomage: 6.7,
  salaire: 14.13,
  salaireFemme: 12.81,
  salaireHomme: 15,
  partDesMoins15Ans: 16.8,
  partDesMoins25Ans: 27.1,
  partDes25a64Ans: 49.3,
  partDes65AnsEtPlus: 23.5,
  tauxDActiviteEnsemble: 74.8,
  tauxDActivite15A24ans: 45.1,
  tauxDActivite25A54ans: 91.2,
  tauxDActivite55A64ans: 54.9,

  partMoins15ans: 15.5,
  partMoins24ans: 25.5,
  part25A64ans: 49.4,
  partPlus65ans: 19.6,
  partPlus75ans: 7.8,
};

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
      <p>Plus d'information</p>
      <i class="fa-solid fa-chevron-right" style="color: #333; font-size: 12px;"></i>
    </div>
    ${createInfoCard('👥', 'Population', (allData?.population ?? 'N/A'), '', medianValues.population)}
    ${createInfoCard('📉', 'Taux de chômage', (allData?.unemploymentRate2022 ?? 'N/A'), '%', medianValues.tauxDeChomage)}
    ${createInfoCard(emoji, 'Évolution de la population', annualPopChange, '%', medianValues.evolutionPopulation)}
    ${createInfoCard('💶', 'Salaire net horaire moyen', (allData?.averageNetSalary2021 ?? 'N/A'), '€', medianValues.salaire)}
    ${createInfoCard('📉', 'Taux de pauvreté', (allData?.povertyRate ?? 'N/A'), '%', medianValues.tauxDePauvrete)}
    ${createInfoCard('📊', 'Taux d\'activité', (allData?.activityRateOverall ?? 'N/A'), '%', medianValues.tauxDActiviteEnsemble)}
    ${createInfoCard('📬', 'Code Postal', communeData?.code_postal ?? 'N/A', '')}
    ${createInfoCard('🌍', 'Région', communeData?.nom_region ?? 'N/A', '')}

    <h3>👨‍👩‍👧‍👦 Répartition par âge</h3>
    ${createInfoCard('👶', 'Moins de 15 ans', (ageData?.below15 ?? 'N/A'), '%', medianValues.partMoins15ans)}
    ${createInfoCard('👦', 'Moins de 24 ans', (ageData?.below25 ?? 'N/A'), '%', medianValues.partMoins24ans)}
    ${createInfoCard('👨', '25 - 64 ans', (ageData?.between25and64 ?? 'N/A'), '%', medianValues.part25A64ans)}
    ${createInfoCard('👴', 'Plus de 65 ans', (ageData?.above65 ?? 'N/A'), '%', medianValues.partPlus65ans)}
  `;
};


// Display info in city page
const displayCityInfo = (city, ageData, allData, communeData) => {
  const annualPopChange = allData?.annualPopChange ?? 'N/A';
  const emoji = annualPopChange > 0 ? '🔺' : (annualPopChange < 0 ? '🔻' : '📈');

  return `
  <div class="city-info-header">
    <h2>${city.label}</h2>
    <p></p>
  </div>
  
  ${createInfoCard('📬', 'Code Postal', communeData?.code_postal ?? 'N/A', '')}
  ${createInfoCard('📍', 'Code département', communeData?.code_departement ?? 'N/A', '')}
  ${createInfoCard('🏞️', 'Département', communeData?.nom_departement ?? 'N/A', '')}
  ${createInfoCard('🗺️', 'Code Région', communeData?.code_region ?? 'N/A', '')}
  ${createInfoCard('🌍', 'Région', communeData?.nom_region ?? 'N/A', '')}

  <h3>🏛️ Données générales</h3>
  ${createInfoCard('👥', 'Population', (allData?.population ?? 'N/A'), '', medianValues.population)}
  ${createInfoCard('📉', 'Taux de chômage', (allData?.unemploymentRate2022 ?? 'N/A'), '%', medianValues.tauxDeChomage)}
  ${createInfoCard(emoji, 'Évolution de la population', annualPopChange, '%', medianValues.evolutionPopulation)}

  <h3>💰 Salaire</h3>
  ${createInfoCard('💶', 'Salaire net horaire moyen', (allData?.averageNetSalary2021 ?? 'N/A'), '€', medianValues.salaire)}
  ${createInfoCard('👩‍💼', 'Salaire net horaire moyen des femmes', (allData?.womenNetSalary2021 ?? 'N/A'), '€', medianValues.salaireFemme)}
  ${createInfoCard('👨‍💼', 'Salaire net horaire moyen des hommes', (allData?.menNetSalary2021 ?? 'N/A'), '€', medianValues.salaireHomme)}
  ${createInfoCard('📉', 'Taux de pauvreté', (allData?.povertyRate ?? 'N/A'), '%', medianValues.tauxDePauvrete)}

  <h3>👨‍⚕️👷‍♀️ Taux d'activité</h3>
  ${createInfoCard('📊', 'Taux d\'activité', (allData?.activityRateOverall ?? 'N/A'), '%', medianValues.tauxDActiviteEnsemble)}
  ${createInfoCard('👦📈', 'Taux d\'activité des 15 - 24 ans', (allData?.activityRate15To24 ?? 'N/A'), '%', medianValues.tauxDActivite15A24ans)}
  ${createInfoCard('👩📈', 'Taux d\'activité des 25 - 54 ans', (allData?.activityRate25To54 ?? 'N/A'), '%', medianValues.tauxDActivite25A54ans)}
  ${createInfoCard('👵📈', 'Taux d\'activité des 55 - 64 ans', (allData?.activityRate55To64 ?? 'N/A'), '%', medianValues.tauxDActivite55A64ans)}

  <h3>👨‍👩‍👧‍👦 Répartition par âge</h3>
  ${createInfoCard('👶', 'Moins de 15 ans', (ageData?.below15 ?? 'N/A'), '%', medianValues.partMoins15ans)}
  ${createInfoCard('👦', 'Moins de 25 ans', (ageData?.below25 ?? 'N/A'), '%', medianValues.partMoins24ans)}
  ${createInfoCard('👨', '25 - 64 ans', (ageData?.between25and64 ?? 'N/A'), '%', medianValues.part25A64ans)}
  ${createInfoCard('👴', 'Plus de 65 ans', (ageData?.above65 ?? 'N/A'), '%', medianValues.partPlus65ans)}
  ${createInfoCard('🧓', 'Plus de 75 ans', (ageData?.above75 ?? 'N/A'), '%', medianValues.partPlus75ans)}
  
  <h3>🗺️ Localisation</h3>
  <div id="map"></div>
`;

    // <div class="chart-container">
    //   <canvas id="bar-chart" height="200"></canvas>
    // </div>
};

function createInfoCard(emoji, text, value, type, medianValue) {
  let formattedValue;

  // Check if the value is "population" and format accordingly
  if (text === 'Population') {
    formattedValue = value.toLocaleString('fr-FR');
  } else {
    formattedValue = value.toLocaleString('fr-FR'); // Format other values as well
  }

  const percentage = (medianValue !== 0) ? ((value / medianValue) * 100).toFixed(2) : 0;

  let populationPercentage, medianPercentage, comparisonDiv;

  if (percentage <= 100) {
    populationPercentage = 100;
    medianPercentage = percentage;
  } else {
    populationPercentage = 100 / (percentage / 100); // Cap populationPercentage at 100% and calculate medianPercentage
    medianPercentage = 100;
  }

  if (medianValue !== undefined) {
    let textColor;
    let comparisonText;
    
    if (percentage >= 96 && percentage <= 104) {
      textColor = 'darkslateblue'; // Use light blue for "égal à la médiane"
      comparisonText = 'proche de la médiane';
    } else {
      textColor = percentage <= 100 ? 'firebrick' : 'green'; // Determine text color for other cases
      comparisonText = percentage <= 100 ? 'inférieur à la médiane' : 'supérieur à la médiane';
    }

    if (text === 'Taux de chômage' || text === 'Taux de pauvreté') {
      textColor = percentage <= 100 ? 'green' : 'red';
    }
  
    comparisonDiv = `
      <div class="comparison">
        <p style="font-size: 9px; color: ${textColor};">${comparisonText}</p>
        <div class="comparison-line" style="width: ${medianPercentage}%; background-color: ${textColor};"></div>
        <div class="comparison-line" style="width: ${populationPercentage}%; background-color: grey;"></div>
      </div>
    `;
  } else {
    comparisonDiv = ''; // No comparison if median value is undefined
  }

  return `
    <div class="info-card">
      <div class="emoji">${emoji}</div>
      <div class="info-value">${formattedValue}${type ? ` ${type}` : ''}</div>
      <div class="info-text">${text}</div>
      ${comparisonDiv}
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


// ---------------------------------------- Map ---------------------------------------- //

// Generate map
const generateMap = (city) => {
  const normalizedCityLabel = normalizeString(city.label);
  const communeData = communeMap.get(normalizedCityLabel);

  const map = L.map('map', {
    zoomControl: false, // Disable the default zoom control
  }).setView([communeData.latitude, communeData.longitude], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 6,
  }).addTo(map);

  L.marker([communeData.latitude, communeData.longitude]).addTo(map);
};


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
      // generateBarChart(cityLabel);
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


// ---------------------------------------- Charts ---------------------------------------- //

function generateBarChart(cityLabel) {
  const normalizedCityLabel = normalizeString(cityLabel);
  const allData = allDataMap.get(normalizedCityLabel);
  const ageData = ageDistributionMap.get(normalizedCityLabel);
  const communeData = communeMap.get(normalizedCityLabel);

  const ctx = document.getElementById('bar-chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Moins de 15 ans', '15 - 24 ans', '25 - 64 ans', 'Plus de 65 ans', 'Plus de 75 ans'],
      datasets: [{
        label: 'Répartition par âge',
        backgroundColor: 'lightgrey',
        borderColor: 'grey',
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: 'bottom',
        data: [
          ageData?.below15 ?? 0,
          ageData?.below25 ?? 0,
          ageData?.between25and64 ?? 0,
          ageData?.above65 ?? 0,
          ageData?.above75 ?? 0
        ]
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        y: {
          display: false
        },
        x: {
          beginAtZero: true,
          ticks: {
            display: false
          },
          grid: {
            display: false,
            drawBorder: false
          },
          offset: true,
          drawTicks: false,
          drawOnChartArea: false,
        }
      },
      layout: {
        padding: {
          top: 10, 
          bottom: 10,
        }
      }
    }
  });
  
  
  
}
