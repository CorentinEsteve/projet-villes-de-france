// import { fetchData } from './js/data/fetchData.js';
// import { normalizeString } from './js/utils/normalizeString.js';
// import { calculateCityScore } from './models/calculateCityScore.js';
// import { displayCities, displaySingleCity } from './display/displayCities.js';

// Maps to hold data
const newDataMap = new Map();
const temperaturesMap = new Map();
const communesMap = new Map();
let allCityData2 = [];

const medianValues = {
  population: 125620,
  evolutionPopulation: 0.13,
  tauxDePauvrete: 13.5,
  tauxDeChomage: 6.7,
  salaire: 14.13,
  salaireFemme: 12.81,
  salaireHomme: 15,
  tauxDActiviteEnsemble: 74.8,
  tauxDActivite15A24ans: 45.1,
  tauxDActivite25A54ans: 91.2,
  tauxDActivite55A64ans: 54.9,
  partMoins15ans: 15.5,
  partMoins24ans: 25.5,
  part25A64ans: 49.4,
  partPlus65ans: 19.6,
  partPlus75ans: 7.8,
  partVelo: 0.4, //Average value for Indic1: 0.8159597926630215
  partTransportEnCommun: 1.6, //Average value for Indic2: 2.9896131046135306
  partVoiture: 87, //Average value for Indic3: 84.87527420601924
};

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
    const [sociologie0, sociologie, emplois, securite, transport2, logement, equipements, tourisme, developpement, temperatures, communes2] = await Promise.all([
      fetchData('/new_data/0_insee_sociologie.json').then(data => data.Data),
      fetchData('/new_data/1_insee_sociologie.json').then(data => data.Data),
      fetchData('/new_data/2_insee_emplois.json').then(data => data.Data),
      fetchData('/new_data/3_insee_securite.json').then(data => data.Data),
      fetchData('/new_data/4_insee_transport.json').then(data => data.Data),
      fetchData('/new_data/5_insee_logement.json').then(data => data.Data),
      fetchData('/new_data/6_insee_equipements.json').then(data => data.Data),
      fetchData('/new_data/7_insee_tourisme.json').then(data => data.Data),
      fetchData('/new_data/8_insee_developpement.json').then(data => data.Data),
      fetchData('/new_data/temperature-averages-last-5-years.json'),
      fetchData('/new_data/communes_departement_region.json'),
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
const count = 40;

// Function to display the top 10 cities with population and postal code
function displayCities(start = 0, count = 30, cityLabels = Array.from(newDataMap.keys())) {
  const container = document.getElementById('cityList');
  const toDisplay = cityLabels.slice(start, start + count);

  // Initialize table and header only if it's the first batch
  if (start === 0) {
    container.innerHTML = `
      <table id="cityTable">
        <thead>
          <tr>
            <th>Code postal</th>
            <th>Nom de la ville</th>
            <th>Population</th>
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
      const cityRow = document.createElement('tr');
      cityRow.className = 'city-row';

      cityRow.innerHTML = `
        <td>${communeData.code_postal}</td>
        <td>${capitalizedCityLabel}</td>
        <td>${cityData.population2020}</td>
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
  const score = cityData?.score ?? 'N/A';

  const departmentCode = communeData?.nom_departement; // get department code
  const month = 1; // for January
  const temperatureData = temperaturesMap.get(departmentCode)?.get(month); // get temperature data for that department and month
  const averageTemperature = temperatureData?.averageTemperature ?? 'N/A'; // extract average temperature or use 'N/A' if not available

  const departmentName = communeData?.nom_departement; // Assuming 'communeData' is available at this point
  if (departmentName) {
    setTimeout(() => initializeTemperatureChart(departmentName), 100);
  }

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
    ${createInfoCard('👥', 'Population', (cityData?.population2020 ?? 'N/A'), '', medianValues.population)}
    ${createInfoCard('📉', 'Taux de chômage', (cityData?.unemploymentRate2022 ?? 'N/A'), '%', medianValues.tauxDeChomage)}
    ${createInfoCard(emoji, 'Évolution de la population', annualPopChange, '%', medianValues.evolutionPopulation)}
    
    <h3>💰 Salaire</h3>
    ${createInfoCard('💶', 'Salaire net horaire moyen', (cityData?.averageNetSalary2021 ?? 'N/A'), '€', medianValues.salaire)}
    ${createInfoCard('👩‍💼', 'Salaire net horaire moyen des femmes', (cityData?.womenNetSalary2021 ?? 'N/A'), '€', medianValues.salaireFemme)}
    ${createInfoCard('👨‍💼', 'Salaire net horaire moyen des hommes', (cityData?.menNetSalary2021 ?? 'N/A'), '€', medianValues.salaireHomme)}
    ${createInfoCard('📉', 'Taux de pauvreté', (cityData?.povertyRate ?? 'N/A'), '%', medianValues.tauxDePauvrete)}

    <h3>👨‍⚕️👷‍♀️ Taux d'activité</h3>
    ${createInfoCard('📊', 'Taux d\'activité', (cityData?.overallActivityRate2020 ?? 'N/A'), '%', medianValues.tauxDActiviteEnsemble)}

    <h3>👨‍👩‍👧‍👦 Répartition par âge</h3>
    ${createInfoCard('👶', 'Moins de 15 ans', (cityData?.under15AgePart2020 ?? 'N/A'), '%', medianValues.partMoins15ans)}
    ${createInfoCard('👦', 'Moins de 25 ans', (cityData?.under25AgePart2020 ?? 'N/A'), '%', medianValues.partMoins24ans)}
    ${createInfoCard('👨', '25 - 64 ans', (cityData?.between25To64AgePart2020 ?? 'N/A'), '%', medianValues.part25A64ans)}
    ${createInfoCard('👵', 'Plus de 65 ans', (cityData?.above65AgePart2020 ?? 'N/A'), '%', medianValues.partPlus65ans)}
    ${createInfoCard('👵', 'Plus de 75 ans', (cityData?.above75AgePart2020 ?? 'N/A'), '%', medianValues.partPlus75ans)}
    ${createInfoCard('👵', 'Plus de 80 ans', (cityData?.above80AgePart2020 ?? 'N/A'), '%', '')}

    <h3>🚗 Transports</h3>
    ${createInfoCard('🚲', 'Part des actifs occupés de 15 ans ou plus utilisant le vélo pour aller travailler', (cityData?.bikeUseForWork2020 ?? 'N/A'), '%', medianValues.partVelo)}
    ${createInfoCard('🚆', 'Part des actifs occupés de 15 ans ou plus utilisant les transports en commun pour aller travailler', (cityData?.publicTransitUse2020 ?? 'N/A'), '%', medianValues.partTransportEnCommun)}
    ${createInfoCard('🚗', 'Part des actifs occupés de 15 ans ou plus utilisant la voiture pour aller travailler', (cityData?.carUseForWork2020 ?? 'N/A'), '%', medianValues.partVoiture)}

    <div class="break"></div>

    <h4> 🌡️ Graphique de temperature </h4>
    <div class="chart-container">
      <canvas id="temperatures"></canvas>
    </div>

    <h3>🏨🏥🏫 Équipements</h3>
    ${createInfoCard('🏨', 'Nombre d\'hôtels', (cityData?.numHotels2023 ?? 'N/A'), '', '')}
    ${createInfoCard('🏨', 'Nombre de chambres d\'hôtel', (cityData?.numHotelRooms2023 ?? 'N/A'), '', '')}
    ${createInfoCard('🏨', 'Nombre d\'hôtels économiques', (cityData?.numEconomicHotels ?? 'N/A'), '', '')}
    ${createInfoCard('🏨', 'Nombre d\'hôtels milieu de gamme', (cityData?.numMidRangeHotels ?? 'N/A'), '', '')}
    ${createInfoCard('🏨', 'Nombre d\'hôtels haut de gamme', (cityData?.numHighEndHotels ?? 'N/A'), '', '')}
    ${createInfoCard('🏨', 'Nombre de terrains de camping', (cityData?.numCampingSites2023 ?? 'N/A'), '', '')}
    ${createInfoCard('🏥', 'Nombre de services d\'urgences', (cityData?.numEmergencyServices2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre d\'écoles maternelles', (cityData?.numKindergarten2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre d\'écoles élémentaires', (cityData?.numElementarySchool2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre de collèges', (cityData?.numMiddleSchool2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre de lycées', (cityData?.numHighSchool2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre de crèches', (cityData?.numDaycare2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre de médecins généralistes', (cityData?.numGeneralDoctors2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre de chirurgiens dentistes', (cityData?.numDentists2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre d\'infirmiers', (cityData?.numNurses2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre de masseurs kinésithérapeutes', (cityData?.numPhysiotherapists2021 ?? 'N/A'), '', '')}
    ${createInfoCard('🏫', 'Nombre de pharmacies', (cityData?.numPharmacies2021 ?? 'N/A'), '', '')}

    <h3>🏘️ Logement</h3>
    ${createInfoCard('🏠', 'Part des résidences principales', (cityData?.primaryResidenceRate2020 ?? 'N/A'), '%', medianValues.partResidencesPrincipales)}
    ${createInfoCard('🏠', 'Part des résidences secondaires', (cityData?.secondaryResidenceRate2020 ?? 'N/A'), '%', medianValues.partResidencesSecondaires)}
    ${createInfoCard('🏠', 'Part des logements vacants', (cityData?.vacantHousingRate2020 ?? 'N/A'), '%', medianValues.partLogementsVacants)}
    ${createInfoCard('🏠', 'Part des appartements', (cityData?.apartmentRate2020 ?? 'N/A'), '%', medianValues.partAppartements)}
    ${createInfoCard('🏠', 'Part des maisons', (cityData?.houseRate2020 ?? 'N/A'), '%', medianValues.partMaisons)}

    <h3>👩‍🎓👨‍🎓 Éducation</h3>
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+5 ou plus', (cityData?.bacPlus5OrAboveEducationPart2020 ?? 'N/A'), '%', medianValues.partBacPlus5)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+3 ou BAC+4', (cityData?.bacPlus3Or4EducationPart2020 ?? 'N/A'), '%', medianValues.partBacPlus3ou4)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+2', (cityData?.bacPlus2EducationPart2020 ?? 'N/A'), '%', medianValues.partBacPlus2)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+1', (cityData?.bacPlus1EducationPart2020 ?? 'N/A'), '%', medianValues.partBacPlus1)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC', (cityData?.bacEducationPart2020 ?? 'N/A'), '%', medianValues.partBac)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un CAP, BEP ou équivalent', (cityData?.capOrBepEducationPart2020 ?? 'N/A'), '%', medianValues.partCapOuBep)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un Brevet des collèges', (cityData?.brevetDesCollegesEducationPart2020 ?? 'N/A'), '%', medianValues.partBrevetDesColleges)}
    ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un Brevet des collèges', (cityData?.noDiplomaEducationPart2020 ?? 'N/A'), '%', medianValues.partSansDiplome)}

    <h3>🗺️ Localisation</h3>
    <div id="map"></div>
  </div>
  `;
}

function temperatureEmoji(temperature) {
  if (temperature === 'N/A') return '❓';
  if (temperature < 0) return '❄️';
  if (temperature >= 0 && temperature < 10) return '🥶'; // Cold
  if (temperature >= 10 && temperature < 15) return '😰'; // Cold
  if (temperature >= 15 && temperature < 20) return '😊'; // Warm
  if (temperature >= 20 && temperature < 25) return '🥵'; // Hot
  if (temperature >= 25) return '🔥'; // Hot
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

// Add a click event listener to the element with id 'returnButton'
document.getElementById('returnButton').addEventListener('click', returnToInitialView);

// Return to initial view when back button is clicked
// window.addEventListener('popstate', () => {
//   const path = window.location.pathname;
//   const cityLabel = path.split('/city/')[1];
  
//   if (cityLabel) {
//     displaySingleCity(cityLabel);
//   } else {
//     // Logic to go back to main page
//     displayCities();
//   }
// });

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
  displayCities(start, count);

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

    switch (sortingOption) {
      case 'populationDesc':
        return cityDataB.population2020 - cityDataA.population2020;
      case 'populationAsc':
        return cityDataA.population2020 - cityDataB.population2020;
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
  loader.style.display = 'flex';  // Assuming you're using 'flex' to center the loader
  mainContent.style.display = 'none';

  await fetchCityData();  // This is an async operation
  displayCities();  // Assuming this function sets up your page

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
  }).setView([communeData.latitude, communeData.longitude], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 6,
  }).addTo(map);

  L.marker([communeData.latitude, communeData.longitude]).addTo(map);
};

// ---------------------------------------- END Map ---------------------------------------- //


// Function to calculate the "City Score"
function calculateCityScore(medianValues, cityData) {

  let score = 0;

  const weights = {
    unemployment: 0.1,
    salary: 0.2,
    activityRate: 0.2,
    povertyRate: 0.1,
    transport: 0.4,
  };

  // Unemployment: Lower is better
  const unemploymentScore = Math.min(2, 10 * (1 - (cityData.unemploymentRate2022 / medianValues.tauxDeChomage)) * weights.unemployment);

  // Salary: Higher is better
  const salaryScore = Math.min(2, 10 * (cityData.averageNetSalary2021 / medianValues.salaire) * weights.salary);

  // Activity rate: Higher is better
  const activityRateScore = Math.min(2, 10 * (cityData.activityRateOverall / medianValues.tauxDActiviteEnsemble) * weights.activityRate);

  // Poverty rate: Lower is better
  const povertyRateScore = Math.min(2, 10 * (1 - (cityData.povertyRate / medianValues.tauxDePauvrete)) * weights.povertyRate);

  // Transport: Public transport and bike usage are better than car usage
  const transportScore = Math.min(2, 10 * (parseFloat(cityData.transport.partVelo + cityData.transport.partTransportEnCommun) / (medianValues.partTransportEnCommun + medianValues.partVelo)) * weights.transport);

  // Sum them up
  score += unemploymentScore;
  score += salaryScore;
  score += activityRateScore;
  score += povertyRateScore;
  score += transportScore;

  // 1 digit after the decimal point
  const finalScore = parseFloat(score.toFixed(1));

  // Limit the score to be within 1 to 10
  return Math.min(Math.max(finalScore, 1), 10);
}


// ---------------------------------------- Charts ---------------------------------------- //

function initializeTemperatureChart(departmentName) {
  console.log(document.getElementById('temperatures'));
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
          borderColor: 'red',
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
          borderColor: 'purple',
          fill: false,
          cubicInterpolationMode: 'monotone',
        }
      ]
      
    },
    options: {
      // your options here
    }
  });
}


