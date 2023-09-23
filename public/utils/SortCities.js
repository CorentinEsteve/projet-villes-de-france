export function sortCities(cityLabels, sortingOption, newDataMap) {
    if (sortingOption === 'scoreAsc') {
        // Pre-filter the city labels to only include those with a valid score
        cityLabels = cityLabels.filter((cityLabel) => {
            const cityData = newDataMap.get(cityLabel);
            const score = cityData ? parseFloat(cityData.score) : null;
            return !isNaN(score) && score !== null;
        });
    }

    return cityLabels.sort((a, b) => {
        const cityDataA = newDataMap.get(a);
        const cityDataB = newDataMap.get(b);
        let scoreA = cityDataA ? parseFloat(cityDataA.score ?? 0) : 0;
        let scoreB = cityDataB ? parseFloat(cityDataB.score ?? 0) : 0;

        // Replace NaN scores with 0
        if (isNaN(scoreA)) scoreA = 0;
        if (isNaN(scoreB)) scoreB = 0;

        switch (sortingOption) {
            case 'populationDesc':
            return (cityDataB.population2020 ?? 0) - (cityDataA.population2020 ?? 0);
            case 'populationAsc':
            return (cityDataA.population2020 ?? 0) - (cityDataB.population2020 ?? 0);
            case 'scoreDesc':
            return scoreB - scoreA;
            case 'scoreAsc':
            return scoreA - scoreB;
            default:
            return 0;
        }
    });
}