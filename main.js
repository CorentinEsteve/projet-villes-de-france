import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

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

// Template function to create city info HTML
const displayCityInfo = (city, ageData, allData, communeData) => `
    <h2>${city.label}</h2>
    <p>Population: ${allData?.population.toLocaleString('fr-FR').replace(/,/g, ' ') ?? 'N/A'}</p>
    <p>Taux de chômage annuel moyen 2022: ${allData?.unemploymentRate2022 ?? 'N/A'}</p>
    <p>Évol. annuelle moy. de la population 2014-2020: ${allData?.annualPopChange ?? 'N/A'}</p>
    <p>Salaire net horaire moyen 2021: ${allData?.averageNetSalary2021 ?? 'N/A'}</p>
    <p>Salaire net hor. moy. des femmes 2021: ${allData?.womenNetSalary2021 ?? 'N/A'}</p>
    <p>Salaire net hor. moy. des hommes 2021: ${allData?.menNetSalary2021 ?? 'N/A'}</p>
    <p>Part des pers. âgées de - 15 ans 2020: ${allData?.percentageYoungerThan15 ?? 'N/A'}</p>
    <p>Part des pers. âgées de - de 25 ans 2020: ${allData?.percentageYoungerThan25 ?? 'N/A'}</p>
    <p>Part des pers. âgées de 25 à 64 ans 2020: ${allData?.percentageBetween25And64 ?? 'N/A'}</p>
    <p>Part des pers. âgées de 65 ans ou + 2020: ${allData?.percentageOlderThan65 ?? 'N/A'}</p>
    <p>Taux de pauvreté 2020: ${allData?.povertyRate ?? 'N/A'}</p>
    <p>Taux d'activité total 2020: ${allData?.activityRateOverall ?? 'N/A'}</p>
    <p>Taux d'activité 15 à 24 ans 2020: ${allData?.activityRate15To24 ?? 'N/A'}</p>
    <p>Taux d'activité 25 à 54 ans 2020: ${allData?.activityRate25To54 ?? 'N/A'}</p>
    <p>Taux d'activité 55 à 64 ans 2020: ${allData?.activityRate55To64 ?? 'N/A'}</p>

    <p>Code Postal: ${communeData?.code_postal ?? 'N/A'}</p>
    <p>Latitude: ${communeData?.latitude ?? 'N/A'}</p>
    <p>Longitude: ${communeData?.longitude ?? 'N/A'}</p>
    <p>Code Département: ${communeData?.code_departement ?? 'N/A'}</p>
    <p>Nom Département: ${communeData?.nom_departement ?? 'N/A'}</p>
    <p>Code Région: ${communeData?.code_region ?? 'N/A'}</p>
    <p>Nom Région: ${communeData?.nom_region ?? 'N/A'}</p>
    
    <h3>Répartition par âge</h3>
    <p>Moins de 15 ans : ${ageData?.below15 ?? 'N/A'} %</p>
    <p>15 - 24 ans : ${ageData?.below25 ?? 'N/A'} %</p>
    <p>25 - 64 ans : ${ageData?.between25and64 ?? 'N/A'} %</p>
    <p>Plus de 65 ans : ${ageData?.above65 ?? 'N/A'} %</p>
    <p>Plus de 75 ans : ${ageData?.above75 ?? 'N/A'} %</p>

`;


// Fetch all city-related data and populate the respective maps
async function fetchCityData() {
    try {
        const [ageData, allData, communes] = await Promise.all([
            fetchData('data/repartition_ages.json').then(data => data.Data),
            fetchData('data/all_data.json').then(data => data.Data),
            fetchData('data/communes_departement_region.json')
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
            cityElement.innerHTML = displayCityInfo(
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

