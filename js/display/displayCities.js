import { allDataMap, ageDistributionMap, communeMap } from '../utils/sharedData.js';
import { normalizeString } from '../utils/normalizeString.js';

export const displayCities = (cities) => {

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

        const updatedCity = { 
          ...city, 
          score: allData?.score
        };
        
        // Check if communeData exists; if not, skip this city.
        if (communeData) {
          const cityElement = document.createElement('div');
          cityElement.id = 'city';
          
          cityElement.addEventListener('click', () => navigateToCity(city.label));
          
          cityElement.innerHTML = displayCitiesInfo(
            updatedCity,
            ageData,
            allData,
            communeData
          );
            cityInfoDiv.appendChild(cityElement);
        }
    });
};

