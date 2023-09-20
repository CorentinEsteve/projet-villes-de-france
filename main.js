// import { fetchData } from './js/data/fetchData.js';
// import { normalizeString } from './js/utils/normalizeString.js';
// import { calculateCityScore } from './models/calculateCityScore.js';
// import { displayCities, displaySingleCity } from './display/displayCities.js';

// Maps to hold data
const newDataMap = new Map();
const temperaturesMap = new Map();
const communesMap = new Map();

const allDataMap = new Map();
const ageDistributionMap = new Map();
const communeMap = new Map();
const transportMap = new Map();
const averageTemperatureMap = new Map();
let allCityData = [];

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
    const [ageData, allData, communes, transport, averageTemperature] = await Promise.all([
      fetchData('/data/repartition_ages.json').then(data => data.Data),
      fetchData('/data/all_data.json').then(data => data.Data),
      fetchData('/data/communes_departement_region.json'),
      fetchData('/data/transport_mode.json').then(data => data.Data),
      fetchData('/data/temperature-averages-last-5-years.json')
    ]);

    const [sociologie, emplois, securite, transport2, logement, equipements, tourisme, developpement, temperatures, communes2] = await Promise.all([
      // --------------------------- new data --------------------------- //
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
        overallActivityRateByAge2020: parseFloat(entry["Taux d'activité par tranche d'âge 2020\r\r\nEnsemble"])
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
      let department = entry.departement;
      let month = entry.month;
      
      if (!temperaturesMap.has(department)) {
        temperaturesMap.set(department, new Map());
      }
      
      let monthData = {
          averageTemperature: roundToOneDecimal(entry.tmoy),
          averageTemperatureMin: roundToOneDecimal(entry.tmin),
          averageTemperatureMax: roundToOneDecimal(entry.tmax)
      };
        
      temperaturesMap.get(department).set(month, monthData);
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

    console.log("newDataMap", newDataMap);

    // --------------------------- end new data --------------------------- //


      // Initialize allCityData
      allCityData = allData.map(entry => ({
          label: entry['Libellé'],
          score: null
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
      
      transport.forEach(entry => {
        const normalizedCommuneName = entry._1 ? normalizeString(entry._1) : "";
    
        if (normalizedCommuneName) {
            transportMap.set(normalizedCommuneName, {
                partVelo: entry.Indic1, // "Part des actifs occ 15 ans ou plus vélo pour travailler 2020"
                partTransportEnCommun: entry.Indic2, // "Part des actifs occupés de 15 ans ou plus les transports en commun 2020"
                partVoiture: entry.Indic3, // "Part des actifs occ 15 ans ou plus voiture pour travailler 2020"
            });
        }
    });

    averageTemperature.forEach(entry => {
      let department = entry.departement;
      let month = entry.month;
      
      if (!averageTemperatureMap.has(department)) {
          averageTemperatureMap.set(department, new Map());
      }
      
      let monthData = {
          averageTemperature: roundToOneDecimal(entry.tmoy),
          averageTemperatureMin: roundToOneDecimal(entry.tmin),
          averageTemperatureMax: roundToOneDecimal(entry.tmax)
      };
        
        averageTemperatureMap.get(department).set(month, monthData);
    });


    allCityData.forEach(city => {
      const normalizedLabel = normalizeString(city.label);
      const cityStats = allDataMap.get(normalizedLabel);
      const cityTransport = transportMap.get(normalizedLabel);
    
      if (cityStats && cityTransport) {
        const aggregatedCityData = {
          ...cityStats,
          transport: cityTransport,
          score: calculateCityScore(medianValues, {...cityStats, transport: cityTransport}),
        };
        allDataMap.set(normalizedLabel, aggregatedCityData);
        
        city.score = aggregatedCityData.score;
      }
    });
      
    // Sort cities by population in descending order
    allCityData.sort((a, b) => {
      const aPopulation = allDataMap.get(normalizeString(a.label)).population;
      const bPopulation = allDataMap.get(normalizeString(b.label)).population;
      return bPopulation - aPopulation;
    });

  // Sort cities using the default sorting method and then slice the top 10
  const defaultSortingMethod = document.getElementById('sortingSelect').value;
  allCityData = sortCities(allCityData, defaultSortingMethod);

  // Display the top 10 cities
  displayCities(allCityData.slice(0, 10));

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display main page cities info
const displayCitiesInfo = (city, ageData, allData, communeData) => {
  const annualPopChange = allData?.annualPopChange ?? 'N/A';
  const emoji = annualPopChange > 0 ? '🔺' : (annualPopChange < 0 ? '🔻' : '📈');

  return `
    <div class="city-info-header">
      <h2>${city.label}</h2>
      <p>${city.score}/10</p>
      <p>Plus d'information</p>
      <i class="fa-solid fa-chevron-right" style="color: #333; font-size: 12px;"></i>
    </div>
    ${createInfoCard('👥', 'Population', (allData?.population ?? 'N/A'), '', medianValues.population)}
    ${createInfoCard('📉', 'Taux de chômage', (allData?.unemploymentRate2022 ?? 'N/A'), '%', medianValues.tauxDeChomage)}
    ${createInfoCard(emoji, 'Évolution de la population', annualPopChange, '%', medianValues.evolutionPopulation)}
    ${createInfoCard('💶', 'Salaire net horaire moyen', (allData?.averageNetSalary2021 ?? 'N/A'), '€', medianValues.salaire)}
    ${createInfoCard('📉', 'Taux de pauvreté', (allData?.povertyRate ?? 'N/A'), '%', medianValues.tauxDePauvrete)}
    ${createInfoCard('📊', 'Taux d\'activité', (allData?.activityRateOverall ?? 'N/A'), '%', medianValues.tauxDActiviteEnsemble)}
    ${createInfoCard('📬', 'Code Postal', communeData?.code_postal ?? 'N/A', '')}
    ${createInfoCard('🌍', 'Région', communeData?.nom_region ?? 'N/A', '')}

    <h3>👨‍👩‍👧‍👦 Répartition par âge</h3>
    ${createInfoCard('👶', 'Moins de 15 ans', (ageData?.below15 ?? 'N/A'), '%', medianValues.partMoins15ans)}
    ${createInfoCard('👦', 'Moins de 24 ans', (ageData?.below25 ?? 'N/A'), '%', medianValues.partMoins24ans)}
    ${createInfoCard('👨', '25 - 64 ans', (ageData?.between25and64 ?? 'N/A'), '%', medianValues.part25A64ans)}
    ${createInfoCard('👴', 'Plus de 65 ans', (ageData?.above65 ?? 'N/A'), '%', medianValues.partPlus65ans)}
  `;
};


// Display info in city page
const displayCityInfo = (city, ageData, allData, communeData) => {
  const annualPopChange = allData?.annualPopChange ?? 'N/A';
  const emoji = annualPopChange > 0 ? '🔺' : (annualPopChange < 0 ? '🔻' : '📈');

  return `
  <div class="city-info-header">
    <h2>${city.label}</h2>
    <p>${city.score}/10</p>
  </div>
  
  ${createInfoCard('📬', 'Code Postal', communeData?.code_postal ?? 'N/A', '')}
  ${createInfoCard('📍', 'Code département', communeData?.code_departement ?? 'N/A', '')}
  ${createInfoCard('🏞️', 'Département', communeData?.nom_departement ?? 'N/A', '')}
  ${createInfoCard('🗺️', 'Code Région', communeData?.code_region ?? 'N/A', '')}
  ${createInfoCard('🌍', 'Région', communeData?.nom_region ?? 'N/A', '')}

  <h3>🏛️ Données générales</h3>
  ${createInfoCard('👥', 'Population', (allData?.population ?? 'N/A'), '', medianValues.population)}
  ${createInfoCard('📉', 'Taux de chômage', (allData?.unemploymentRate2022 ?? 'N/A'), '%', medianValues.tauxDeChomage)}
  ${createInfoCard(emoji, 'Évolution de la population', annualPopChange, '%', medianValues.evolutionPopulation)}

  <h3>💰 Salaire</h3>
  ${createInfoCard('💶', 'Salaire net horaire moyen', (allData?.averageNetSalary2021 ?? 'N/A'), '€', medianValues.salaire)}
  ${createInfoCard('👩‍💼', 'Salaire net horaire moyen des femmes', (allData?.womenNetSalary2021 ?? 'N/A'), '€', medianValues.salaireFemme)}
  ${createInfoCard('👨‍💼', 'Salaire net horaire moyen des hommes', (allData?.menNetSalary2021 ?? 'N/A'), '€', medianValues.salaireHomme)}
  ${createInfoCard('📉', 'Taux de pauvreté', (allData?.povertyRate ?? 'N/A'), '%', medianValues.tauxDePauvrete)}

  <h3>👨‍⚕️👷‍♀️ Taux d'activité</h3>
  ${createInfoCard('📊', 'Taux d\'activité', (allData?.activityRateOverall ?? 'N/A'), '%', medianValues.tauxDActiviteEnsemble)}
  ${createInfoCard('👦📈', 'Taux d\'activité des 15 - 24 ans', (allData?.activityRate15To24 ?? 'N/A'), '%', medianValues.tauxDActivite15A24ans)}
  ${createInfoCard('👩📈', 'Taux d\'activité des 25 - 54 ans', (allData?.activityRate25To54 ?? 'N/A'), '%', medianValues.tauxDActivite25A54ans)}
  ${createInfoCard('👵📈', 'Taux d\'activité des 55 - 64 ans', (allData?.activityRate55To64 ?? 'N/A'), '%', medianValues.tauxDActivite55A64ans)}

  <h3>👨‍👩‍👧‍👦 Répartition par âge</h3>
  ${createInfoCard('👶', 'Moins de 15 ans', (ageData?.below15 ?? 'N/A'), '%', medianValues.partMoins15ans)}
  ${createInfoCard('👦', 'Moins de 25 ans', (ageData?.below25 ?? 'N/A'), '%', medianValues.partMoins24ans)}
  ${createInfoCard('👨', '25 - 64 ans', (ageData?.between25and64 ?? 'N/A'), '%', medianValues.part25A64ans)}
  ${createInfoCard('👴', 'Plus de 65 ans', (ageData?.above65 ?? 'N/A'), '%', medianValues.partPlus65ans)}
  ${createInfoCard('🧓', 'Plus de 75 ans', (ageData?.above75 ?? 'N/A'), '%', medianValues.partPlus75ans)}
  
  <h3>🚗 Mode de transport</h3>
  ${createInfoCard('🚴‍♀️', 'Part des actifs de 15 ans ou plus utilisant le vélo pour aller travailler', (transportMap.get(normalizeString(city.label))?.partVelo ?? 'N/A'), '%', medianValues.partVelo)}
  ${createInfoCard('🚇', 'Part des actifs de 15 ans ou plus utilisant les transports en commun pour aller travailler', (transportMap.get(normalizeString(city.label))?.partTransportEnCommun ?? 'N/A'), '%', medianValues.partTransportEnCommun)}
  ${createInfoCard('🚗', 'Part des actifs de 15 ans ou plus utilisant la voiture pour aller travailler', (transportMap.get(normalizeString(city.label))?.partVoiture ?? 'N/A'), '%', medianValues.partVoiture)}

  <h3>🌡️ Températures départementales</h3>
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(1)?.averageTemperature ?? 'N/A'), 'Janvier', (averageTemperatureMap.get(communeData?.nom_departement)?.get(1)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(1))}
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(2)?.averageTemperature ?? 'N/A'), 'Février', (averageTemperatureMap.get(communeData?.nom_departement)?.get(2)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(2))}
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(3)?.averageTemperature ?? 'N/A'), 'Mars', (averageTemperatureMap.get(communeData?.nom_departement)?.get(3)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(3))}
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(4)?.averageTemperature ?? 'N/A'), 'Avril', (averageTemperatureMap.get(communeData?.nom_departement)?.get(4)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(4))}
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(5)?.averageTemperature ?? 'N/A'), 'Mai', (averageTemperatureMap.get(communeData?.nom_departement)?.get(5)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(5))}
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(6)?.averageTemperature ?? 'N/A'), 'Juin', (averageTemperatureMap.get(communeData?.nom_departement)?.get(6)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(6))}
  <div class="break"></div>
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(7)?.averageTemperature ?? 'N/A'), 'Juillet', (averageTemperatureMap.get(communeData?.nom_departement)?.get(7)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(7))}
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(8)?.averageTemperature ?? 'N/A'), 'Août', (averageTemperatureMap.get(communeData?.nom_departement)?.get(8)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(8))}
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(9)?.averageTemperature ?? 'N/A'), 'Septembre', (averageTemperatureMap.get(communeData?.nom_departement)?.get(9)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(9))}
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(10)?.averageTemperature ?? 'N/A'), 'Octobre', (averageTemperatureMap.get(communeData?.nom_departement)?.get(10)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(10))}
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(11)?.averageTemperature ?? 'N/A'), 'Novembre', (averageTemperatureMap.get(communeData?.nom_departement)?.get(11)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(11))}
  ${createInfoCard(temperatureEmoji(averageTemperatureMap.get(communeData?.nom_departement)?.get(12)?.averageTemperature ?? 'N/A'), 'Décembre', (averageTemperatureMap.get(communeData?.nom_departement)?.get(12)?.averageTemperature ?? 'N/A'), '°C', findMedianTemperatureForMonth(12))}

  <h3>🗺️ Localisation</h3>
  <div id="map"></div>
`;

};

function temperatureEmoji(temperature) {
  if (temperature === 'N/A') return '❓';
  if (temperature < 0) return '❄️';
  if (temperature >= 0 && temperature < 10) return '🥶'; // Cold
  if (temperature >= 10 && temperature < 15) return '😰'; // Cold
  if (temperature >= 15 && temperature < 20) return '😊'; // Warm
  if (temperature >= 20 && temperature < 25) return '🥵'; // Hot
  if (temperature >= 25) return '🔥'; // Hot
}

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


// Function to display cities
const displayCities = (cities) => {
  const cityInfoDiv = document.getElementById('cityInfo');
  cityInfoDiv.innerHTML = "";

  cities.forEach(city => {
    const normalizedCityLabel = normalizeString(city.label);
    const allData = allDataMap.get(normalizedCityLabel);
    const ageData = ageDistributionMap.get(normalizedCityLabel);
    const communeData = communeMap.get(normalizedCityLabel);
    
    if (allData && ageData && communeData) {  // Only proceed if all data exists
      const updatedCity = { ...city, score: allData?.score };

      const cityElement = document.createElement('div');
      cityElement.id = 'city';
      
      cityElement.addEventListener('click', () => navigateToCity(city.label));
      cityElement.innerHTML = displayCitiesInfo(updatedCity, ageData, allData, communeData);
      
      cityInfoDiv.appendChild(cityElement);
    }
  });
};


const sortCities = (cities, sortingMethod) => {

  return cities.sort((a, b) => {
    const aData = allDataMap.get(normalizeString(a.label));
    const bData = allDataMap.get(normalizeString(b.label));

    switch (sortingMethod) {
      case 'populationDesc':
        return bData.population - aData.population;
      case 'populationAsc':
        return aData.population - bData.population;
      case 'scoreDesc':
        return bData.score - aData.score;
      case 'scoreAsc':
        return aData.score - bData.score;
      default:
        return 0;
    }
  });
};


document.getElementById('sortingSelect').addEventListener('change', () => {
  // Sort all cities based on the new criteria
  const sortingMethod = document.getElementById('sortingSelect').value;
  allCityData = sortCities(allCityData, sortingMethod);  // Sort and update the allCityData directly

  // Slice the first 10 and display
  displayCities(allCityData.slice(0, 10));
});



// Event listener for the search bar
document.getElementById('searchBar').addEventListener('input', function (e) {
  const searchTerm = e.target.value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics

  let filteredCities = allCityData.filter(city => {
    const normalizedCityLabel = city.label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics

    return normalizedCityLabel.includes(searchTerm);
  });

  // Sort all filtered cities
  const sortingMethod = document.getElementById('sortingSelect').value;
  const sortedFilteredCities = sortCities(filteredCities, sortingMethod);

  // Display the top 10 filtered cities
  displayCities(sortedFilteredCities.slice(0, 10));
});


// ---------------------------------------- Map ---------------------------------------- //

// Generate map
const generateMap = (city) => {
  const normalizedCityLabel = normalizeString(city.label);
  const communeData = communeMap.get(normalizedCityLabel);

  const map = L.map('map', {
    zoomControl: false, // Disable the default zoom control
  }).setView([communeData.latitude, communeData.longitude], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 6,
  }).addTo(map);

  L.marker([communeData.latitude, communeData.longitude]).addTo(map);
};


// Initial fetching of city data
fetchCityData();

// ---------------------------------------- Navigation ---------------------------------------- //

// Function to navigate to a city onclick
function navigateToCity(cityLabel) {
  history.pushState(null, '', `/city/${cityLabel}`);
  displaySingleCity(cityLabel);
}

// Function to display single city
function displaySingleCity(cityLabel) {
  const cityInfoDiv = document.getElementById('cityInfo');

  const containerDiv = document.createElement('div');
  containerDiv.className = 'city-card';

  const normalizedCityLabel = normalizeString(cityLabel);
  const allData = allDataMap.get(normalizedCityLabel);
  const ageData = ageDistributionMap.get(normalizedCityLabel);
  const communeData = communeMap.get(normalizedCityLabel);
  
  if (communeData) {

    const city = {
      label: cityLabel,
      score: allData.score,
    };

    // Generate city info and set it as the innerHTML of the container div
    containerDiv.innerHTML = displayCityInfo(
      city,
      ageData,
      allData,
      communeData
    );
      
      // Clear existing content and append the new container div
      cityInfoDiv.innerHTML = '';
      cityInfoDiv.appendChild(containerDiv);

      // Generate map
      generateMap({ label: cityLabel });
      // generateBarChart(cityLabel);
  }
}

window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  const cityLabel = path.split('/city/')[1];
  
  if (cityLabel) {
    displaySingleCity(cityLabel);
  } else {
    // Logic to go back to main page
    displayCities(allCityData.slice(0, 10));
  }
});

// Function to return to the initial list of cities
function returnToInitialView() {
  window.history.pushState({}, "", "/");
  displayCities(allCityData.slice(0, 10));
}

// Add a click event listener to the element with id 'returnButton'
document.getElementById('returnButton').addEventListener('click', returnToInitialView);



// Function to calculate the "City Score"
function calculateCityScore(medianValues, cityData) {

  let score = 0;

  // Each criterion will contribute a certain weight to the final score.
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

  // Your original final score calculation
  // const finalScore = Math.round(score);
  const finalScore = parseFloat(score.toFixed(1));


  // Limit the score to be within 1 to 10
  return Math.min(Math.max(finalScore, 1), 10);
}


