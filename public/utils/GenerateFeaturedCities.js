import { sortCities } from './SortCities.js';
import { capitalizeFirstLetterOfEachWord } from './CapitalizeFirstLetterOfEachWord.js';
import { navigateToCity } from './NavigateToCity.js';
import { convertToCommuneFormat } from './ConvertToCommuneFormat.js';

export function generateFeaturedCities(newDataMap, communesMap) {
    const allCityLabels = Array.from(newDataMap.keys());
    const sortedCityLabels = sortCities(allCityLabels, 'scoreDesc', newDataMap).slice(0, 3);  // Take top 3

    const featuredDiv = document.getElementById('featured');
    const featuredCitiesDiv = document.createElement('div');
    featuredCitiesDiv.className = 'featured';
    featuredDiv.appendChild(featuredCitiesDiv);

    sortedCityLabels.forEach((cityLabel) => {
        const convertedLabel = convertToCommuneFormat(cityLabel);
        const communeData = communesMap.get(convertedLabel);

        const cityData = newDataMap.get(cityLabel);
        let score = cityData?.score;
        let displayScore = !isNaN(parseFloat(score)) ? `${score}` : '-';

        const capitalizedCityLabel = capitalizeFirstLetterOfEachWord(cityLabel);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <h2>${capitalizedCityLabel}</h2>
                <h3>${communeData.nom_departement} (${communeData.code_departement})</h3>
                <p>CityScore: ${displayScore}</p>
            </div>
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
        `;

        // Add click event listener to the card
        card.addEventListener('click', () => {
            navigateToCity(cityLabel);
        });

        featuredCitiesDiv.appendChild(card);
    });
}
