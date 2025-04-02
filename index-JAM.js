let JAM = [
    { year: 2018, province: "Álava", total_general_national: 1445, total_general_import: 8791, total_general_auction: 0, total_general: 10236},
    { year: 2018, province: "Albacete", total_general_national: 786, total_general_import: 8743, total_general_auction: 1, total_general: 9530 },
    { year: 2018, province: "Alicante", total_general_national: 8004, total_general_import: 91734, total_general_auction: 5, total_general: 99743 },
    { year: 2018, province: "Almería", total_general_national: 1662, total_general_import: 14611, total_general_auction: 0, total_general: 16273 },
    { year: 2019, province: "Álava", total_general_national: 1340, total_general_import: 8257, total_general_auction: 0, total_general: 9597 },
    { year: 2019, province: "Albacete", total_general_national: 638, total_general_import: 9140, total_general_auction: 0, total_general: 9778 },
    { year: 2019, province: "Alicante", total_general_national: 5066, total_general_import: 93357, total_general_auction: 1, total_general: 98424 },
    { year: 2019, province: "Almería", total_general_national: 1105, total_general_import: 13954, total_general_auction: 1, total_general: 15060 },
    { year: 2020, province: "Álava", total_general_national: 1530, total_general_import: 6732, total_general_auction: 0, total_general: 8262 },
    { year: 2020, province: "Albacete", total_general_national: 461, total_general_import: 7836, total_general_auction: 0, total_general: 8297 },
    { year: 2020, province: "Alicante", total_general_national: 3240, total_general_import: 50442, total_general_auction: 1, total_general: 53683 },
    { year: 2020, province: "Almería", total_general_national: 749, total_general_import: 10563, total_general_auction: 0, total_general: 11312 }
  ];

// Filtrar por provincia
const provinciaSeleccionada = "Alicante/Alacant";
const datosProvincia = JAM.filter(d => d.province === provinciaSeleccionada);

// Calcular la media del total_general
const media = datosProvincia.reduce((acc, d) => acc + d.total_general, 0) / datosProvincia.length;

console.log(`La media de 'total_general' para la provincia de ${provinciaSeleccionada} es: ${media.toFixed(2)}`);

export {JAM};