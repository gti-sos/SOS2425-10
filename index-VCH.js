let VCH = [
    {accident_id: 1, year: 2023, month: 1, province: "Álava", municipality_code: "Álava", road: "A-1", km: 357, direction_1f: 2, accident_type: 12, total_victims: 1},
    {accident_id: 890, year: 2023, month: 11, province: "Albacete", municipality_code: "Albacete", road: "ARROYO DE", km: 0.7, direction_1f: 2, accident_type: 18, total_victims: 1},
    {accident_id: 1641, year: 2023, month: 8, province: "Álava", municipality_code: "Álava", road: "CV-700", km: 55.058, direction_1f: 2, accident_type: 3, total_victims: 1},
    {accident_id: 5291, year: 2023, month: 3, province: "Albacete", municipality_code: "Albacete", road: "N-352", km: 1.5, direction_1f: 1, accident_type: 10, total_victims: 1},
    {accident_id: 5293, year: 2023, month: 11, province: "Alicante", municipality_code: "Benidorm", road: "AL-5405", km: 0.8, direction_1f: 1, accident_type: 14, total_victims: 1},
    {accident_id: 6861, year: 2023, month: 2, province: "Almería", municipality_code: "El Ejido", road: "N-6", km: 109.524, direction_1f: 1, accident_type: 2, total_victims: 2},
    {accident_id: 7162, year: 2023, month: 2, province: "Ávila", municipality_code: "Ávila", road: "N-430", km: 133.391, direction_1f: 2, accident_type: 19, total_victims: 1},
    {accident_id: 8192, year: 2023, month: 8, province: "Badajoz", municipality_code: "Badajoz", road: "Ma-2100", km: 14.684, direction_1f: 3, accident_type: 1, total_victims: 6},
    {accident_id: 11007, year: 2023, month: 1, province: "Islas Baleares", municipality_code: "Islas Baleares", road: "B-150", km: 1.6, direction_1f: 4, accident_type: 3, total_victims: 1},
    {accident_id: 28711, year: 2023, month: 7, province: "Barcelona", municipality_code: "Hospitalet de Llobregat", road: "CAMINO", km: 0.3, direction_1f: 2, accident_type: 10, total_victims: 1}
]

// Filtrado por tipo de accidente 
let filtered = VCH.filter((x)=> x.accident_type == 10)

//Media de fallecidos en accidentes ocurridos en Albacete

let albaceteAccidents = VCH.filter(accident => accident.province === "Albacete");
let totalVictims = albaceteAccidents.reduce((sum, accident) => sum + accident.total_victims, 0);
let averageVictims = albaceteAccidents.length > 0 ? totalVictims / albaceteAccidents.length : 0;




console.log("filtrado por tipo de accidente: ", filtered);

console.log("Media de total_victims en Albacete:", averageVictims);

export {VCH};