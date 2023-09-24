import { medianValues } from './public/utils/medians_averages.js';
import { calculateCityScore } from './public/utils/CalculateCityScore.js';
import { fetchCityData } from './public/utils/FetchCityData.js';
import { communesMap, newDataMap } from './public/utils/Maps.js';
import { sortCities } from './public/utils/SortCities.js';
import { generateFeaturedCities } from './public/utils/GenerateFeaturedCities.js';
import { convertToCommuneFormat } from './public/utils/ConvertToCommuneFormat.js';
import { navigateToCity } from './public/utils/NavigateToCity.js';
import { displaySingleCity } from './public/utils/DisplaySingleCity.js';


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
      const scoreData = calculateCityScore(medianValues, cityData, departmentData);
      cityData.score = scoreData.totalScore; 
      cityData.scoreData = scoreData; 
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
    const convertedLabel = convertToCommuneFormat(cityLabel);

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
