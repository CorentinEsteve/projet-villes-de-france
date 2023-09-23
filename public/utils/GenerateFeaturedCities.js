import { sortCities } from './SortCities.js';
import { capitalizeFirstLetterOfEachWord } from './CapitalizeFirstLetterOfEachWord.js';

export function generateFeaturedCities(newDataMap) {
    const allCityLabels = Array.from(newDataMap.keys());
    const sortedCityLabels = sortCities(allCityLabels, 'scoreDesc', newDataMap).slice(0, 3);  // Take top 3

    const featuredDiv = document.getElementById('featured');
    const featuredCitiesDiv = document.createElement('div');
    featuredCitiesDiv.className = 'featured';
    featuredDiv.appendChild(featuredCitiesDiv);

    sortedCityLabels.forEach((cityLabel) => {
        const cityData = newDataMap.get(cityLabel);
        let score = cityData?.score;
        let displayScore = !isNaN(parseFloat(score)) ? `${score}` : '-';

        const capitalizedCityLabel = capitalizeFirstLetterOfEachWord(cityLabel);

        const cardHTML = `
            <div class="card">
            <div class="card-header">
                <h2>${capitalizedCityLabel}</h2>
                <p>Score: ${displayScore}</p>
            </div>
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </div>
        `;

        featuredCitiesDiv.innerHTML += cardHTML;
    });
}