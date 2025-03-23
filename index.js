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
        
        response.send(JSON.stringify(IOM));
        
    

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



//-------------------------
// API Jesús Aznar Montero - Registrations Stats
let registrationsData = JAM; // Usar datos correctamente

// Obtener todos los registros con filtros (GET con ?year=, ?from=&to=, ?province=)
app.get(BASE_API + "/registrations-stats", (req, res) => {
    let datosFiltrados = registrationsData;
    let { from, to, year, province } = req.query;

    // Filtrar por rango de años (from y to)
    if (from !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year >= Number(from));
    }
    if (to !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year <= Number(to));
    }

    // Filtrar por un año específico
    if (year !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year === Number(year));
    }

    // Filtrar por provincia (sin importar mayúsculas/minúsculas ni espacios)
    if (province !== undefined) {
        const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");
        datosFiltrados = datosFiltrados.filter(stat => normalizeProvince(stat.province) === normalizeProvince(province));
    }

    return res.status(200).json(datosFiltrados);
});

// Obtener registros por año y provincia
app.get(BASE_API + "/registrations-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province.toLowerCase();

    const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

    const data = registrationsData.filter(d =>
        d.year === year && normalizeProvince(d.province) === normalizeProvince(province)
    );

    if (data.length === 0) {
        return res.status(404).json({ error: "No data found for the given year and province" });
    }
    res.status(200).json(data);
});

// Cargar datos iniciales
app.get(BASE_API + "/registrations-stats/loadInitialData", (req, res) => {
    if (registrationsData.length === 0) {
        registrationsData.push(...JAM.slice(0, 10));
        return res.status(201).json({ message: "Initial data loaded", data: registrationsData });
    }
    res.status(200).json({ message: "Data already initialized", data: registrationsData });
});

// Agregar un nuevo registro
app.post(BASE_API + "/registrations-stats", (req, res) => {
    const newRecord = req.body;
    if (!newRecord.year || !newRecord.province || !newRecord.total_general || !newRecord.total_general_nacional || !newRecord.total_general_auction || !newRecord.total_general_import) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (registrationsData.find(d => d.year === newRecord.year && d.province === newRecord.province)) {
        return res.status(409).json({ error: "Record already exists" });
    }
    registrationsData.push(newRecord);
    res.status(201).json({ message: "Record added successfully" });
});
app.post(BASE_API + "/registrations-stats/:year",(req,res)=>{    
    
    res.sendStatus(405);
});

// Modificar un registro existente
app.put(BASE_API + "/registrations-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const index = registrationsData.findIndex(d => d.year === year && d.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    if (req.body.year !== year || req.body.province !== province) {
        return res.status(400).json({ error: "Year and province in body must match URL parameters" });
    }
    registrationsData[index] = { ...registrationsData[index], ...req.body };
    res.status(200).json({ message: "Record updated successfully" });
});

//FALLO DE PUT a todos los datos
app.put(BASE_API + "/registrations-stats/",(req,res)=>{    
    
    res.sendStatus(405);
});

// Eliminar un registro existente
app.delete(BASE_API + "/registrations-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const index = registrationsData.findIndex(d => d.year === year && d.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    registrationsData.splice(index, 1);
    res.status(200).json({ message: "Record deleted successfully" });
});






//--------------------------------------------------&&&&&&&&&&&
// API VICTOR - accidents-stats

let d = VCH; // Usar datos correctamente

// Obtener todos los registros con filtros (GET con ?year=, ?from=&to=, ?province=)
app.get(BASE_API + "/accidents-stats", (req, res) => {
    let datosFiltrados = d;
    let { from, to, year, province } = req.query;

    // Filtrar por rango de años (from y to)
    if (from !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year >= Number(from));
    }
    if (to !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year <= Number(to));
    }

    // Filtrar por un año específico
    if (year !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year === Number(year));
    }

    // Filtrar por provincia (sin importar mayúsculas/minúsculas ni espacios)
    if (province !== undefined) {
        const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");
        datosFiltrados = datosFiltrados.filter(stat => normalizeProvince(stat.province) === normalizeProvince(province));
    }

    return res.status(200).json(datosFiltrados);
});

// Obtener registros por año y provincia
app.get(BASE_API + "/accidents-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province.toLowerCase();

    const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

    const data = d.filter(x =>
        x.year === year && normalizeProvince(x.province) === normalizeProvince(province)
    );

    if (data.length === 0) {
        return res.status(404).json({ error: "No data found for the given year and province" });
    }
    res.status(200).json(data);
});

// Cargar datos iniciales
app.get(BASE_API + "/accidents-stats/loadInitialData", (req, res) => {
    if (d.length === 0) {
        d.push(...JAM.slice(0, 10));
        return res.status(201).json({ message: "Initial data loaded", data: d });
    }
    res.status(200).json({ message: "Data already initialized", data: d});
});

// Agregar un nuevo registro
app.post(BASE_API + "/accidents-stats", (req, res) => {
    const newRecord = req.body;
    if (!newRecord.year || !newRecord.province || !newRecord.total_victims || !newRecord.accident_id|| !newRecord.month || !newRecord.weekday|| !newRecord.hour || !newRecord.municipality_code || !newRecord.zone || !newRecord.grouped_zone || !newRecord.road || !newRecord.km || !newRecord.direction_1f || !newRecord.road_ownership || !newRecord.road_type || !newRecord.accident_type) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (d.find(d => d.year === newRecord.year && d.province === newRecord.province && d.accident_id===newRecord.accident_id)) {
        return res.status(409).json({ error: "Record already exists" }); 
    }
    d.push(newRecord);
    res.status(201).json({ message: "Record added successfully" });
});

app.post(BASE_API + "/accidents-stats/:year",(req,res)=>{    
    
    res.sendStatus(405);
});

// Modificar un registro existente
app.put(BASE_API + "/accidents-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const index = d.findIndex(d => d.year === year && d.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    if (req.body.year !== year || req.body.province !== province) {
        return res.status(400).json({ error: "Year and province in body must match URL parameters" });
    }
    d[index] = { ...d[index], ...req.body };
    res.status(200).json({ message: "Record updated successfully" });
});
//FALLO DE PUT a todos los datos
app.put(BASE_API + "/accidents-stats/",(req,res)=>{    
    
    res.sendStatus(405);
});

// Eliminar un registro existente
app.delete(BASE_API + "/accidents-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const index = registrationsData.findIndex(d => d.year === year && d.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    registrationsData.splice(index, 1);
    res.status(200).json({ message: "Record deleted successfully" });
});