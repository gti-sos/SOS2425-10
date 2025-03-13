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
    IOM.push(newRadar);
    response.sendStatus(201)
});


// API Jesús Aznar Montero - Registrations Stats
let registrationsData = JAM; // Usar datos correctamente

// Obtener todos los registros
app.get(BASE_API + "/registrations-stats", (req, res) => {
    res.status(200).json(registrationsData);
});

// Cargar datos iniciales
app.get(BASE_API + "/registrations-stats/loadInitialData", (req, res) => {
    console.log("Intentando cargar datos iniciales...");

    if (registrationsData.length === 0) {
        console.log("El array está vacío. Cargando datos...");
        registrationsData.push(...registrationsData.slice(0, 10));
        return res.status(201).json({ message: "Initial data loaded", data: registrationsData });
    }

    console.log("Ya había datos cargados.");
    res.status(200).json({ message: "Data already initialized", data: registrationsData });
});


// Obtener registros por año y provincia
app.get(BASE_API + "/registrations-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    let province = req.params.  province.toLowerCase().trim(); // Normalizamos el parámetro de la URL

    console.log("Provincia recibida en la URL:", province); // Muestra el valor recibido

    // Normalizar nombres de provincia eliminando espacios y barras
    const normalizeProvince = (p) => p.toLowerCase().trim().replace(/\s/g, "").replace(/\//g, "");

    const data = registrationsData.filter(d => {
        console.log("Comparando con:", normalizeProvince(d.province)); // Muestra qué valores tiene en los datos
        return d.year === year && normalizeProvince(d.province) === normalizeProvince(province);
    });

    if (data.length === 0) {
        return res.status(404).json({ error: "No data found for the given year and province" });
    }
    
    res.status(200).json(data);
});

// Agregar un nuevo registro
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

// Eliminar un registro existente
app.delete(BASE_API + "/registrations-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const index = registrationsData.findIndex(d => d.year === year && d.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    registrationsData.splice(index, 1);
    res.status(200).json({ message: "Record deleted successfully" });
});