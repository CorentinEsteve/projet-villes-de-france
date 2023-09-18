// Generate map
const generateMap = (city) => {
    const normalizedCityLabel = normalizeString(city.label);
    const communeData = communeMap.get(normalizedCityLabel);
  
    const map = L.map('map', {
      zoomControl: false, // Disable the default zoom control
    }).setView([communeData.latitude, communeData.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 6,
    }).addTo(map);
  
    L.marker([communeData.latitude, communeData.longitude]).addTo(map);
  };
  