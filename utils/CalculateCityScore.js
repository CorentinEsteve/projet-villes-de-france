export function calculateCityScore(medianValues, cityData, departmentData) {
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
