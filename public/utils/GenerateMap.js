import { communesMap } from './Maps.js';
import { convertToCommuneFormat } from './ConvertToCommuneFormat.js';


export const generateMap = (city) => {
    const convertedLabel = convertToCommuneFormat(city.label);
    const communeData = communesMap.get(convertedLabel);

    const map = L.map('map', {
        zoomControl: false,
    }).setView([communeData.latitude, communeData.longitude], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([communeData.latitude, communeData.longitude]).addTo(map);
};