import { displaySingleCity } from './DisplaySingleCity.js';

export function navigateToCity(cityLabel) {
    history.pushState(null, '', `/city/${cityLabel}`);
    displaySingleCity(cityLabel)
}