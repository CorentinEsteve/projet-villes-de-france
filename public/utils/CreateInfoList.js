export function createInfoList(emoji, text, value, type, medianValue) {
    let formattedValue = value.toLocaleString('fr-FR');
    
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
        <tr>
            <td class="emoji">${emoji}</td>
            <td class="info-text">${text}</td>
            <td class="comparison">${comparisonDiv}</td>
            <td class="info-value">${formattedValue}${type ? ` ${type}` : ''}</td>
        </tr>
    `;
}