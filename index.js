const express = require("express");
const app = express()
const PORT = process.env.PORT || 16079

let IOM = require('./index-IOM')
const JAM = require('./index-JAM')
const VCH = require('./index-VCH')

const BASE_API="/api/v1";

app.use("/about",express.static("./public"));
app.use(express.json());
app.get("/",(request,response)=>{
    response.send(`Servidor del <a href="/about">grupo 10</a><br>
        <a href="/cool">Cool</a><br>
        <a href="/samples/IOM">IOM</a><br>
        <a href="/samples/JAM">JAM</a><br>
        <a href="/samples/VCH">VCH</a><br>
        `)
})


app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})

//Ignacio Ortiz Moreno

// Filtrar por comunidad 
let filtered = IOM.filter((v)=> v.autonomousCommunity === "Andalucía")

//Suma de velocidad media

let sum = filtered.reduce((acc,value) => acc + value.averageSpeedFined,0)

// Media de velocidad en Andalucía 

let average = sum / filtered.length

app.get('/samples/IOM', (request,response)=> {
    response.send(`La media de velocidad en Andalucía es: ${average} km/h <br>
        <a href="/">Volver atrás</a>`)
})

//Jesús Aznar Montero
app.get("/samples/JAM", (request, response) => {
    const provinciaSeleccionada = "Alicante/Alacant";
    const datosProvincia = datos.filter(d => d.province === provinciaSeleccionada);
    const media = datosProvincia.reduce((acc, d) => acc + d.total_general, 0) / datosProvincia.length;

    response.send(`La media de 'total_general' para la provincia de ${provinciaSeleccionada} es: ${media.toFixed(2)}<br>
        <a href="/">Volver atrás</a>`);
});


//Victor Cabrera Hurtado

//Media de fallecidos en accidentes ocurridos en Albacete

/*
app.get('/samples/VCH', (request,response)=> {
    const albaceteAccidents = myData.filter(accident => accident.province === "Albacete");
    const totalVictims = albaceteAccidents.reduce((sum, accident) => sum + accident.total_victims, 0);
    const averageVictims = albaceteAccidents.length > 0 ? totalVictims / albaceteAccidents.length : 0;
    response.json(`La media de fallecidos en accidentes ocurridos en Albacete es: ${averageVictims}<br>
        <a href="/">Volver atrás</a>`);
}) 
*/


app.get("/samples/VCH", (req, res) => {
    const ciudadFiltrada = "Albacete";
    const datosFiltrados = VCH.filter(dato => dato.province === ciudadFiltrada);
    const media = datosFiltrados.reduce((acc, curr) => acc + (curr.total_victims || 0), 0) / datosFiltrados.length;
    
    res.send(`La media de fallecidos en accidentes ocurridos en ${ciudadFiltrada} es: ${media.toFixed(2)}<br>
    <a href="/">Volver atrás</a>`);
});

//API v1 IOM

app.get(BASE_API+"/radars-stats", (request,response)=>{
    console.log("New GET to /radars-stats");
    response.send(JSON.stringify(IOM))
});
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
app.get(BASE_API+"/radars-stats/loadInitialData",(request,response)=>{
    if (IOM.length ===0){
        IOM.push(...myArray) // Los puntos suspensivos sirven para añadirlos de 1 en 1
    }
        
        response.send(JSON.stringify(myNullArray));
        
    

})

//POST

app.post(BASE_API+"/radars-stats", (request,response)=>{
    console.log("POST to /radars-stats");

    let newRadar= request.body;
    //Verificamos si ya existe un radar en la misma carretera y punto kilometrico
    let exists = IOM.some(radar =>
        radar.way === newRadar.way && radar.kilometerPoint === newRadar.kilometerPoint
    );
    if (exists){
        return response.status(409).send({error: "El radar ya existe"});
    }
    IOM.push(newRadar);
    response.sendStatus(201)
});

//DELETE

app.delete(BASE_API + "/radars-stats", (request, response) => {
    console.log("DELETE to /radars-stats");
    IOM = []; // Resetear datos
    response.sendStatus(200);
});
// PUT

app.put(BASE_API+"/radars-stats",(request,response)=>{
    console.log("PUT to radars-stats");
    response.sendStatus(405);
})

//Recursos Concretos

//GET
app.get(BASE_API+"/radars-stats/:way",(request,response)=>{
    let way = request.params.way;
    let exists = IOM.some(r => r.way===way);
    if (!exists){
        response.sendStatus(404);
    }
    response.send(JSON.stringify(IOM.filter(r=>r.way=== way)))
    
})

//PUT

app.put(BASE_API+"/radars-stats/:way/:kilometerPoint",(request,response)=>{
    let way = request.params.way;
    let km = parseFloat(request.params.kilometerPoint);




    let change = request.body;
    let index = IOM.findIndex(r=> r.way ===way && km === r.kilometerPoint );
    console.log(index);
    if (index===-1){
        response.sendStatus(404);
    }
    else if(change.way){

    }
    else {
        IOM[index]={...IOM[index], ... change};
        response.send(JSON.stringify(IOM[index]))
    }
    

})

//DELETE 
app.delete(BASE_API+"/radars-stats/:way/:kilometerPoint",(request,response)=>{
    let way = request.params.way;
    let km = parseFloat(request.params.kilometerPoint);
    let exists = IOM.some(r => r.way===way && r.kilometerPoint === km); 
    if (!exists){
        response.sendStatus(404);
    }
    else{
        IOM = IOM.filter(r => !(r.way === way && r.kilometerPoint === km));

        response.send(JSON.stringify(IOM));
    }
})

//POST

app.post(BASE_API+"/radars-stats/:way/",(request,response)=>{
    console.log("POST to radars-stats/way");
    response.sendStatus(405);
})

// API Jesús Aznar Montero - Registrations Stats
let registrationsData = JAM; // Usar datos correctamente

// Obtener todas las estadísticas con filtros opcionales
app.get(BASE_API + "/registrations-stats", (req, res) => {
    let filteredData = registrationsData;

    if (req.query.province) {
        const provinceQuery = req.query.province.toLowerCase().trim();

        // Filtrar datos normalizando la provincia
        filteredData = filteredData.filter(d => 
            d.province.toLowerCase().trim() === provinceQuery
        );
    }

    if (req.query.year) {
        const year = parseInt(req.query.year);
        filteredData = filteredData.filter(d => d.year === year);
    }

    if (req.query.from && req.query.to) {
        const fromYear = parseInt(req.query.from);
        const toYear = parseInt(req.query.to);
        filteredData = filteredData.filter(d => d.year >= fromYear && d.year <= toYear);
    }

    res.status(200).json(filteredData);
});

// Cargar datos iniciales
app.get(BASE_API + "/registrations-stats/loadInitialData", (req, res) => {
    console.log("Intentando cargar datos iniciales...");

    if (registrationsData.length === 0) {
        console.log("El array está vacío. Cargando datos...");
        registrationsData.push(...JAM.slice(0, 10));
        console.log("✅ Datos después de la carga:", registrationsData);
        return res.status(201).json({ message: "Initial data loaded", data: registrationsData });
    }

    console.log("✅ Ya había datos cargados.");
    res.status(200).json({ message: "Data already initialized", data: registrationsData });
});

// Agregar una nueva estadística
app.post(BASE_API + "/registrations-stats", (req, res) => {
    const newRecord = req.body;
    if (!newRecord.year || !newRecord.province || !newRecord.total_general) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (registrationsData.find(d => d.year === newRecord.year && d.province === newRecord.province)) {
        return res.status(409).json({ error: "Record already exists" });
    }
    registrationsData.push(newRecord);
    res.status(201).json({ message: "Record added successfully" });
});

// Modificar una estadística existente
app.put(BASE_API + "/registrations-stats", (req, res) => {
    const { year, province, total_general } = req.body;
    if (!year || !province || total_general === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    const index = registrationsData.findIndex(d => d.year === year && d.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    
    registrationsData[index] = { ...registrationsData[index], total_general };
    res.status(200).json({ message: "Record updated successfully" });
});

// Eliminar una estadística existente
app.delete(BASE_API + "/registrations-stats", (req, res) => {
    const { year, province } = req.query;
    if (!year || !province) {
        return res.status(400).json({ error: "Missing required parameters" });
    }
    
    const index = registrationsData.findIndex(d => d.year == year && d.province.toLowerCase() === province.toLowerCase());
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    
    registrationsData.splice(index, 1);
    res.status(200).json({ message: "Record deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});