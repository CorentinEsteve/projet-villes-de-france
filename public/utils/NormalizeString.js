export const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
