import { createInfoCard } from './CreateInfoCard.js';
import { createInfoList } from './CreateInfoList.js';
import { medianValues } from './medians_averages.js';
import { initializeTemperatureChart } from './InitializeTemperatureChart.js';
import { initializeCriminalityChart } from './InitializeCriminalityChart.js';
import { newDataMap } from './Maps.js';


// Function to display info in city page
export function displayCityInfo(cityLabel, cityData, communeData) {

    const annualPopChange = cityData?.annualPopChange2014To2020 ?? 'N/A';
    const emoji = annualPopChange > 0 ? '🔺' : (annualPopChange < 0 ? '🔻' : '📈');
  
    const departmentName = communeData?.nom_departement; 
    const departmentData = newDataMap.get(departmentName);
    
    if (departmentName) {
      setTimeout(() => initializeTemperatureChart(departmentName), 100);
      setTimeout(() => initializeCriminalityChart(cityData, medianValues), 100);
    }
  
    const aopList = communeData?.aop?.map(aop => aop.aop).join(', ') || 'Aucun produit répertorié';
  
    const scoreData = cityData?.scoreData; // Assuming this contains the new scores object
    let displayTotalScore = scoreData ? `${scoreData.totalScore} / 10` : '- / 10';
    let displayIndividualScores = scoreData ? JSON.stringify(scoreData.individualScores) : 'N/A';
  
    return `
    <div class="city-info">
      <div class="city-info-header">
        <h2>${cityLabel}</h2>
        <p>${displayTotalScore}</p>
      </div>
    
      <div style="display: flex; flex-wrap: wrap;">
        <div class="table-wrapper" style="flex: 1 1 20rem;">
          <table class="info-list" style="min-height: 100%;">
            ${createInfoList('💰', 'Salary Score', (scoreData?.individualScores?.salaryScore ?? 'N/A'), '/ 2')}
            ${createInfoList('🏃', 'Activity Rate Score', (scoreData?.individualScores?.activityRateScore ?? 'N/A'), '/ 2')}
            ${createInfoList('🚌', 'Transport Score', (scoreData?.individualScores?.transportScore ?? 'N/A'), '/ 2')}
            ${createInfoList('🏖️', 'Tourism Score', (scoreData?.individualScores?.tourismScore ?? 'N/A'), '/ 2')}
            ${createInfoList('👶', 'Age Score', (scoreData?.individualScores?.ageScore ?? 'N/A'), '/ 2')}
            ${createInfoList('🎓', 'Education Score', (scoreData?.individualScores?.educationScore ?? 'N/A'), '/ 2')}
            ${createInfoList('🏡', 'Housing Score', (scoreData?.individualScores?.housingScore ?? 'N/A'), '/ 2')}
            ${createInfoList('🏫', 'Unemployment Score', - (scoreData?.individualScores?.unemploymentScore ?? 'N/A'), '/ 2')}
            ${createInfoList('🔒', 'Crime Score', - (scoreData?.individualScores?.crimeScore ?? 'N/A'), '/ 1')}
            ${createInfoList('🏠', 'Over-Occupied Housing Score', - (scoreData?.individualScores?.overOccupiedHousingScore ?? 'N/A'), '/ 1')}
          </table>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; flex: 1 1 15rem;">
          ${createInfoCard('📬', 'Code Postal', communeData?.code_postal ?? 'N/A', '')}
          ${createInfoCard('📍', 'Code département', communeData?.code_departement ?? 'N/A', '')}
          ${createInfoCard('🏞️', 'Département', communeData?.nom_departement ?? 'N/A', '')}
          ${createInfoCard('🗺️', 'Code Région', communeData?.code_region ?? 'N/A', '')}
          ${createInfoCard('🌍', 'Région', communeData?.nom_region ?? 'N/A', '')}
        </div>
      </div>

      <h3>🏛️ &nbsp; Données générales</h3>
      ${createInfoCard('👥', 'Population', (cityData?.population2020 ?? 'N/A'), '', medianValues.MedianPopulation)}
      ${createInfoCard(emoji, 'Évolution annuelle de la population', annualPopChange, '%', medianValues.AveragePopulationEvolution)}
      ${createInfoCard('🏙️', 'Densité de population', (cityData?.populationDensity2020 !== undefined ? Math.round(cityData?.populationDensity2020) : 'N/A'), 'hab/km²', medianValues.MedianDensity)}
      
      <h3>💰 &nbsp; Salaire</h3>
      ${createInfoCard('💶', 'Salaire net horaire moyen', (departmentData?.averageNetHourlyWage2021 ?? 'N/A'), '€', medianValues.MedianHourlyNetSalary2021)}
      ${createInfoCard('👩‍💼', 'Salaire net horaire moyen des femmes', (departmentData?.averageNetHourlyWageWomen2021 ?? 'N/A'), '€', medianValues.MedianHourlyNetSalaryWomen_2021)}
      ${createInfoCard('👨‍💼', 'Salaire net horaire moyen des hommes', (departmentData?.averageNetHourlyWageMen2021 ?? 'N/A'), '€', medianValues.MedianHourlyNetSalaryMen_2021)}
      
      <h3>👨‍⚕️ &nbsp; Emploi </h3>
      ${createInfoCard('📊', 'Taux d\'activité', (cityData?.overallActivityRate2020 ?? 'N/A'), '%', medianValues.MedianActivityRate)}
      ${createInfoCard('📉', 'Taux de chômage', (departmentData?.averageAnnualUnemploymentRate2022 ?? 'N/A'), '%', medianValues.MedianUnemploymentRate2022)}
  
      <h3>👨‍👩‍👧‍👦 &nbsp; Répartition des âge</h3>
      ${createInfoCard('👶', 'Moins de 15 ans', (cityData?.under15AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeUnder15)}
      ${createInfoCard('👦', 'Moins de 25 ans', (cityData?.under25AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeUnder25)}
      ${createInfoCard('🧓', '25 - 64 ans', (cityData?.between25To64AgePart2020 ?? 'N/A'), '%', medianValues.MedianAge25to64)}
      <div class="break"></div>
      ${createInfoCard('👨', 'Plus de 65 ans', (cityData?.above65AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeOver65)}
      ${createInfoCard('👵', 'Plus de 75 ans', (cityData?.above75AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeOver75)}
      ${createInfoCard('👴', 'Plus de 80 ans', (cityData?.above80AgePart2020 ?? 'N/A'), '%', medianValues.MedianAgeOver80)}
  
      <h3>🚗 &nbsp; Transports</h3>
      ${createInfoCard('🚲', 'Part des actifs occupés de 15 ans ou plus utilisant le vélo pour aller travailler', (cityData?.bikeUseForWork2020 ?? 'N/A'), '%', medianValues.MedianBicycleUsageRate2020)}
      ${createInfoCard('🚆', 'Part des actifs occupés de 15 ans ou plus utilisant les transports en commun pour aller travailler', (cityData?.publicTransitUse2020 ?? 'N/A'), '%', medianValues.MedianPublicTransportUsageRate2020)}
      ${createInfoCard('🚗', 'Part des actifs occupés de 15 ans ou plus utilisant la voiture pour aller travailler', (cityData?.carUseForWork2020 ?? 'N/A'), '%', medianValues.MedianCarUsageRate2020)}
  
      <h3>👮‍♀️ &nbsp; Criminalité</h3>
      <div class="chart-container">
        <canvas id="criminality"></canvas>
      </div>
  
      <div class="break"></div>
  
      <h3>🌡️ &nbsp; Températures annuelles</h3>
      <div class="chart-container">
        <canvas id="temperatures"></canvas>
      </div>
      
      <h3>🧀 &nbsp; Produits AOP</h3>
      ${createInfoCard('🧀🍷', 'Produits AOP', aopList, '')}
  
      <h3>🏨 &nbsp; Tourisme</h3>
      ${createInfoCard('🏨', ' Hôtels', (cityData?.numHotels2023 ?? 'N/A'), '')}
      ${createInfoCard('🏨', ' Chambres d\'hôtel', (cityData?.numHotelRooms2023 ?? 'N/A'), '')}
      ${createInfoCard('🏨', ' Hôtels économiques ou non classés', (cityData?.numEconomicHotels ?? 'N/A'), '')}
      ${createInfoCard('🏨', ' Hôtels milieu de gamme', (cityData?.numMidRangeHotels ?? 'N/A'), '')}
      ${createInfoCard('🏨', ' Hôtels haut de gamme', (cityData?.numHighEndHotels ?? 'N/A'), '')}
      ${createInfoCard('⛺️', ' Terrains de camping', (cityData?.numCampingSites2023 ?? 'N/A'), '')}
  
      <h3>🏥 &nbsp; Santé</h3>
      ${createInfoCard('🏥', 'Services d\'urgence', (cityData?.numEmergencyServices2021 ?? 'N/A'), '')}
      ${createInfoCard('🏫', 'Pharmacies', (cityData?.numPharmacies2021 ?? 'N/A'), '')}
      <div class="break"></div>
      ${createInfoCard('👩‍⚕️', 'Médecins généralistes', (cityData?.numGeneralDoctors2021 ?? 'N/A'), '')}
      ${createInfoCard('👨‍⚕️', 'Chirurgiens dentistes', (cityData?.numDentists2021 ?? 'N/A'), '')}
      ${createInfoCard('🧑‍⚕️', 'Infirmiers', (cityData?.numNurses2021 ?? 'N/A'), '')}
      ${createInfoCard('🧑‍⚕️', 'Masseurs kinésithérapeutes', (cityData?.numPhysiotherapists2021 ?? 'N/A'), '')}
  
      <h3>🏫 &nbsp; Éducation</h3>
  
      <div class="table-wrapper">
        <table class="info-list">
          ${createInfoList('🏫', 'Crèches', (cityData?.numDaycare2021 ?? 'N/A'), '')}
          ${createInfoList('🏫', 'Écoles maternelles', (cityData?.numKindergarten2021 ?? 'N/A'), '')}
          ${createInfoList('🏫', 'Écoles élémentaires', (cityData?.numElementarySchool2021 ?? 'N/A'), '')}
          ${createInfoList('🏫', 'Collèges', (cityData?.numMiddleSchool2021 ?? 'N/A'), '')}
          ${createInfoList('🏫', 'Lycées', (cityData?.numHighSchool2021 ?? 'N/A'), '')}
        </table>
      </div>
  
      <h3>🏘️ &nbsp; Logement</h3>
      ${createInfoCard('🏠', 'Part des résidences principales', (cityData?.primaryResidenceRate2020 ?? 'N/A'), '%', medianValues.MedianMainResidenceRate2020)}
      ${createInfoCard('🏠', 'Part des résidences secondaires', (cityData?.secondaryResidenceRate2020 ?? 'N/A'), '%', medianValues.MedianSecondaryResidenceRate2020)}
      ${createInfoCard('🏠', 'Part des logements vacants', (cityData?.vacantHousingRate2020 ?? 'N/A'), '%', medianValues.MedianVacantHousingRate2020)}
  
      <h3>🏠 &nbsp; Type de logement</h3>
      ${createInfoCard('🏠', 'Part des appartements', (cityData?.apartmentRate2020 ?? 'N/A'), '%', medianValues.MedianApartmentRate2020)}
      ${createInfoCard('🏡', 'Part des maisons', (cityData?.houseRate2020 ?? 'N/A'), '%', medianValues.MedianHouseRate2020)}
  
      <h3>👩‍🎓 &nbsp; Éducation</h3>
      ${createInfoCard('👨‍💼', 'Part sans diplôme', (cityData?.noOrLowEducationPart2020 ?? 'N/A'), '%', medianValues.MedianNoOrLowEducation)}
      ${createInfoCard('👨‍💼', 'Part des diplômés d\'un Brevet des collèges', (cityData?.capOrBepEducationPart2020 ?? 'N/A'), '%', medianValues.MedianBEPCOrBrevet)}
      ${createInfoCard('👨‍💼', 'Part des diplômés d\'un CAP, BEP ou équivalent', (cityData?.bepcOrBrevetEducationPart2020 ?? 'N/A'), '%', medianValues.MedianCAPorBEP)}
      <div class="break"></div>
      ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC', (cityData?.bacEducationPart2020 ?? 'N/A'), '%', medianValues.MedianBac)}
      ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+2', (cityData?.bacPlus2EducationPart2020 ?? 'N/A'), '%', medianValues.MedianBacPlus2)}
      ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+3 ou BAC+4', (cityData?.bacPlus3Or4EducationPart2020 ?? 'N/A'), '%', medianValues.MedianBacPlus3or4)}
      ${createInfoCard('👨‍🎓', 'Part des diplômés d\'un BAC+5 ou plus', (cityData?.bacPlus5OrAboveEducationPart2020 ?? 'N/A'), '%', medianValues.MedianBacPlus5OrMore)}
  
      <h3>🗺️ &nbsp; Localisation</h3>
      <div id="map"></div>
    </div>
    `;
  }
  