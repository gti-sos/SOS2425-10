datos = [
    { year: 2018, province: "Araba/Álava", total_general: 10236 },
    { year: 2018, province: "Albacete", total_general: 9530 },
    { year: 2018, province: "Alicante/Alacant", total_general: 99743 },
    { year: 2018, province: "Almería", total_general: 16273 },
    { year: 2019, province: "Araba/Álava", total_general: 9597 },
    { year: 2019, province: "Albacete", total_general: 9778 },
    { year: 2019, province: "Alicante/Alacant", total_general: 98424 },
    { year: 2019, province: "Almería", total_general: 15060 },
    { year: 2020, province: "Araba/Álava", total_general: 8262 },
    { year: 2020, province: "Albacete", total_general: 8297 },
    { year: 2020, province: "Alicante/Alacant", total_general: 53683 },
    { year: 2020, province: "Almería", total_general: 11312 }
];

// Filtrar por provincia
const provinciaSeleccionada = "Alicante/Alacant";
const datosProvincia = datos.filter(d => d.province === provinciaSeleccionada);

// Calcular la media del total_general
const media = datosProvincia.reduce((acc, d) => acc + d.total_general, 0) / datosProvincia.length;

console.log(`La media de 'total_general' para la provincia de ${provinciaSeleccionada} es: ${media.toFixed(2)}`);

