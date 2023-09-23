export function initializeCriminalityChart(cityData, medianValues) {
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
            label: 'Taux national moyen (%)',
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
