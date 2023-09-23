export const convertToCommuneFormat = (newDataLabel) => {
    return newDataLabel
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")  // Remove accents
        .replace(/-/g, ' ')  // Replace hyphens with spaces
        .replace(/'/g, ' ')  // Replace single quotes with spaces
        .replace(/\bSaint\b/gi, 'ST')  // Replace "Saint" with "ST"
        .toUpperCase();  // Make it uppercase
};