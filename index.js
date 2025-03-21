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
    if (registrationsData.length === 0) {
        registrationsData.push(...JAM.slice(0, 10));
        return res.status(201).json({ message: "Initial data loaded", data: registrationsData });
    }
    res.status(200).json({ message: "Data already initialized", data: registrationsData });
});

// Obtener registros por año y provincia
app.get(BASE_API + "/registrations-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    let province = req.params.province.toLowerCase(); // Convertir a minúsculas para evitar errores de mayúsculas

    // Normalizar nombres de provincia eliminando barras y espacios
    const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

    const data = registrationsData.filter(d => 
        d.year === year && normalizeProvince(d.province) === normalizeProvince(province)
    );

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




//--------------------------------------------------
// API VICTOR - accidents-stats

// Obtener registros por año y provincia
app.get(BASE_API + "/accidents-stats/:year/:province", (req, res) => {
    let datos=VCH
    const year = parseInt(req.params.year);
    let province = req.params.province.toLowerCase(); // Convertir a minúsculas para evitar errores de mayúsculas

    // Normalizar nombres de provincia eliminando barras y espacios
    const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

    const data = datos.filter(d => 
        d.year === year && normalizeProvince(d.province) === normalizeProvince(province)
    );

    if (data.length === 0) {
        return res.status(404).json({ error: "No data found for the given year and province" });
    }
    res.status(200).json(data);
});

//-----
app.get(BASE_API + "/accidents-stats", (req, res) => {
    let datosFiltrados = VCH;
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

    if (!datosFiltradosx) {
        return res.sendStatus(404);
    }
    // Enviar la encontrada
    res.send(JSON.stringify(a,null,2))
    res.status(200);
});



// Agregar un nuevo registro
app.post(BASE_API + "/accidents-stats", (req, res) => {
    const newRecord = req.body;
    if (!newRecord.year || !newRecord.province || !newRecord.total_victims) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (datos.find(d => d.year === newRecord.year && d.province === newRecord.province)) {
        return res.status(409).json({ error: "Record already exists" });
    }
    datos.push(newRecord);
    res.status(201).json({ message: "Record added successfully" });
});

// Modificar un registro existente
app.put(BASE_API + "/accidents-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const index = datos.findIndex(d => d.year === year && d.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    if (req.body.year !== year || req.body.province !== province) {
        return res.status(400).json({ error: "Year and province in body must match URL parameters" });
    }
    datos[index] = { ...datos[index], ...req.body };
    res.status(200).json({ message: "Record updated successfully" });
});

// Eliminar un registro existente
app.delete(BASE_API + "/accidents-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const index = datos.findIndex(d => d.year === year && d.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    datos.splice(index, 1);
    res.status(200).json({ message: "Record deleted successfully" });
});

//---------

// VCH datos accident-stats
app.get(BASE_API + "/accidents-stats/loadInitialData", (req, res) => {
    const result = VCH;
    datos = result;
    res.send(JSON.stringify(datos));
});


//GET todos los datos
app.get(BASE_API + "/accidents-stats", (req, res) => {
    let datos1= VCH
    let datos=VCH
    let {accident_id,year,month,weekday,hour,province,municipality,zone,grouped_zone,road,km,direction_1f,road_ownership,road_type,accident_type,total_victims} = req.query
    if (province!==undefined){
        datos1=datos1
            .filter(stat=>stat.province.toLowerCase()=== province.toLowerCase())
    }
    if (municipality!==undefined){
        datos1=datos1
            .filter(stat=>stat.municipality.toLowerCase()=== municipality.toLowerCase())
    }
    if (year!==undefined){
        datos1=datos1
            .filter(stat=>stat.year=== Number(year))
    }
    if (total_victims!==undefined){
        datos1=datos1
        .filter(stat=>stat.total_victims=== Number(total_victims))
        if(datos.length ===1){
            datos1 = datos[0]            
        }
    } 
    res.send(JSON.stringify(datos1,null,2));
    res.send(console.log(Array.isArray(datos))); // Comprueba si es de verdad un array
    (console.log(typeof(datos))); // Comprueba si es de verdad un objeto
});

app.get(BASE_API + "/accidents-stats", (req, res) => {
    let datos1= VCH
    let datos=VCH
    let {accident_id,year,month,weekday,hour,province,municipality,zone,grouped_zone,road,km,direction_1f,road_ownership,road_type,accident_type,total_victims} = req.query
     
    if (from!==undefined){
        datos1=datos1
            .filter(stat=>stat.year>= Number(from))
    }
    if (to!==undefined){
        datos1=datos1
            .filter(stat=>stat.year<= Number(to))
    }
    res.send(JSON.stringify(datos1,null,2));
    res.send(console.log(Array.isArray(datos))); // Comprueba si es de verdad un array
    (console.log(typeof(datos))); // Comprueba si es de verdad un objeto
});
//POST a todos los datos
app.post(BASE_API + "/accidents-stats/",(req,res)=>{ 
    let datos=VCH  
    let {accident_id,year,month,weekday,hour,province,municipality,zone,grouped_zone,road,km,direction_1f,road_ownership,road_type,accident_type,total_victims} = req.body
    if (accident_id === undefined || province === undefined || municipality === undefined || 
        year === undefined || month === undefined || total_victims === undefined) {
        return res.sendStatus(400);
    }
    
    if(datos.some(a=>a.province===province)){
        return res.sendStatus(409);
        }
    let b = req.body
    datos.push(b)
    res.sendStatus(201);
    
});

//FALLO DE PUT a todos los datos
app.put(BASE_API + "/accidents-stats/",(req,res)=>{    
    
    res.sendStatus(405);
});

//DELETE de todos los datos
app.delete(BASE_API + "/accidents-stats", (req, res) => {
    datos = []; // Vaciar el array
    console.log("Todos los datos han sido eliminados."); // Para ver en consola
    res.sendStatus(204); // 204 No Content (indica que se procesó, pero sin respuesta)
});


//GET de un dato especifico
app.get(BASE_API + "/accidents-stats/:province", (req, res) => {
    let paramprovince = Number(req.params.province); // Convertir a número
    // Buscar el objeto por provincia

    let a = datos.find(a => a.province === paramprovince);
    // Si no se encuentra, devolver 404
    if (!a) {
        return res.sendStatus(404);
    }
    // Enviar la sanción encontrada
    res.send(JSON.stringify(a,null,2))
    res.status(200);
});

//FALLO DE POST de un dato especifico
app.post(BASE_API + "/accidents-stats/:province",(req,res)=>{    
    
    res.sendStatus(405);
});

//PUT de un dato especifico
app.put(BASE_API + "/accidents-stats/:province", (req, res) => {
    let {accident_id,year,month,weekday,hour,province,municipality,zone,grouped_zone,road,km,direction_1f,road_ownership,road_type,accident_type,total_victims} = req.body;
    let paramProvince = req.params.province;    
    // Verificar si el ID de la URL coincide con el del cuerpo
    if (province !== Number(paramProvince)) {
        return res.sendStatus(400);
    }    
    // Comprobar si el recurso existe
    let index = datos.findIndex(a => a.province === Number(paramProvince));
    if (index === -1) {
        return res.sendStatus(404);
    }    
    // Actualizar el recurso
    datos[index] = req.body;
    res.sendStatus(200);
});

//DELETE de un dato especifico
app.delete(BASE_API + "/accidents-stats/:province", (req, res) => {
    let paramProvince = req.params.province;    
    
    // Comprobar si el recurso existe
    let index = datos.findIndex(a => a.province === Number(paramProvince));
    if (index === -1) {
        return res.sendStatus(404);
    }    
    // Actualizar el recurso
    datos=datos.filter(a => a.province !== Number(paramProvince));
    res.sendStatus(200);
});

