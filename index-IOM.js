let myArray = [
    { autonomousCommunity: "Madrid (Comunidad de)", province: "Madrid", way: "M-40", kilometerPoint: 20.2, complaint: 118149, year: 2023, speedEstimation: 80, averageSpeedFined: 95 },
    { autonomousCommunity: "Andalucía", province: "Málaga", way: "A-7", kilometerPoint: 968.2, complaint: 66869, year: 2023, speedEstimation: 120, averageSpeedFined: 135 },
    { autonomousCommunity: "Navarra (Comunidad Foral de)", province: "Navarra", way: "A-15", kilometerPoint: 127.6, complaint: 49677, year: 2023, speedEstimation: 120, averageSpeedFined: 135 },
    { autonomousCommunity: "Andalucía", province: "Málaga", way: "A-7", kilometerPoint: 978.9, complaint: 45522, year: 2023, speedEstimation: 120, averageSpeedFined: 135 },
    { autonomousCommunity: "Galicia", province: "Pontevedra", way: "A-55", kilometerPoint: 9.2, complaint: 45276, year: 2023, speedEstimation: 120, averageSpeedFined: 135 },
    { autonomousCommunity: "Balears (Illes)", province: "Balears (Illes)", way: "EI-600", kilometerPoint: 9.6, complaint: 44985, year: 2023, speedEstimation: 90, averageSpeedFined: 105 },
    { autonomousCommunity: "Comunitat Valenciana", province: "Valencia/València", way: "A-7", kilometerPoint: 326.4, complaint: 43269, year: 2023, speedEstimation: 120, averageSpeedFined: 135 },
    { autonomousCommunity: "Canarias", province: "Palmas (Las)", way: "GC-1", kilometerPoint: 42.2, complaint: 38240, year: 2023, speedEstimation: 80, averageSpeedFined: 95 },
    { autonomousCommunity: "Andalucía", province: "Cádiz", way: "A-381", kilometerPoint: 37.3, complaint: 35915, year: 2023, speedEstimation: 120, averageSpeedFined: 135 },
    { autonomousCommunity: "Andalucía", province: "Sevilla", way: "A-92", kilometerPoint: 83.8, complaint: 33849, year: 2023, speedEstimation: 120, averageSpeedFined: 135 },
    { autonomousCommunity: "Madrid (Comunidad de)", province: "Madrid", way: "A-4", kilometerPoint: 12.4, complaint: 25778, year: 2022, speedEstimation: 120, averageSpeedFined: 135 }
  ];

//Imnprimir por pantalla

function log(m){
    console.log(m)
}

// Filtrar por comunidad 
let filtered = myArray.filter((v)=> v.autonomousCommunity === "Andalucía")

//Suma de velocidad media

let sum = filtered.reduce((acc,value) => acc + value.averageSpeedFined,0)

// Media de velocidad en Andalucía 

let average = sum / filtered.length


//log(JSON.stringify(filtered, null, 2))
log(`La media de velocidad en Andalucía es: ${average} km/h`)



  