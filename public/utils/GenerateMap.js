import { communesMap } from './Maps.js';

export const generateMap = (city) => {
    const normalizedCityLabel = city.label.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const communeData = communesMap.get(normalizedCityLabel);

    const map = L.map('map', {
        zoomControl: false,
    }).setView([communeData.latitude, communeData.longitude], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([communeData.latitude, communeData.longitude]).addTo(map);
};