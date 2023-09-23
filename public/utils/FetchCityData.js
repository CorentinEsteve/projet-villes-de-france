import { newDataMap, temperaturesMap, communesMap } from './Maps.js';
import { fetchData } from './FetchData.js';
import { roundToOneDecimal } from './RoundToOneDecimal.js';

// Fetch all city-related data and populate the respective maps
export async function fetchCityData() {
    try {
    const [sociologie0, sociologie, emplois, securite, transport2, logement, equipements, tourisme, developpement, emplois_departement, temperatures, communes2, aop] = await Promise.all([
        fetchData('./public/new_data/compressed/0_insee_sociologie.json').then(data => data.Data),
        fetchData('./public/new_data/compressed/1_insee_sociologie.json').then(data => data.Data),
        fetchData('./public/new_data/compressed/2_insee_emplois.json').then(data => data.Data),
        fetchData('./public/new_data/compressed/3_insee_securite.json').then(data => data.Data),
        fetchData('./public/new_data/compressed/4_insee_transport.json').then(data => data.Data),
        fetchData('./public/new_data/compressed/5_insee_logement.json').then(data => data.Data),
        fetchData('./public/new_data/compressed/6_insee_equipements.json').then(data => data.Data),
        fetchData('./public/new_data/compressed/7_insee_tourisme.json').then(data => data.Data),
        fetchData('./public/new_data/compressed/8_insee_developpement.json').then(data => data.Data),
        fetchData('./public/new_data/compressed/9_insee_emplois_departement.json').then(data => data.Data),
        fetchData('./public/new_data/temperature-averages-last-5-years.json'),
        fetchData('./public/new_data/compressed/communes_departement_region.json'),
        fetchData('./public/new_data/compressed/communes-aires-aop.json'),
    ]);

    sociologie0.forEach(entry => {
        const existingData = newDataMap.get(entry.Libellé) || {};

        const newData = {
            population2020: parseInt(entry["Population municipale 2020"], 10),
            annualPopChange2014To2020: parseFloat(entry["Évol. annuelle moy. de la population 2014-2020"])
        };

        newDataMap.set(entry.Libellé, Object.assign(existingData, newData));
    });

    sociologie.forEach(entry => {
        const existingData = newDataMap.get(entry.Libellé) || {};

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

        newDataMap.set(entry.Libellé, Object.assign(existingData, newData));
    });

    emplois.forEach(entry => {
        const existingData = newDataMap.get(entry.Libellé) || {};

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

        newDataMap.set(entry.Libellé, Object.assign(existingData, newData));
    });

    securite.forEach(entry => {
        const existingData = newDataMap.get(entry.Libellé) || {};

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

        newDataMap.set(entry.Libellé, Object.assign(existingData, newData));
    });

    transport2.forEach(entry => {
        const existingData = newDataMap.get(entry.Libellé) || {};

        const newData = {
            publicTransitUse2020: parseFloat(entry["Part des actifs occupés de 15 ans ou plus  les transports en commun 2020"]),
            bikeUseForWork2020: parseFloat(entry["Part des actifs occ 15 ans ou plus vélo pour travailler 2020"]),
            carUseForWork2020: parseFloat(entry["Part des actifs occ 15 ans ou plus voiture pour travailler 2020"])
        };

        newDataMap.set(entry.Libellé, Object.assign(existingData, newData));
    });

    logement.forEach(entry => {
        const existingData = newDataMap.get(entry.Libellé) || {};

        const newData = {
            primaryResidenceRate2020: parseFloat(entry["Part des rés. principales dans le total des logements 2020"]),
            secondaryResidenceRate2020: parseFloat(entry["Part des rés. secondaires (y compris les logements occasionnels) dans le total des logements 2020"]),
            vacantHousingRate2020: parseFloat(entry["Part des logements vacants dans le total des logements 2020"]),
            apartmentRate2020: parseFloat(entry["Part des appartements dans le total des logements 2020"]),
            houseRate2020: parseFloat(entry["Part des maisons dans le total des logements 2020"])
        };

        newDataMap.set(entry.Libellé, Object.assign(existingData, newData));
    });

    equipements.forEach(entry => {
        const existingData = newDataMap.get(entry.Libellé) || {};

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

        newDataMap.set(entry.Libellé, Object.assign(existingData, newData));
    });

    tourisme.forEach(entry => {
        const existingData = newDataMap.get(entry.Libellé) || {};

        const newData = {
            numHotels2023: parseInt(entry["Nb d'hôtels 2023"], 10),
            numHotelRooms2023: parseInt(entry["Nb de chambres dans les hôtels 2023"], 10),
            numEconomicHotels: parseInt(entry["Non classés ou 1 étoile (économique)"], 10),
            numMidRangeHotels: parseInt(entry["2 ou 3 étoiles (milieu de gamme)"], 10),
            numHighEndHotels: parseInt(entry["4 ou 5 étoiles (haut de gamme)"], 10),
            numCampingSites2023: parseInt(entry["Nb de terrains de camping 2023"], 10)
        };

        newDataMap.set(entry.Libellé, Object.assign(existingData, newData));
    });

    developpement.forEach(entry => {
        const existingData = newDataMap.get(entry.Libellé) || {};

        const newData = {
            partLogementsSurOccupation2019: parseFloat(entry["Part des logements en situation de sur-occupation 2019"]),
            partPopulationEloigneeEquipementsIntermediaires2021: parseFloat(entry["Part de la population éloignée des équipements intermédiaires, 2021"]),
            partPopulationEloigneeEquipementsProximite2021: parseFloat(entry["Part de la population éloignée des équipements de proximité, 2021"]),
            partPopulationEloigneeEquipementsSuperieurs2021: parseFloat(entry["Part de la population éloignée des équipements supérieurs, 2021"])
        };

        newDataMap.set(entry.Libellé, Object.assign(existingData, newData));
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
        const CommuneName = entry.libelle_acheminement;

        communesMap.set(CommuneName, {
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
        const communeData = communesMap.get(entry.Commune);
        
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