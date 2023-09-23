export const roundToOneDecimal = (num) => {
    return isNaN(num) ? 'N/A' : parseFloat(num).toFixed(1);
}