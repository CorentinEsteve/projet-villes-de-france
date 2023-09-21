// import { fetchData } from './js/data/fetchData.js';
// import { normalizeString } from './js/utils/normalizeString.js';
// import { calculateCityScore } from './models/calculateCityScore.js';
// import { displayCities, displaySingleCity } from './display/displayCities.js';
import { medianValues } from './medians_averages.js';

// Maps to hold data
const newDataMap = new Map();
const temperaturesMap = new Map();
const communesMap = new Map();

const temperatureMediansNationalLast5Years = [{"month":1,"tmin":1.8,"tmax":8.2,"tmoy":5.0},{"month":2,"tmin":3.4,"tmax":12.0,"tmoy":7.9},{"month":3,"tmin":4.5,"tmax":13.8,"tmoy":9.3},{"month":4,"tmin":6.4,"tmax":16.7,"tmoy":11.6},{"month":5,"tmin":9.6,"tmax":20.0,"tmoy":14.8},{"month":6,"tmin":14.0,"tmax":25.2,"tmoy":19.6},{"month":7,"tmin":15.2,"tmax":27.0,"tmoy":20.8},{"month":8,"tmin":15.5,"tmax":26.9,"tmoy":21.1},{"month":9,"tmin":12.9,"tmax":23.4,"tmoy":18.1},{"month":10,"tmin":10.2,"tmax":18.2,"tmoy":14.0},{"month":11,"tmin":5.6,"tmax":12.4,"tmoy":9.0},{"month":12,"tmin":3.7,"tmax":10.1,"tmoy":6.8}];

function findMedianTemperatureForMonth(month) {
  const monthData = temperatureMediansNationalLast5Years.find(entry => entry.month === month);
  return monthData ? monthData.tmoy : 'N/A';
}

const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();

const roundToOneDecimal = (num) => {
  return isNaN(num) ? 'N/A' : parseFloat(num).toFixed(1);
}

// Fetches data from given endpoint and returns it as JSON
async function fetchData(endpoint) {
    const response = await fetch(endpoint);
    return response.json();
}

// Fetch all city-related data and populate the respective maps
async function fetchCityData() {
  try {
    const [sociologie0, sociologie, emplois, securite, transport2, logement, equipements, tourisme, developpement, emplois_departement, temperatures, communes2, aop] = await Promise.all([
      fetchData('./public/new_data/0_insee_sociologie.json').then(data => data.Data),
      fetchData('./public/new_data/1_insee_sociologie.json').then(data => data.Data),
      fetchData('./public/new_data/2_insee_emplois.json').then(data => data.Data),
      fetchData('./public/new_data/3_insee_securite.json').then(data => data.Data),
      fetchData('./public/new_data/4_insee_transport.json').then(data => data.Data),
      fetchData('./public/new_data/5_insee_logement.json').then(data => data.Data),
      fetchData('./public/new_data/6_insee_equipements.json').then(data => data.Data),
      fetchData('./public/new_data/7_insee_tourisme.json').then(data => data.Data),
      fetchData('./public/new_data/8_insee_developpement.json').then(data => data.Data),
      fetchData('./public/new_data/9_insee_emplois_departement.json').then(data => data.Data),
      fetchData('./public/new_data/temperature-averages-last-5-years.json'),
      fetchData('./public/new_data/communes_departement_region.json'),
      fetchData('./public/new_data/communes-aires-aop.json'),
    ]);

    sociologie0.forEach(entry => {
      const normalizedLabel = normalizeString(entry.Libellé);
    
      const existingData = newDataMap.get(normalizedLabel) || {};
      const newData = {
        population2020: parseInt(entry["Population municipale 2020"], 10),
        annualPopChange2014To2020: parseFloat(entry["Évol. annuelle moy. de la population 2014-2020"])
      };

      newDataMap.set(normalizedLabel, Object.assign(existingData, newData));
    });

    sociologie.forEach(entry => {
      const normalizedLabel = normalizeString(entry.Libellé);
    
      const existingData = newDataMap.get(normalizedLabel) || {};
      const newData = {
        populationDensity2020: parseFloat(entry["Densité de population (historique depuis 1876) 2020"]),
        under15AgePart2020: parseFloat(entry["Part des pers. âgées de - 15 ans 2020"]),
        under25AgePart2020: parseFloat(entry["Part des pers. âgées de - de 25 ans 2020"]),
        between25To64AgePart2020: parseFloat(entry["Part des pers. âgées de 25 à 64 ans 2020"]),
        above65AgePart2020: parseFloat(entry["Part des pers. âgées de 65 ans ou + 2020"]),
        above75AgePart2020: parseFloat(entry["Part des pers. âgées de 75 ans ou + 2020"]),
        above80AgePart2020: parseFloat(entry["Part des pers. âgées de 80 ans ou + 2020"]),
        noOrLowEducationPart2020: parseFloat(entry["Part des non ou peu diplômés dans la pop. non scolarisée de 15 ans ou + 2020"]),
        bepcOrBrevetEducationPart2020: parseFloat(entry["Part des pers., dont le diplôme le plus élevé est le bepc ou le brevet, dans la pop. non scolarisée de 15 ans ou + 2020"]),
        capOrBepEducationPart2020: parseFloat(entry["Part des pers., dont le diplôme le plus élevé est un CAP ou un BEP, dans la pop. non scolarisée de 15 ans ou + 2020"]),
        bacEducationPart2020: parseFloat(entry["Part des pers., dont le diplôme le plus élevé est le bac, dans la pop. non scolarisée de 15 ans ou + 2020"]),
        bacPlus2EducationPart2020: parseFloat(entry["Part des diplômés d'un BAC+2 dans la pop. non scolarisée de 15 ans ou + 2020"]),
        bacPlus3Or4EducationPart2020: parseFloat(entry["Part des diplômés d'un BAC+3  ou BAC+4 dans la pop. non scolarisée de 15 ans ou + 2020"]),
        bacPlus5OrAboveEducationPart2020: parseFloat(entry["Part des diplômés d'un BAC+5 ou plus dans la pop. non scolarisée de 15 ans ou + 2020"])
      };

      newDataMap.set(normalizedLabel, Object.assign(existingData, newData));
    });

    emplois.forEach(entry => {
      const normalizedLabel = normalizeString(entry.Libellé);

      const existingData = newDataMap.get(normalizedLabel) || {};
      const newData = {
        salariedJobsPart2020: parseFloat(entry["Part des emplois sal. dans le nb d’emplois au LT 2020"]),
        nonSalariedJobsPart2020: parseFloat(entry["Part des emplois non sal. dans le nb d’emplois au LT 2020"]),
        farmersPart2020: parseFloat(entry["Part des agriculteurs expl. dans le nb d’emplois au LT 2020"]),
        artisansAndBusinessOwnersPart2020: parseFloat(entry["Part des artisans, commerçants, chefs d’ent. dans le nb d’emplois au LT 2020"]),
        executivesAndHigherIntellectualsPart2020: parseFloat(entry["Part des cadres et prof. intellectuelles sup. dans le nb d’emplois au LT 2020"]),
        intermediateProfessionalsPart2020: parseFloat(entry["Part des prof. intermédiaires dans le nb d’emplois au LT 2020"]),
        laborersPart2020: parseFloat(entry["Part des ouvriers dans le nb d’emplois au LT 2020"]),
        employeesPart2020: parseFloat(entry["Part des employés dans le nb d’emplois au LT 2020"]),
        overallActivityRate2020: parseFloat(entry["Taux d'activité par tranche d'âge 2020\r\r\nEnsemble"])
      };

      newDataMap.set(normalizedLabel, Object.assign(existingData, newData));
    });

    securite.forEach(entry => {
      const normalizedLabel = normalizeString(entry.Libellé);

      const existingData = newDataMap.get(normalizedLabel) || {};
      const newData = {
        voluntaryAssaultRate2022: entry["Coups et blessures volontaires (taux) 2022"] !== "N/A - résultat non disponible" ? parseFloat(entry["Coups et blessures volontaires (taux) 2022"]) : null,
        familyVoluntaryAssaultRate2022: entry["Coups et blessures volontaires dans le cadre familial (taux) 2022"] !== "N/A - résultat non disponible" ? parseFloat(entry["Coups et blessures volontaires dans le cadre familial (taux) 2022"]) : null,
        nonFamilyVoluntaryAssaultRate2022: entry["Coups et blessures volontaires hors cadre familial (taux) 2022"] !== "N/A - résultat non disponible" ? parseFloat(entry["Coups et blessures volontaires hors cadre familial (taux) 2022"]) : null,
        sexualViolenceRate2022: entry["Violences sexuelles (taux) 2022"] !== "N/A - résultat non disponible" ? parseFloat(entry["Violences sexuelles (taux) 2022"]) : null,
        armedRobberyRate2022: parseFloat(entry["Vols violents avec armes (taux) 2022"]),
        unarmedRobberyRate2022: parseFloat(entry["Vols violents sans arme (taux) 2022"]),
        nonViolentTheftRate2022: entry["Vols sans violence contre des personnes (taux) 2022"] !== "N/A - résultat non disponible" ? parseFloat(entry["Vols sans violence contre des personnes (taux) 2022"]) : null,
        burglaryRate2022: entry["Cambriolages de logement (taux) 2022"] !== "N/A - résultat non disponible" ? parseFloat(entry["Cambriolages de logement (taux) 2022"]) : null,
        vehicleTheftRate2022: entry["Vols de véhicules (taux) 2022"] !== "N/A - résultat non disponible" ? parseFloat(entry["Vols de véhicules (taux) 2022"]) : null,
        theftFromVehiclesRate2022: entry["Vols dans les véhicules (taux) 2022"] !== "N/A - résultat non disponible" ? parseFloat(entry["Vols dans les véhicules (taux) 2022"]) : null,
        theftOfVehicleAccessoriesRate2022: parseFloat(entry["Vols d'accessoires sur véhicules (taux) 2022"]),
        vandalismRate2022: entry["Destructions et dégradations volontaires (taux) 2022"] !== "N/A - résultat non disponible" ? parseFloat(entry["Destructions et dégradations volontaires (taux) 2022"]) : null,
        drugUseRate2022: parseFloat(entry["Usage de stupéfiants (taux) 2022"]),
        drugTraffickingRate2022: parseFloat(entry["Trafic de stupéfiants (taux) 2022"])
      };

      newDataMap.set(normalizedLabel, Object.assign(existingData, newData));
    });

    transport2.forEach(entry => {
      const normalizedLabel = normalizeString(entry.Libellé);

      const existingData = newDataMap.get(normalizedLabel) || {};
      const newData = {
        publicTransitUse2020: parseFloat(entry["Part des actifs occupés de 15 ans ou plus  les transports en commun 2020"]),
        bikeUseForWork2020: parseFloat(entry["Part des actifs occ 15 ans ou plus vélo pour travailler 2020"]),
        carUseForWork2020: parseFloat(entry["Part des actifs occ 15 ans ou plus voiture pour travailler 2020"])
      };

      newDataMap.set(normalizedLabel, Object.assign(existingData, newData));
    });

    logement.forEach(entry => {
      const normalizedLabel = normalizeString(entry.Libellé);

      const existingData = newDataMap.get(normalizedLabel) || {};
      const newData = {
        primaryResidenceRate2020: parseFloat(entry["Part des rés. principales dans le total des logements 2020"]),
        secondaryResidenceRate2020: parseFloat(entry["Part des rés. secondaires (y compris les logements occasionnels) dans le total des logements 2020"]),
        vacantHousingRate2020: parseFloat(entry["Part des logements vacants dans le total des logements 2020"]),
        apartmentRate2020: parseFloat(entry["Part des appartements dans le total des logements 2020"]),
        houseRate2020: parseFloat(entry["Part des maisons dans le total des logements 2020"])
      };

      newDataMap.set(normalizedLabel, Object.assign(existingData, newData));
    });

    equipements.forEach(entry => {
      const normalizedLabel = normalizeString(entry.Libellé);

      const existingData = newDataMap.get(normalizedLabel) || {};
      const newData = {
        numKindergarten2021: parseInt(entry["École maternelle (en nombre) 2021"], 10),
        numElementarySchool2021: parseInt(entry["École élémentaire (en nombre) 2021"], 10),
        numMiddleSchool2021: parseInt(entry["Collège (en nombre) 2021"], 10),
        numHighSchool2021: parseInt(entry["Lycée (en nombre) 2021"], 10),
        numEmergencyServices2021: parseInt(entry["Service d'urgences (en nombre) 2021"], 10),
        numGeneralDoctors2021: parseInt(entry["Médecin généraliste (en nombre) 2021"], 10),
        numDentists2021: parseInt(entry["Chirurgien dentiste (en nombre) 2021"], 10),
        numNurses2021: parseInt(entry["Infirmier (en nombre) 2021"], 10),
        numPhysiotherapists2021: parseInt(entry["Masseur kinésithérapeute (en nombre) 2021"], 10),
        numPharmacies2021: parseInt(entry["Pharmacie (en nombre) 2021"], 10),
        numDaycare2021: parseInt(entry["Crèche (en nombre) 2021"], 10)
      };

      newDataMap.set(normalizedLabel, Object.assign(existingData, newData));
    });

    tourisme.forEach(entry => {
      const normalizedLabel = normalizeString(entry.Libellé);

      const existingData = newDataMap.get(normalizedLabel) || {};
      const newData = {
        numHotels2023: parseInt(entry["Nb d'hôtels 2023"], 10),
        numHotelRooms2023: parseInt(entry["Nb de chambres dans les hôtels 2023"], 10),
        numEconomicHotels: parseInt(entry["Non classés ou 1 étoile (économique)"], 10),
        numMidRangeHotels: parseInt(entry["2 ou 3 étoiles (milieu de gamme)"], 10),
        numHighEndHotels: parseInt(entry["4 ou 5 étoiles (haut de gamme)"], 10),
        numCampingSites2023: parseInt(entry["Nb de terrains de camping 2023"], 10)
      };

      newDataMap.set(normalizedLabel, Object.assign(existingData, newData));
    });

    developpement.forEach(entry => {
      const normalizedLabel = normalizeString(entry.Libellé);

      const existingData = newDataMap.get(normalizedLabel) || {};
      const newData = {
        partLogementsSurOccupation2019: parseFloat(entry["Part des logements en situation de sur-occupation 2019"]),
        partPopulationEloigneeEquipementsIntermediaires2021: parseFloat(entry["Part de la population éloignée des équipements intermédiaires, 2021"]),
        partPopulationEloigneeEquipementsProximite2021: parseFloat(entry["Part de la population éloignée des équipements de proximité, 2021"]),
        partPopulationEloigneeEquipementsSuperieurs2021: parseFloat(entry["Part de la population éloignée des équipements supérieurs, 2021"])
      };

      newDataMap.set(normalizedLabel, Object.assign(existingData, newData));
    });

    emplois_departement.forEach(entry => {
      const label = entry["Libellé"];
      const existingData = newDataMap.get(label) || {};
      const newData = {
        averageNetHourlyWage2021: parseFloat(entry["Salaire net horaire moyen 2021"]),
        averageAnnualUnemploymentRate2022: parseFloat(entry["Taux de chômage annuel moyen 2022"]),
        averageNetHourlyWage18To252021: parseFloat(entry["Salaire net hor. moy. des 18 à 25 ans 2021"]),
        averageNetHourlyWage26To502021: parseFloat(entry["Salaire net hor. moy. des 26 à 50 ans 2021"]),
        averageNetHourlyWage51OrMore2021: parseFloat(entry["Salaire net hor. moy. des 51 ans ou + 2021"]),
        averageNetHourlyWageWomen2021: parseFloat(entry["Salaire net hor. moy. des femmes 2021"]),
        averageNetHourlyWageMen2021: parseFloat(entry["Salaire net hor. moy. des hommes 2021"]),
        averageNetHourlyWageExecutives2021: parseFloat(entry["Salaire net hor. moy. des cadres, prof. intellectuelles sup. et chefs d'entreprises salariés 2021"]),
        averageNetHourlyWageEmployees2021: parseFloat(entry["Salaire net hor. moy. des employés 2021"]),
        averageNetHourlyWageIntermediateJobs2021: parseFloat(entry["Salaire net hor. moy. des prof. intermédiaires 2021"]),
        averageNetHourlyWageWorkers2021: parseFloat(entry["Salaire net hor. moy. des ouvriers 2021"])
      };

      newDataMap.set(label, Object.assign(existingData, newData));
    });

    temperatures.forEach(entry => {
      const { departement, month, tmoy, tmin, tmax } = entry;
    
      if (!temperaturesMap.has(departement)) {
        temperaturesMap.set(departement, new Map());
      }
    
      const monthData = {
        averageTemperature: roundToOneDecimal(tmoy),
        averageTemperatureMin: roundToOneDecimal(tmin),
        averageTemperatureMax: roundToOneDecimal(tmax)
      };
    
      temperaturesMap.get(departement).set(month, monthData);
    });
    

    communes2.forEach(entry => {
      const normalizedCommuneName = normalizeString(entry.libelle_acheminement);

        communesMap.set(normalizedCommuneName, {
        code_postal: entry.code_postal,
        latitude: entry.latitude,
        longitude: entry.longitude,
        code_departement: entry.code_departement,
        nom_departement: entry.nom_departement,
        code_region: entry.code_region,
        nom_region: entry.nom_region,
      });
    });

    aop.forEach(entry => {
      const normalizedCommuneName = normalizeString(entry.Commune);
      const communeData = communesMap.get(normalizedCommuneName);
      
      if (communeData) {
        if (!communeData.aop) {
          communeData.aop = [];
        }
    
        communeData.aop.push({
          aop: entry["Aire géographique"],
          ida: entry.IDA
        });
      }
    });

    // console.log("communesMap", communesMap);
    // console.log("newDataMap", newDataMap);
    // console.log("temperaturesMap", temperaturesMap);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function capitalizeFirstLetterOfEachWord(str) {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

let currentFilter = '';
let start = 0;
const count = 30;

// Function to display the top 10 cities with population and postal code
function displayCities(start = 0, count = 30, cityLabels = []) {

  cityLabels = cityLabels.length ? cityLabels : sortCities(Array.from(newDataMap.keys()), 'populationDesc');

  const container = document.getElementById('cityList');
  const toDisplay = cityLabels.slice(start, start + count);

  // Initialize table and header only if it's the first batch
  if (start === 0) {
    container.innerHTML = `
      <table id="cityTable">
        <thead>
          <tr>
            <th>Nom de la ville</th>
            <th>Code postal</th>
            <th>Population</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody id="cityTableBody">
        </tbody>
      </table>
    `;
  }

  const tableBody = document.getElementById('cityTableBody');

  toDisplay.forEach(cityLabel => {
    const cityData = newDataMap.get(cityLabel);
    const communeData = communesMap.get(cityLabel);
    const capitalizedCityLabel = capitalizeFirstLetterOfEachWord(cityLabel);

    if (cityData && communeData) {
      const departmentName = communeData?.nom_departement;
      const departmentData = newDataMap.get(departmentName);

      // Calculate the score if it doesn't exist
      let score = cityData?.score;

      // give a number of stars out of 5 based on the score
      // let stars = '';
      // if (score >= 9) {
      //   stars = '⭐⭐⭐⭐⭐';
      // } else if (score >= 8) {
      //   stars = '⭐⭐⭐⭐';
      // } else if (score >= 7) {
      //   stars = '⭐⭐⭐';
      // } else if (score >= 6) {
      //   stars = '⭐⭐';
      // } else if (score >= 5) {
      //   stars = '⭐';
      // }

      const cityRow = document.createElement('tr');
      cityRow.className = 'city-row';

      cityRow.innerHTML = `
        <td>${capitalizedCityLabel}</td>
        <td>${communeData.code_postal.toLocaleString('fr-FR')}</td>
        <td>${cityData.population2020.toLocaleString('fr-FR')}</td>
        <td>${score}</td>
      `;

      cityRow.addEventListener('click', () => navigateToCity(cityLabel));

      // Append the new cityRow to the table body
      tableBody.appendChild(cityRow);
    }
  });
}



// ------------------------------ Display city info ------------------------------ //

// Function to display the info for a single city
function displaySingleCity(cityLabel) {
  const cityData = newDataMap.get(cityLabel);
  const communeData = communesMap.get(cityLabel);

  if (cityData && communeData) {
    const container = document.getElementById('cityList');
    container.innerHTML = displayCityInfo(cityLabel, cityData, communeData);
  }

  generateMap({
    label: cityLabel,
    latitude: communeData.latitude,
    longitude: communeData.longitude
  });
}

// Function to display info in city page
function displayCityInfo(cityLabel, cityData, communeData) {

  const capitalizedCityLabel = capitalizeFirstLetterOfEachWord(cityLabel);

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

  return `
  <div class="city-info">
  
    <div class="city-info-header">
      <h2>${capitalizedCityLabel}</h2>
      <p>${score}/10</p>
    </div>

    ${createInfoCard('📬', 'Code Postal', communeData?.code_postal ?? 'N/A', '')}
    ${createInfoCard('📍', 'Code département', communeData?.code_departement ?? 'N/A', '')}
    ${createInfoCard('🏞️', 'Département', communeData?.nom_departement ?? 'N/A', '')}
    ${createInfoCard('🗺️', 'Code Région', communeData?.code_region ?? 'N/A', '')}
    ${createInfoCard('🌍', 'Région', communeData?.nom_region ?? 'N/A', '')}

    <h3>🏛️ Données générales</h3>
    ${createInfoCard('👥', 'Population', (cityData?.population2020 ?? 'N/A'), '', medianValues.MedianPopulation)}
    ${createInfoCard(emoji, 'Évolution de la population', annualPopChange, '%', medianValues.MedianPopulationEvolution)}
    ${createInfoCard('🏙️', 'Densité de population', (cityData?.populationDensity2020 !== undefined ? Math.round(cityData?.populationDensity2020) : 'N/A'), 'hab/km²', Math.round(medianValues.MedianDensity))}
    
    <h3>💰 Salaire</h3>
    ${createInfoCard('💶', 'Salaire net horaire moyen', (departmentData?.averageNetHourlyWage2021 ?? 'N/A'), '€', medianValues.MedianHourlyNetSalary2021)}
    ${createInfoCard('👩‍💼', 'Salaire net horaire moyen des femmes', (departmentData?.averageNetHourlyWageWomen2021 ?? 'N/A'), '€', medianValues.MedianHourlyNetSalaryWomen_2021)}
    ${createInfoCard('👨‍💼', 'Salaire net horaire moyen des hommes', (departmentData?.averageNetHourlyWageMen2021 ?? 'N/A'), '€', medianValues.MedianHourlyNetSalaryMen_2021)}
    
    <h3>👨‍⚕️ Emploi </h3>
    ${createInfoCard('📊', 'Taux d\'activité', (cityData?.overallActivityRate2020 ?? 'N/A'), '%', medianValues.MedianActivityRate)}
    ${createInfoCard('📉', 'Taux de chômage', (departmentData?.averageAnnualUnemploymentRate2022 ?? 'N/A'), '%', medianValues.MedianUnemploymentRate2022)}

    <h3>👨‍👩‍👧‍👦 Répartition des âge</h3>
    ${createInfoCard('👶', 'Moins de 15 ans', (cityData?.under15AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeUnder15)}
    ${createInfoCard('👦', 'Moins de 25 ans', (cityData?.under25AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeUnder25)}
    ${createInfoCard('👨', '25 - 64 ans', (cityData?.between25To64AgePart2020 ?? 'N/A'), '%', medianValues.MedianAge25to64)}
    <div class="break"></div>
    ${createInfoCard('🧓', 'Plus de 65 ans', (cityData?.above65AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeOver65)}
    ${createInfoCard('👵', 'Plus de 75 ans', (cityData?.above75AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeOver75)}
    ${createInfoCard('👴', 'Plus de 80 ans', (cityData?.above80AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeOver80)}

    <h3>🚗 Transports</h3>
    ${createInfoCard('🚲', 'Part des actifs occupés de 15 ans ou plus utilisant le vélo pour aller travailler', (cityData?.bikeUseForWork2020 ?? 'N/A'), '%', medianValues.MedianBicycleUsageRate2020)}
    ${createInfoCard('🚆', 'Part des actifs occupés de 15 ans ou plus utilisant les transports en commun pour aller travailler', (cityData?.publicTransitUse2020 ?? 'N/A'), '%', medianValues.MedianPublicTransportUsageRate2020)}
    ${createInfoCard('🚗', 'Part des actifs occupés de 15 ans ou plus utilisant la voiture pour aller travailler', (cityData?.carUseForWork2020 ?? 'N/A'), '%', medianValues.MedianCarUsageRate2020)}

    <h3>🔫 Criminalité</h3>
    <div class="chart-container">
      <canvas id="criminality"></canvas>
    </div>

    <div class="break"></div>

    <h3>🌡️ Températures annuelles</h3>
    <div class="chart-container">
      <canvas id="temperatures"></canvas>
    </div>
    
    <h3>🧀 Produits AOP</h3>
    ${createInfoCard('🧀🍷', 'Produits AOP', aopList, '')}

    <h3>🏨 Tourisme</h3>
    ${createInfoCard('🏨', 'Nombre d\'hôtels', (cityData?.numHotels2023 ?? 'N/A'), '', '')}
    ${createInfoCard('🏨', 'Nombre de chambres d\'hôtel', (cityData?.numHotelRooms2023 ?? 'N/A'), '', '')}
    ${createInfoCard('🏨', 'Nombre d\'hôtels économiques', (cityData?.numEconomicHotels ?? 'N/A'), '', '')}
    ${createInfoCard('🏨', 'Nombre d\'hôtels milieu de gamme', (cityData?.numMidRangeHotels ?? 'N/A'), '', '')}
    ${createInfoCard('🏨', 'Nombre d\'hôtels haut de gamme', (cityData?.numHighEndHotels ?? 'N/A'), '', '')}
    ${createInfoCard('🏨', 'Nombre de terrains de camping', (cityData?.numCampingSites2023 ?? 'N/A'), '', '')}

    <h3>🏥 Santé</h3>
    ${createInfoCard('🏥', 'Nombre de services d\'urgence', (cityData?.numEmergencyServices2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre de pharmacies', (cityData?.numPharmacies2021 ?? 'N/A'), '', '')}
    <div class="break"></div>
    ${createInfoCard('👩‍⚕️', 'Nombre de médecins généralistes', (cityData?.numGeneralDoctors2021 ?? 'N/A'), '', '')}
    ${createInfoCard('👨‍⚕️', 'Nombre de chirurgiens dentistes', (cityData?.numDentists2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🧑‍⚕️', 'Nombre d\'infirmiers', (cityData?.numNurses2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🧑‍⚕️', 'Nombre de masseurs kinésithérapeutes', (cityData?.numPhysiotherapists2021 ?? 'N/A'), '', '')}

    <h3>🏫 Éducation</h3>
    ${createInfoCard('🏫', 'Nombre de crèches', (cityData?.numDaycare2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre d\'écoles maternelles', (cityData?.numKindergarten2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre d\'écoles élémentaires', (cityData?.numElementarySchool2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre de collèges', (cityData?.numMiddleSchool2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre de lycées', (cityData?.numHighSchool2021 ?? 'N/A'), '', '')}

    <h3>🏘️ Logement</h3>
    ${createInfoCard('🏠', 'Part des résidences principales', (cityData?.primaryResidenceRate2020 ?? 'N/A'), '%', medianValues.partResidencesPrincipales)}
    ${createInfoCard('🏠', 'Part des résidences secondaires', (cityData?.secondaryResidenceRate2020 ?? 'N/A'), '%', medianValues.partResidencesSecondaires)}
    ${createInfoCard('🏠', 'Part des logements vacants', (cityData?.vacantHousingRate2020 ?? 'N/A'), '%', medianValues.partLogementsVacants)}

    <h3>🏠 Type de logement</h3>
    ${createInfoCard('🏠', 'Part des appartements', (cityData?.apartmentRate2020 ?? 'N/A'), '%', medianValues.MedianApartmentRate2020)}
    ${createInfoCard('🏡', 'Part des maisons', (cityData?.houseRate2020 ?? 'N/A'), '%', medianValues.MedianHouseRate2020)}

    <h3>👩‍🎓 Éducation</h3>
    ${createInfoCard('👨‍💼', 'Part sans diplôme', (cityData?.noOrLowEducationPart2020 ?? 'N/A'), '%', medianValues.MedianNoOrLowEducation)}
    ${createInfoCard('👨‍💼', 'Part des diplômés d\'un Brevet des collèges', (cityData?.capOrBepEducationPart2020 ?? 'N/A'), '%', medianValues.MedianBEPCOrBrevet)}
    ${createInfoCard('👨‍💼', 'Part des diplômés d\'un CAP, BEP ou équivalent', (cityData?.bepcOrBrevetEducationPart2020 ?? 'N/A'), '%', medianValues.MedianCAPorBEP)}
    <div class="break"></div>
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC', (cityData?.bacEducationPart2020 ?? 'N/A'), '%', medianValues.MedianBac)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+2', (cityData?.bacPlus2EducationPart2020 ?? 'N/A'), '%', medianValues.MedianBacPlus2)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+3 ou BAC+4', (cityData?.bacPlus3Or4EducationPart2020 ?? 'N/A'), '%', medianValues.MedianBacPlus3or4)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+5 ou plus', (cityData?.bacPlus5OrAboveEducationPart2020 ?? 'N/A'), '%', medianValues.MedianBacPlus5OrMore)}

    <h3>🗺️ Localisation</h3>
    <div id="map"></div>
  </div>
  `;
}

// function temperatureEmoji(temperature) {
//   if (temperature === 'N/A') return '❓';
//   if (temperature < 0) return '❄️';
//   if (temperature >= 0 && temperature < 10) return '🥶'; // Cold
//   if (temperature >= 10 && temperature < 15) return '😰'; // Cold
//   if (temperature >= 15 && temperature < 20) return '😊'; // Warm
//   if (temperature >= 20 && temperature < 25) return '🥵'; // Hot
//   if (temperature >= 25) return '🔥'; // Hot
// }

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
  console.log('cityLabel', cityLabel)
  if (cityLabel) {
    displaySingleCity(cityLabel);
  } else {
    // Logic to go back to main page
    displayCities();
  }
});

// Add a click event listener to the element with id 'returnButton'
document.getElementById('returnButton').addEventListener('click', returnToInitialView);


// ------------------------------ Filter cities ------------------------------ //

function filterCities(searchTerm = '') {
  // Convert the searchTerm to lowercase for case-insensitive search
  const normalizedSearchTerm = searchTerm.toLowerCase();
  
  // Filter city names
  const filteredCityLabels = Array.from(newDataMap.keys()).filter(cityLabel =>
    cityLabel.toLowerCase().includes(normalizedSearchTerm)
  );

  start = 0;
  // Generate a new list based on the filtered cities
  displayCities(start, count, filteredCityLabels);
}

document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('searchBar');
  const sortingSelect = document.getElementById('sortingSelect');
  const cityList = document.getElementById('container');

  searchBar.addEventListener('input', (event) => {
    filterCities(event.target.value);
  });

  sortingSelect.addEventListener('change', (event) => {
    const sortingOption = event.target.value;
  
    let cityLabels = currentFilter
      ? Array.from(newDataMap.keys()).filter(cityLabel => cityLabel.toLowerCase().includes(currentFilter.toLowerCase()))
      : Array.from(newDataMap.keys());
  
    cityLabels = sortCities(cityLabels, sortingOption);
    start = 0;
    displayCities(start, count, cityLabels);
  });

  // Initial load
  const defaultSortingOption = 'populationDesc';
  const sortedInitialCityLabels = sortCities(Array.from(newDataMap.keys()), defaultSortingOption);
  displayCities(start, count, sortedInitialCityLabels);

  cityList.addEventListener('scroll', () => {
    if (cityList.scrollTop + cityList.clientHeight >= cityList.scrollHeight) {
      start += count;

      const cityLabels = currentFilter
        ? Array.from(newDataMap.keys()).filter(cityLabel => cityLabel.toLowerCase().includes(currentFilter.toLowerCase()))
        : Array.from(newDataMap.keys());

      displayCities(start, count, cityLabels);
    }
  });

});

// ------------------------------ Sorting cities ------------------------------ //

function sortCities(cityLabels, sortingOption) {
  return cityLabels.sort((a, b) => {
    const cityDataA = newDataMap.get(a);
    const cityDataB = newDataMap.get(b);
    let scoreA = cityDataA ? parseFloat(cityDataA.score ?? 0) : 0;
    let scoreB = cityDataB ? parseFloat(cityDataB.score ?? 0) : 0;

    switch (sortingOption) {
      case 'populationDesc':
        return (cityDataB.population2020 ?? 0) - (cityDataA.population2020 ?? 0);
      case 'populationAsc':
        return (cityDataA.population2020 ?? 0) - (cityDataB.population2020 ?? 0);
      case 'scoreDesc':
        if (scoreB === scoreA) {
          return 0;  // Handle tie-breaking scenarios here if needed
        }
        return scoreB - scoreA;
      case 'scoreAsc':
        if (scoreA === scoreB) {
          return 0;  // Handle tie-breaking scenarios here if needed
        }
        return scoreA - scoreB;
      default:
        return 0;
    }
  });
}



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
    const communeData = communesMap.get(cityLabel);
    const departmentName = communeData?.nom_departement;
    const departmentData = newDataMap.get(departmentName);
    
    let score = cityData?.score;
    if (typeof score === 'undefined' || score === null) {
      score = calculateCityScore(medianValues, cityData, departmentData);
      cityData.score = score; // Store the score back into cityData
    }
  }

  // Check the current URL pathname, return to city on reload
  // const path = window.location.pathname;
  // const cityLabel = path.split('/city/')[1];

  // if (cityLabel) {
  //   displaySingleCity(cityLabel);
  // } else {
  //   displayCities();
  // }
  
  displayCities();


  // Hide the loader and show main content
  loader.style.display = 'none';
  mainContent.style.display = 'block';
}

init();


// ------------------------------ START Utils ------------------------------ //

function createInfoCard(emoji, text, value, type, medianValue) {
  let formattedValue;

  // Check if the value is "population" and format accordingly
  if (text === 'Population') {
    formattedValue = value.toLocaleString('fr-FR');
  } else {
    formattedValue = value.toLocaleString('fr-FR'); 
  }

  const percentage = (medianValue !== 0) ? ((value / medianValue) * 100).toFixed(2) : 0;

  let populationPercentage, medianPercentage, comparisonDiv;

  if (percentage <= 100) {
    populationPercentage = 100;
    medianPercentage = percentage;
  } else {
    populationPercentage = 100 / (percentage / 100);
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

    if (text === 'Taux de chômage' || text === 'Taux de pauvreté' || text === 'Part des actifs de 15 ans ou plus utilisant la voiture pour aller travailler') {
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


// ---------------------------------------- Start Map ---------------------------------------- //

const generateMap = (city) => {
  const normalizedCityLabel = normalizeString(city.label);
  const communeData = communesMap.get(normalizedCityLabel);

  const map = L.map('map', {
    zoomControl: false,
  }).setView([communeData.latitude, communeData.longitude], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([communeData.latitude, communeData.longitude]).addTo(map);
};

// ---------------------------------------- END Map ---------------------------------------- //


// Function to calculate the "City Score"
function calculateCityScore(medianValues, cityData, departmentData) {
  let score = 0;

  const weights = {
    unemployment: 0.1,
    salary: 0.15,
    activityRate: 0.15,
    transport: 0.2,
  };

  // Unemployment: Lower is better
  const unemploymentScore = Math.min(2, 10 * (1 - (departmentData?.averageAnnualUnemploymentRate2022 / medianValues.MedianUnemploymentRate2022)) * weights.unemployment);

  // Salary: Higher is better
  const salaryScore = Math.min(2, 10 * (departmentData?.averageNetHourlyWage2021 / medianValues.MedianHourlyNetSalary2021) * weights.salary);

  // Activity rate: Higher is better
  const activityRateScore = Math.min(2, 10 * (cityData?.overallActivityRate2020 / medianValues.MedianActivityRate) * weights.activityRate);

  // Transport: Public transport and bike usage are better than car usage
  const transportScore = Math.min(2, 10 * (parseFloat(cityData?.bikeUseForWork2020 + cityData?.publicTransitUse2020) / (medianValues.MedianPublicTransportUsageRate2020 + medianValues.MedianBicycleUsageRate2020)) * weights.transport);

  // Sum them up
  score += unemploymentScore;
  // console.log('unemploymentScore', unemploymentScore)
  score += salaryScore;
  // console.log('salaryScore', salaryScore)
  score += activityRateScore;
  // console.log('activityRateScore', activityRateScore)
  score += transportScore;
  // console.log('transportScore', transportScore)

  const finalScore = parseFloat(score.toFixed(1));
  return Math.min(Math.max(finalScore, 1), 10);
}



// ---------------------------------------- Temperature Chart ---------------------------------------- //

function initializeTemperatureChart(departmentName) {

  const ctx = document.getElementById('temperatures').getContext('2d');

  const departmentData = Array.from(temperaturesMap.get(departmentName).values());
  const frenchMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const months = departmentData.map((_, index) => frenchMonths[index]);

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Temperature moyenne',
          data: departmentData.map(d => d.averageTemperature),
          borderColor: 'brown',
          fill: false,
          cubicInterpolationMode: 'monotone',
        },
        {
          label: 'Temperature maximale',
          data: departmentData.map(d => d.averageTemperatureMax),
          borderColor: 'orange',
          cubicInterpolationMode: 'monotone',
        },
        {
          label: 'Temperature minimale',
          data: departmentData.map(d => d.averageTemperatureMin),
          borderColor: 'blue',
          fill: '-1', // Fill from this line to the line above it in the dataset array
          cubicInterpolationMode: 'monotone',
        },
        {
          label: 'Temperature moyenne nationale',
          data: temperatureMediansNationalLast5Years.map(d => d.tmoy),
          borderColor: 'red',
          borderDash: [5, 5],
          fill: false,
          cubicInterpolationMode: 'monotone',
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: 'black'
          }
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'black'
          },
          title: {
            color: 'black'
          }
        },
        y: {
          ticks: {
            color: 'black'
          },
          title: {
            color: 'black'
          }
        }
      }
    }
  });  
}

// ---------------------------------------- Criminality Chart ---------------------------------------- //

function initializeCriminalityChart(cityData, medianValues) {
  const ctx = document.getElementById('criminality').getContext('2d');

  // Grouping criminal activities
  const labels = [
    'Coups et blessures',
    'Violences sexuelles',
    'Vols',
    'Cambriolages',
    'Destructions et dégradations volontaires',
    'Usage et trafic de stupéfiants'
  ];

  const data = [
    cityData?.voluntaryAssaultRate2022 + cityData?.familyVoluntaryAssaultRate2022 + cityData?.nonFamilyVoluntaryAssaultRate2022 ?? 0,
    cityData?.sexualViolenceRate2022 ?? 0,
    cityData?.armedRobberyRate2022 + cityData?.unarmedRobberyRate2022 + cityData?.nonViolentTheftRate2022 ?? 0,
    cityData?.burglaryRate2022 ?? 0,
    cityData?.vandalismRate2022 ?? 0,
    cityData?.drugUseRate2022 + cityData?.drugTraffickingRate2022 ?? 0
  ];

  const medianData = [
    medianValues.AverageIntentionalInjuriesRate,
    medianValues.AverageSexualViolenceRate,
    medianValues.AverageArmedRobberyRate + medianValues.AverageUnarmedRobberyRate + medianValues.AverageNonViolentTheftRate,
    medianValues.AverageHomeBurglaryRate,
    medianValues.AverageDestructionAndVandalismRate,
    medianValues.AverageDrugUseRate + medianValues.AverageDrugTraffickingRate
  ];

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Taux de criminalité (%)',
          data: data,
          backgroundColor: 'rgb(255, 165, 0, 0.5)',
          borderColor: 'rgb(255, 165, 0, 1)',
          borderWidth: 1,
        },
        {
          label: 'Taux de criminalité moyen (%)',
          data: medianData,
          backgroundColor: 'rgb(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: 'black'
          }
        }
      },
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: 'black'
          },
          title: {
            color: 'black'
          }
        },
        y: {
          ticks: {
            color: 'black'
          },
          title: {
            color: 'black'
          }
        }
      }
    }
  });
}



