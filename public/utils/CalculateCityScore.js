// Safely handle number operations
const safeNumber = (num) => isNaN(num) ? 0 : num;

// Calculate each individual score
const calculateIndividualScore = (dataValue, medianValue, scalingFactor = 1) => {
  return parseFloat((Math.min(2, (safeNumber(dataValue) / (medianValue * scalingFactor)))).toFixed(1));
};

export function calculateCityScore(medianValues, cityData, departmentData) {
    
    const weights = {
        unemployment: 0.2,
        salary: 0.3,
        activityRate: 0.2,
        transport: 0.2,
        tourism: 0.1,
        age: 0.1,
        education: 0.1,
        housing: 0.1,
        crime: 0.1,
        overOccupiedHousing: 0.1,
    };
    
    // Calculate individual scores using the helper function
    const unemploymentScore = calculateIndividualScore(departmentData?.averageAnnualUnemploymentRate2022, 10);
    const salaryScore = calculateIndividualScore(departmentData?.averageNetHourlyWage2021, medianValues.MedianHourlyNetSalary2021);
    const activityRateScore = calculateIndividualScore(cityData?.overallActivityRate2020 * 2, 100);
    const transportScore = calculateIndividualScore(cityData?.bikeUseForWork2020 + cityData?.publicTransitUse2020, 10);
    const tourismScore = calculateIndividualScore(cityData?.numHotels2023 * 1000, cityData?.population2020);
    const ageScore = calculateIndividualScore(cityData?.between25To64AgePart2020 + cityData?.under25AgePart2020 + cityData?.under15AgePart2020, medianValues.MedianAgeUnder15 + medianValues.MedianAgeUnder25 + medianValues.MedianAge25to64);
    const educationScore = calculateIndividualScore(cityData?.bacEducationPart2020 + cityData?.bacPlus2EducationPart2020 + cityData?.bacPlus3Or4EducationPart2020 + cityData?.bacPlus5OrAboveEducationPart2020, medianValues.MedianBac + medianValues.MedianBacPlus2 + medianValues.MedianBacPlus3or4 + medianValues.MedianBacPlus5OrMore);
    const housingScore = calculateIndividualScore(cityData?.primaryResidenceRate2020, medianValues.MedianMainResidenceRate2020);
    const overOccupiedHousingScore = parseFloat((Math.min(1, safeNumber(cityData?.partLogementsSurOccupation2019) / 100)).toFixed(1));

    const crimeDataSum = safeNumber(cityData?.voluntaryAssaultRate2022 ?? 0) +
        safeNumber(cityData?.familyVoluntaryAssaultRate2022 ?? 0) +
        safeNumber(cityData?.nonFamilyVoluntaryAssaultRate2022 ?? 0) +
        safeNumber(cityData?.sexualViolenceRate2022 ?? 0) +
        safeNumber(cityData?.armedRobberyRate2022 ?? 0) +
        safeNumber(cityData?.unarmedRobberyRate2022 ?? 0) +
        safeNumber(cityData?.nonViolentTheftRate2022 ?? 0) +
        safeNumber(cityData?.burglaryRate2022 ?? 0) +
        safeNumber(cityData?.vehicleTheftRate2022 ?? 0) +
        safeNumber(cityData?.theftFromVehiclesRate2022 ?? 0) +
        safeNumber(cityData?.theftOfVehicleAccessoriesRate2022 ?? 0) +
        safeNumber(cityData?.vandalismRate2022 ?? 0) +
        safeNumber(cityData?.drugUseRate2022 ?? 0) +
        safeNumber(cityData?.drugTraffickingRate2022 ?? 0);

    const medianCrimeDataSum = medianValues.AverageIntentionalInjuriesRate +
        medianValues.AverageFamilyViolenceRate +
        medianValues.AverageNonFamilyViolenceRate +
        medianValues.AverageSexualViolenceRate +
        medianValues.AverageArmedRobberyRate +
        medianValues.AverageUnarmedRobberyRate +
        medianValues.AverageNonViolentTheftRate +
        medianValues.AverageHomeBurglaryRate +
        medianValues.AverageVehicleTheftRate +
        medianValues.AverageTheftFromVehiclesRate +
        medianValues.AverageVehicleAccessoryTheftRate +
        medianValues.AverageDestructionAndVandalismRate +
        medianValues.AverageDrugUseRate +
        medianValues.AverageDrugTraffickingRate;

    const crimeScore = parseFloat((Math.min(1, crimeDataSum / (medianCrimeDataSum / 10))).toFixed(1));
    
    const individualScores = {
        unemploymentScore,
        salaryScore,
        activityRateScore,
        transportScore,
        tourismScore,
        ageScore,
        educationScore,
        housingScore,
        overOccupiedHousingScore,
        crimeScore,
    };

    // console.log(individualScores)
    
    // Calculate the total score
    const totalScore = parseFloat(
    (-unemploymentScore + salaryScore + activityRateScore + transportScore +
        tourismScore + ageScore + educationScore + housingScore -
        overOccupiedHousingScore - crimeScore).toFixed(1)
    );
    
    const constrainedTotalScore = Math.min(Math.max(totalScore, 1), 10);
    
    // Add the total score to the array and return
    return {
        individualScores,
        totalScore: constrainedTotalScore
    };
}
