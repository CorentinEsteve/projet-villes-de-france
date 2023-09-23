export function capitalizeFirstLetterOfEachWord(str) {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}