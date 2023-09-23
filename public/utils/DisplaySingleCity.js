import { newDataMap, communesMap } from './Maps.js';
import { convertToCommuneFormat } from './ConvertToCommuneFormat.js';
import { generateMap } from './GenerateMap.js';
import { displayCityInfo } from './DisplayCityInfo.js';

// Function to display the info for a single city
export function displaySingleCity(cityLabel) {
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