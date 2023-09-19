// export the fonction

export async function calculateCityScore(medianValues, cityData) {

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