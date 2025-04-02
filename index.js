import { loadBackEnd } from "./src/back/radars-stats/index.js";

import express  from "express";
const app = express()
const PORT = process.env.PORT || 16079

import {IOM}  from "./index-IOM.js";
import {JAM}  from "./index-JAM.js";
import {VCH}  from "./index-VCH.js";

import dataStore from "nedb";

// const JAM = require('./index-JAM')
// const VCH = require('./index-VCH')

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
loadBackEnd(app);
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

app.get(BASE_API + "/radars-stats", (request, response) => {
    console.log("Nuevo GET a /radars-stats");

    const { way, year, from, to } = request.query;
    console.log("Parámetro recibido:", { way, year, from, to });

    let filteredData = IOM;

    // Filtrar por 'way' si se proporciona
    if (way) {
        filteredData = filteredData.filter(r => r.way && r.way.toLowerCase() === way.toLowerCase());
    }

    // Filtrar por 'year' si se proporciona
    if (year) {
        filteredData = filteredData.filter(r => r.year === parseInt(year));
    }

    // Filtrar por rango de años 'from' y 'to' si se proporcionan
    if (from && to) {
        const fromYear = parseInt(from);
        const toYear = parseInt(to);
        filteredData = filteredData.filter(r => r.year >= fromYear && r.year <= toYear);
    }

    console.log("Resultados filtrados:", filteredData); 
    if (filteredData.length === 0) {
        return response.status(404).send({ error: `No se encontraron radares en la carretera '${way}'` });
    }
    // ✅ Si no hay resultados, devolver un array vacío []
    return response.json(filteredData);
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
    if (!newRadar.year || !newRadar.province || !newRadar.way || !newRadar.kilometerPoint || !newRadar.complaint || !newRadar.autonomousCommunity || !newRadar.speedEstimation || !newRadar.averageSpeedFined) {
        return response.status(400).json({ error: "Missing required fields" });
    }
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

// //GET
// app.get(BASE_API+"/radars-stats/:way",(request,response)=>{
//     let way = request.params.way;
//     let exists = IOM.some(r => r.way===way);
//     if (!exists){
//         response.sendStatus(404);
//     }
//     response.send(JSON.stringify(IOM.filter(r=>r.way=== way)))
    
// })
app.get(BASE_API + "/radars-stats/:way", (request, response) => {
    let way = request.params.way;  // Obtener la carretera desde la URL
    const { from, to } = request.query; // Obtener los parámetros de consulta 'from' y 'to'

    // Verificar si la carretera existe en los datos
    let exists = IOM.some(r => r.way === way);
    if (!exists) {
        return response.sendStatus(404); // Si no existe la carretera, devolver 404
    }

    // Filtrar los datos por la carretera
    let filteredData = IOM.filter(r => r.way === way);

    // Si 'from' y 'to' están presentes, filtrar también por el año
    if (from && to) {
        if (isNaN(from) || isNaN(to)) {
            return response.status(400).send({ error: "Los parámetros 'from' y 'to' deben ser números válidos." });
        }

        filteredData = filteredData.filter(r => r.year >= parseInt(from) && r.year <= parseInt(to));
    }

    // Si no se encuentran datos después del filtrado, devolver un mensaje de error
    if (filteredData.length === 0) {
        return response.status(404).send({ error: `No se encontraron radares en la carretera '${way}' para el rango de años ${from} a ${to}.` });
    }

    // Devolver los datos filtrados
    response.json(filteredData);
});

//PUT

app.put(BASE_API+"/radars-stats/:way/:kilometerPoint",(request,response)=>{
    let way = request.params.way;
    let km = parseFloat(request.params.kilometerPoint);




    let change = request.body;
    if (change.way !== way || parseFloat(change.kilometerPoint) !== km) {
        return response.status(400).send({ error: "El ID en el cuerpo no coincide con el de la URL" });
    }
    let index = IOM.findIndex(r=> r.way ===way && km === r.kilometerPoint );
    console.log(index);
    if (index===-1){
        response.sendStatus(404);
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


//ENDPOINTS

app.get(BASE_API + "/radars-stats", (req, res) => {
    const { way } = req.query;
    
    console.log("Parámetro recibido:", way); // ✅ Verifica si está llegando el parámetro

    if (!way) {
        return res.json(IOM);
    }

    const filteredData = IOM.filter(entry => 
        entry.way && entry.way.toLowerCase() === way.toLowerCase()
    );

    console.log("Resultados filtrados:", filteredData); // ✅ Verifica qué datos se están filtrando

    if (filteredData.length === 0) {
        return res.status(404).send({ error: `No se encontraron radares en la carretera '${way}'` });
    }

    res.json(filteredData);
});







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

// Obtener registros por provincia y rango de años
app.get(BASE_API + "/registrations-stats/:province", (req, res) => {
    const provinceParam = req.params.province.toLowerCase();
    const { from, to } = req.query;

    const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

    let filteredData = registrationsData.filter(d =>
        normalizeProvince(d.province) === normalizeProvince(provinceParam)
    );

    if (from !== undefined) {
        filteredData = filteredData.filter(stat => stat.year >= Number(from));
    }
    if (to !== undefined) {
        filteredData = filteredData.filter(stat => stat.year <= Number(to));
    }

    res.status(200).json(filteredData);
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
    if (!newRecord.year || !newRecord.province || !newRecord.total_general || !newRecord.total_general_national || !newRecord.total_general_auction || !newRecord.total_general_import) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (registrationsData.find(d => d.year === newRecord.year && d.province === newRecord.province && d.total_general_auction===newRecord.total_general_auction)) {
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
//DELETE

app.delete(BASE_API + "/registrations-stats", (request, response) => {
    console.log("DELETE to /registrations-stats");
    registrationsData = []; // Resetear datos
    response.sendStatus(200);
});





//--------------------------------------------------&&&&&&&&&&&
// API VICTOR - accidents-stats

let d = VCH; // Usar datos correctamente

app.delete(BASE_API + "/accidents-stats", (request, response) => {
    console.log("DELETE to /accidents-stats");
    d = []; // Resetear datos
    response.sendStatus(200);
});


app.get(BASE_API+"/accidents-stats/loadInitialData",(request,response)=>{
    if (VCH.length ===0){
        VCH.push(...d) // Los puntos suspensivos sirven para añadirlos de 1 en 1
    }
        
        response.send(JSON.stringify(VCH));
        
    

})
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

// Obtener registros por provincia y rango de años
app.get(BASE_API + "/accidents-stats/:province", (req, res) => {
    const provinceParam = req.params.province.toLowerCase();
    const { from, to } = req.query;

    const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

    let filteredData = VCH.filter(d =>
        normalizeProvince(d.province) === normalizeProvince(provinceParam)
    );

    if (from !== undefined) {
        filteredData = filteredData.filter(stat => stat.year >= Number(from));
    }
    if (to !== undefined) {
        filteredData = filteredData.filter(stat => stat.year <= Number(to));
    }

    res.status(200).json(filteredData);
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
/*
// Cargar datos iniciales
app.get(BASE_API + "/accidents-stats/loadInitialData", (req, res) => {
    if (d.length === 0) {
        d.push(...VCH.slice(0, 10));
        return res.status(201).json({ message: "Initial data loaded", data: d });
    }
    res.status(200).json({ message: "Data already initialized", data: d});
});*/

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





app.put(BASE_API+"/accidents-stats/:year/:province",(request,response)=>{
    let year = request.params.year;
    let province = request.params.province;




    let change = request.body;
    if (change.year !== year || change.province !== province) {
        return response.status(400).send({ error: "El ID en el cuerpo no coincide con el de la URL" });
    }
    let index = VCH.findIndex(r=> r.year ===year && province === r.province );
    console.log(index);
    if (index===-1){
        response.sendStatus(404);
    }
    else {
        VCH[index]={...VCH[index], ... change};
        response.send(JSON.stringify(VCH[index]))
    }
    

})



// Eliminar un registro existente
app.delete(BASE_API + "/accidents-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const index = d.findIndex(d => d.year === year && d.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    d.splice(index, 1);
    res.status(200).json({ message: "Record deleted successfully" });
});
