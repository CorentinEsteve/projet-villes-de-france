import { medianValues } from './public/utils/medians_averages.js';
import { createInfoCard } from './public/utils/CreateInfoCard.js';
import { createInfoList } from './public/utils/CreateInfoList.js';
import { calculateCityScore } from './public/utils/CalculateCityScore.js';
import { fetchCityData } from './public/utils/FetchCityData.js';
import { communesMap, newDataMap } from './public/utils/Maps.js';
import { capitalizeFirstLetterOfEachWord } from './public/utils/CapitalizeFirstLetterOfEachWord.js';
import { generateMap } from './public/utils/GenerateMap.js';
import { initializeTemperatureChart } from './public/utils/InitializeTemperatureChart.js';
import { initializeCriminalityChart } from './public/utils/InitializeCriminalityChart.js';
import { sortCities } from './public/utils/SortCities.js';
import { generateFeaturedCities } from './public/utils/GenerateFeaturedCities.js';
import { convertToCommuneFormat } from './public/utils/ConvertToCommuneFormat.js';

// ------------------------------ Display city info ------------------------------ //

// Function to display the info for a single city
function displaySingleCity(cityLabel) {
  const cityData = newDataMap.get(cityLabel);
  const convertedLabel = convertToCommuneFormat(cityLabel);
  const communeData = communesMap.get(convertedLabel);

  if (cityData && communeData) {
    const container = document.getElementById('cityList');
    container.innerHTML = displayCityInfo(cityLabel, cityData, communeData);

    // Only generate the map if both cityData and communeData are available
    generateMap({
      label: cityLabel,
      latitude: communeData.latitude,
      longitude: communeData.longitude
    });
  } else {
    console.error(`No data found for ${cityLabel}`);
  }
}


// Function to display info in city page
function displayCityInfo(cityLabel, cityData, communeData) {

  const annualPopChange = cityData?.annualPopChange2014To2020 ?? 'N/A';
  const emoji = annualPopChange > 0 ? '🔺' : (annualPopChange < 0 ? '🔻' : '📈');

  const departmentName = communeData?.nom_departement; 
  const departmentData = newDataMap.get(departmentName);
  
  if (departmentName) {
    setTimeout(() => initializeTemperatureChart(departmentName), 100);
    setTimeout(() => initializeCriminalityChart(cityData, medianValues), 100);
  }

  const aopList = communeData?.aop?.map(aop => aop.aop).join(', ') || 'Aucun produit répertorié';
  let score = cityData?.score;
  let displayScore = !isNaN(parseFloat(score)) ? `${score} / 10` : '- / 10';

  return `
  <div class="city-info">
  
    <div class="city-info-header">
      <h2>${cityLabel}</h2>
      <p>${displayScore}</p>
    </div>

    ${createInfoCard('📬', 'Code Postal', communeData?.code_postal ?? 'N/A', '')}
    ${createInfoCard('📍', 'Code département', communeData?.code_departement ?? 'N/A', '')}
    ${createInfoCard('🏞️', 'Département', communeData?.nom_departement ?? 'N/A', '')}
    ${createInfoCard('🗺️', 'Code Région', communeData?.code_region ?? 'N/A', '')}
    ${createInfoCard('🌍', 'Région', communeData?.nom_region ?? 'N/A', '')}

    <h3>🏛️ &nbsp; Données générales</h3>
    ${createInfoCard('👥', 'Population', (cityData?.population2020 ?? 'N/A'), '', medianValues.MedianPopulation)}
    ${createInfoCard(emoji, 'Évolution annuelle de la population', annualPopChange, '%', medianValues.AveragePopulationEvolution)}
    ${createInfoCard('🏙️', 'Densité de population', (cityData?.populationDensity2020 !== undefined ? Math.round(cityData?.populationDensity2020) : 'N/A'), 'hab/km²', medianValues.MedianDensity)}
    
    <h3>💰 &nbsp; Salaire</h3>
    ${createInfoCard('💶', 'Salaire net horaire moyen', (departmentData?.averageNetHourlyWage2021 ?? 'N/A'), '€', medianValues.MedianHourlyNetSalary2021)}
    ${createInfoCard('👩‍💼', 'Salaire net horaire moyen des femmes', (departmentData?.averageNetHourlyWageWomen2021 ?? 'N/A'), '€', medianValues.MedianHourlyNetSalaryWomen_2021)}
    ${createInfoCard('👨‍💼', 'Salaire net horaire moyen des hommes', (departmentData?.averageNetHourlyWageMen2021 ?? 'N/A'), '€', medianValues.MedianHourlyNetSalaryMen_2021)}
    
    <h3>👨‍⚕️ &nbsp; Emploi </h3>
    ${createInfoCard('📊', 'Taux d\'activité', (cityData?.overallActivityRate2020 ?? 'N/A'), '%', medianValues.MedianActivityRate)}
    ${createInfoCard('📉', 'Taux de chômage', (departmentData?.averageAnnualUnemploymentRate2022 ?? 'N/A'), '%', medianValues.MedianUnemploymentRate2022)}

    <h3>👨‍👩‍👧‍👦 &nbsp; Répartition des âge</h3>
    ${createInfoCard('👶', 'Moins de 15 ans', (cityData?.under15AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeUnder15)}
    ${createInfoCard('👦', 'Moins de 25 ans', (cityData?.under25AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeUnder25)}
    ${createInfoCard('🧓', '25 - 64 ans', (cityData?.between25To64AgePart2020 ?? 'N/A'), '%', medianValues.MedianAge25to64)}
    <div class="break"></div>
    ${createInfoCard('👨', 'Plus de 65 ans', (cityData?.above65AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeOver65)}
    ${createInfoCard('👵', 'Plus de 75 ans', (cityData?.above75AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeOver75)}
    ${createInfoCard('👴', 'Plus de 80 ans', (cityData?.above80AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeOver80)}

    <h3>🚗 &nbsp; Transports</h3>
    ${createInfoCard('🚲', 'Part des actifs occupés de 15 ans ou plus utilisant le vélo pour aller travailler', (cityData?.bikeUseForWork2020 ?? 'N/A'), '%', medianValues.MedianBicycleUsageRate2020)}
    ${createInfoCard('🚆', 'Part des actifs occupés de 15 ans ou plus utilisant les transports en commun pour aller travailler', (cityData?.publicTransitUse2020 ?? 'N/A'), '%', medianValues.MedianPublicTransportUsageRate2020)}
    ${createInfoCard('🚗', 'Part des actifs occupés de 15 ans ou plus utilisant la voiture pour aller travailler', (cityData?.carUseForWork2020 ?? 'N/A'), '%', medianValues.MedianCarUsageRate2020)}

    <h3>👮‍♀️ &nbsp; Criminalité</h3>
    <div class="chart-container">
      <canvas id="criminality"></canvas>
    </div>

    <div class="break"></div>

    <h3>🌡️ &nbsp; Températures annuelles</h3>
    <div class="chart-container">
      <canvas id="temperatures"></canvas>
    </div>
    
    <h3>🧀 &nbsp; Produits AOP</h3>
    ${createInfoCard('🧀🍷', 'Produits AOP', aopList, '')}

    <h3>🏨 &nbsp; Tourisme</h3>
    ${createInfoCard('🏨', ' Hôtels', (cityData?.numHotels2023 ?? 'N/A'), '')}
    ${createInfoCard('🏨', ' Chambres d\'hôtel', (cityData?.numHotelRooms2023 ?? 'N/A'), '')}
    ${createInfoCard('🏨', ' Hôtels économiques ou non classés', (cityData?.numEconomicHotels ?? 'N/A'), '')}
    ${createInfoCard('🏨', ' Hôtels milieu de gamme', (cityData?.numMidRangeHotels ?? 'N/A'), '')}
    ${createInfoCard('🏨', ' Hôtels haut de gamme', (cityData?.numHighEndHotels ?? 'N/A'), '')}
    ${createInfoCard('⛺️', ' Terrains de camping', (cityData?.numCampingSites2023 ?? 'N/A'), '')}

    <h3>🏥 &nbsp; Santé</h3>
    ${createInfoCard('🏥', 'Services d\'urgence', (cityData?.numEmergencyServices2021 ?? 'N/A'), '')}
    ${createInfoCard('🏫', 'Pharmacies', (cityData?.numPharmacies2021 ?? 'N/A'), '')}
    <div class="break"></div>
    ${createInfoCard('👩‍⚕️', 'Médecins généralistes', (cityData?.numGeneralDoctors2021 ?? 'N/A'), '')}
    ${createInfoCard('👨‍⚕️', 'Chirurgiens dentistes', (cityData?.numDentists2021 ?? 'N/A'), '')}
    ${createInfoCard('🧑‍⚕️', 'Infirmiers', (cityData?.numNurses2021 ?? 'N/A'), '')}
    ${createInfoCard('🧑‍⚕️', 'Masseurs kinésithérapeutes', (cityData?.numPhysiotherapists2021 ?? 'N/A'), '')}

    <h3>🏫 &nbsp; Éducation</h3>

    <div class="table-wrapper">
      <table class="info-list">
        ${createInfoList('🏫', 'Crèches', (cityData?.numDaycare2021 ?? 'N/A'), '')}
        ${createInfoList('🏫', 'Écoles maternelles', (cityData?.numKindergarten2021 ?? 'N/A'), '')}
        ${createInfoList('🏫', 'Écoles élémentaires', (cityData?.numElementarySchool2021 ?? 'N/A'), '')}
        ${createInfoList('🏫', 'Collèges', (cityData?.numMiddleSchool2021 ?? 'N/A'), '')}
        ${createInfoList('🏫', 'Lycées', (cityData?.numHighSchool2021 ?? 'N/A'), '')}
      </table>
    </div>

    <h3>🏘️ &nbsp; Logement</h3>
    ${createInfoCard('🏠', 'Part des résidences principales', (cityData?.primaryResidenceRate2020 ?? 'N/A'), '%', medianValues.MedianMainResidenceRate2020)}
    ${createInfoCard('🏠', 'Part des résidences secondaires', (cityData?.secondaryResidenceRate2020 ?? 'N/A'), '%', medianValues.MedianSecondaryResidenceRate2020)}
    ${createInfoCard('🏠', 'Part des logements vacants', (cityData?.vacantHousingRate2020 ?? 'N/A'), '%', medianValues.MedianVacantHousingRate2020)}

    <h3>🏠 &nbsp; Type de logement</h3>
    ${createInfoCard('🏠', 'Part des appartements', (cityData?.apartmentRate2020 ?? 'N/A'), '%', medianValues.MedianApartmentRate2020)}
    ${createInfoCard('🏡', 'Part des maisons', (cityData?.houseRate2020 ?? 'N/A'), '%', medianValues.MedianHouseRate2020)}

    <h3>👩‍🎓 &nbsp; Éducation</h3>
    ${createInfoCard('👨‍💼', 'Part sans diplôme', (cityData?.noOrLowEducationPart2020 ?? 'N/A'), '%', medianValues.MedianNoOrLowEducation)}
    ${createInfoCard('👨‍💼', 'Part des diplômés d\'un Brevet des collèges', (cityData?.capOrBepEducationPart2020 ?? 'N/A'), '%', medianValues.MedianBEPCOrBrevet)}
    ${createInfoCard('👨‍💼', 'Part des diplômés d\'un CAP, BEP ou équivalent', (cityData?.bepcOrBrevetEducationPart2020 ?? 'N/A'), '%', medianValues.MedianCAPorBEP)}
    <div class="break"></div>
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC', (cityData?.bacEducationPart2020 ?? 'N/A'), '%', medianValues.MedianBac)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+2', (cityData?.bacPlus2EducationPart2020 ?? 'N/A'), '%', medianValues.MedianBacPlus2)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+3 ou BAC+4', (cityData?.bacPlus3Or4EducationPart2020 ?? 'N/A'), '%', medianValues.MedianBacPlus3or4)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+5 ou plus', (cityData?.bacPlus5OrAboveEducationPart2020 ?? 'N/A'), '%', medianValues.MedianBacPlus5OrMore)}

    <h3>🗺️ &nbsp; Localisation</h3>
    <div id="map"></div>
  </div>
  `;
}

// ------------------------------ START Navigation ------------------------------ //

function navigateToCity(cityLabel) {
  history.pushState(null, '', `/city/${cityLabel}`);
  displaySingleCity(cityLabel)
}

// Function to return to the initial list of cities
function returnToInitialView() {
  window.history.pushState({}, "", "/");
  displayCities();
}


// Return to initial view when back button is clicked
window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  const cityLabel = path.split('/city/')[1];

  if (cityLabel) {
    displaySingleCity(cityLabel);
  } else {
    // Logic to go back to main page
    displayCities();
  }
});

// Add a click event listener to the element with id 'returnButton'
document.getElementById('logo').addEventListener('click', returnToInitialView);


// ------------------------------ Filter cities ------------------------------ //

document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('searchBar');
  const sortingSelect = document.getElementById('sortingSelect');
  const cityList = document.getElementById('container');
  let start = 0;
  const count = 200;
  let currentFilter = '';

  // allow flexibility in search by removing accents, hyphens, and single quotes
  const normalizeSearchString = (str) => {
    return str
      .normalize('NFD').replace(/[\u0300-\u036f]/g, "")  // Remove accents
      .replace(/-/g, ' ')  // Replace hyphens with spaces
      .replace(/'/g, ' ')  // Replace single quotes with spaces
      .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
      .replace(/\bst\b/gi, 'saint')  // Replace 'st' with 'saint'
      .trim()  // Remove leading and trailing spaces
      .toLowerCase();
  };

  const getFilteredCityLabels = () => {
    if (!currentFilter) {
      return Array.from(newDataMap.keys());
    }
  
    const normalizedFilter = normalizeSearchString(currentFilter).toLowerCase();
    // console.log("Normalized Filter:", normalizedFilter);
  
    const filteredLabels = [];
  
    for (const cityLabel of newDataMap.keys()) {
      const normalizedCityLabel = normalizeSearchString(cityLabel).toLowerCase();
      // console.log("Normalized City Label:", normalizedCityLabel);
  
      if (normalizedCityLabel.includes(normalizedFilter)) {
        filteredLabels.push(cityLabel);
      }
    }
  
    return filteredLabels;
  };

  searchBar.addEventListener('input', (event) => {
    currentFilter = event.target.value;
    const cityLabels = sortCities(getFilteredCityLabels(), sortingSelect.value, newDataMap);
    start = 0;
    displayCities(start, count, cityLabels);
  });

  sortingSelect.addEventListener('change', (event) => {
    const sortingOption = event.target.value;
    const cityLabels = sortCities(getFilteredCityLabels(), sortingOption, newDataMap);
    start = 0;
    displayCities(start, count, cityLabels);
  });

  // Initial load
  const defaultSortingOption = 'populationDesc';
  const sortedInitialCityLabels = sortCities(getFilteredCityLabels(), defaultSortingOption, newDataMap);
  displayCities(start, count, sortedInitialCityLabels);

  cityList.addEventListener('scroll', () => {
    if (cityList.scrollTop + cityList.clientHeight >= cityList.scrollHeight) {
      start += count;
      const cityLabels = getFilteredCityLabels();
      displayCities(start, count, cityLabels);
    }
  });
});


// ------------------------------ Initialization ------------------------------ //

// Fetch the data and display the cities
async function init() {
  const loader = document.getElementById('loader');
  const mainContent = document.getElementById('container');

  // Show the loader
  loader.style.display = 'flex';  
  mainContent.style.display = 'none';

  await fetchCityData();

  // Calculate the scores for all cities here before displaying them
  for (const [cityLabel, cityData] of newDataMap) {
    const convertedLabel = convertToCommuneFormat(cityLabel);
    const communeData = communesMap.get(convertedLabel);

    const departmentName = communeData?.nom_departement;
    const departmentData = newDataMap.get(departmentName);
    
    let score = cityData?.score;
    if (typeof score === 'undefined' || score === null) {
      score = calculateCityScore(medianValues, cityData, departmentData);
      cityData.score = score; // Store the score back into cityData
    }
  }

  generateFeaturedCities(newDataMap, communesMap);


  // Check the current URL pathname, return to city on reload
  const path = window.location.pathname;
  const cityLabel = path.split('/city/')[1];

  if (cityLabel) {
    displaySingleCity(cityLabel);
  } else {
    displayCities();
  }

  // Hide the loader and show main content
  loader.style.display = 'none';
  mainContent.style.display = 'block';
}


function initializeTable() {
  const container = document.getElementById('cityList');
  container.innerHTML = `
    <table id="cityTable">
      <thead>
        <tr>
          <th>Nom de la ville</th>
          <th>Code postal</th>
          <th>Population</th>
          <th>CityScore</th>
          <th></th>
        </tr>
      </thead>
      <tbody id="cityTableBody">
      </tbody>
    </table>
  `;
}

function appendCityRows(toDisplay, tableBody) {
  toDisplay.forEach(cityLabel => {
    const cityData = newDataMap.get(cityLabel);
    const convertedLabel = convertToCommuneFormat(cityLabel);  // Convert to the commune format

    const communeData = communesMap.get(convertedLabel);

    if (!communeData) {
      // console.log(`No data found in communesMap for ${convertedLabel}`);
      return;
    }

    if (cityData && communeData) {
      let score = cityData?.score;
      let displayScore = !isNaN(parseFloat(score)) ? `${score} / 10` : '- / 10';

      const cityRow = document.createElement('tr');
      cityRow.className = 'city-row';
      cityRow.innerHTML = `
        <td>${cityLabel}</td>
        <td>${communeData.code_postal.toLocaleString('fr-FR')}</td>
        <td>${cityData.population2020.toLocaleString('fr-FR')}</td>
        <td>${displayScore}</td>
        <td class="arrow"><i class="fas fa-arrow-right"></i></td>
      `;

      cityRow.addEventListener('click', () => navigateToCity(cityLabel));

      tableBody.appendChild(cityRow);
    }
  });
}




let start = 0;
let count = 20;
let currentFilter = '';

function displayCities(start = 0, count = 20, cityLabels = []) {
  cityLabels = cityLabels.length ? cityLabels : sortCities(Array.from(newDataMap.keys()), 'populationDesc', newDataMap);
  
  if (start === 0) {
    initializeTable();
  }

  const tableBody = document.getElementById('cityTableBody');
  const toDisplay = cityLabels.slice(start, start + count);

  appendCityRows(toDisplay, tableBody);
}


init();
