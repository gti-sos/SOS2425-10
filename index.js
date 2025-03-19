const express = require("express");
const app = express()
const PORT = process.env.PORT || 16079

const IOM = require('./index-IOM')
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
let myNullArray=[]
app.get(BASE_API+"/radars-stats/loadInitialData",(request,response)=>{
    if (myNullArray.length ===0){
        myNullArray.push(...IOM) // Los puntos suspensivos sirven para añadirlos de 1 en 1
    }
        
        response.send(JSON.stringify(myNullArray));
        
    

})

//POST

app.post(BASE_API+"/radars-stats", (request,response)=>{
    console.log("POST to /radars-stats");

    let newRadar= request.body;
    //Verificamos si ya existe un radar en la misma carretera y punto kilometrico
    let exits = IOM.some(radar =>
        radar.way === newRadar.way && radar.kilometerPoint === newRadar.kilometerPoint
    );
    if (exits){
        return response.status(409).send({error: "El radar ya existe"});
    }
    IOM.push(newRadar);
    response.sendStatus(201)
});


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



s



// API Victor Jose Cabrera Hurtado - Accidents Stats
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