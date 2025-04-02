import { request } from "express";
import { JAM } from "../../../index-JAM.js";
import dataStore from "nedb";

let db = new dataStore();

const BASE_API="/api/v1";
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
//--------------------------------------------------&&&&&&&&&&&
// API JESUS - registrations-stats

let d = JAM; // Usar datos correctamente

app.delete(BASE_API + "/-stats", (request, response) => {
    console.log("DELETE to /JAM-stats");
    d = []; // Resetear datos
    response.sendStatus(200);
});


app.get(BASE_API+"/registrations-stats/loadInitialData",(request,response)=>{
    if (JAM.length ===0){
        JAM.push(...d) // Los puntos suspensivos sirven para añadirlos de 1 en 1
    }
        
        response.send(JSON.stringify(JAM));
        
    

})
// Obtener todos los registros con filtros (GET con ?year=, ?from=&to=, ?province=)
app.get(BASE_API + "/registrations-stats", (req, res) => {
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
app.get(BASE_API + "/registrations-stats/:province", (req, res) => {
    const provinceParam = req.params.province.toLowerCase();
    const { from, to } = req.query;

    const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

    let filteredData = JAM.filter(d =>
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

    const data = d.filter(x =>
        x.year === year && normalizeProvince(x.province) === normalizeProvince(province)
    );

    if (data.length === 0) {
        return res.status(404).json({ error: "No data found for the given year and province" });
    }
    res.status(200).json(data);
});

// Agregar un nuevo registro
app.post(BASE_API + "/registrations-stats", (req, res) => {
    const newRecord = req.body;
    if (!newRecord.year || !newRecord.province || !newRecord.total_general || !newRecord.total_general_national || !newRecord.total_general_auction || !newRecord.total_general_import) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (d.find(d => d.year === newRecord.year && d.province === newRecord.province && d.total_general_auction===newRecord.total_general_auction)) {
        return res.status(409).json({ error: "Record already exists" }); 
    }
    d.push(newRecord);
    res.status(201).json({ message: "Record added successfully" });
});

app.post(BASE_API + "/registrations-stats/:year",(req,res)=>{    
    
    res.sendStatus(405);
});

// Modificar un registro existente
app.put(BASE_API + "/registrations-stats/:year/:province", (req, res) => {
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
app.put(BASE_API + "/registrations-stats/",(req,res)=>{    
    
    res.sendStatus(405);
});

// Eliminar un registro existente
app.delete(BASE_API + "/registrations-stats/:year/:province", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const index = d.findIndex(d => d.year === year && d.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    d.splice(index, 1);
    res.status(200).json({ message: "Record deleted successfully" });
});


db.find({},(err,registrations)=>{
    if (registrations.length <1){
        db.insert(JAM);
    }
})
function loadBackEnd(app){
    app.get(BASE_API + "/registrations-stats", (request, response) => {
        // console.log("Nuevo GET a /radars-stats");
    
        // const { way, year, from, to } = request.query;
        // console.log("Parámetro recibido:", { way, year, from, to });
    
        // let filteredData = IOM;
    
        // // Filtrar por 'way' si se proporciona
        // if (way) {
        //     filteredData = filteredData.filter(r => r.way && r.way.toLowerCase() === way.toLowerCase());
        // }
    
        // // Filtrar por 'year' si se proporciona
        // if (year) {
        //     filteredData = filteredData.filter(r => r.year === parseInt(year));
        // }
    
        // // Filtrar por rango de años 'from' y 'to' si se proporcionan
        // if (from && to) {
        //     const fromYear = parseInt(from);
        //     const toYear = parseInt(to);
        //     filteredData = filteredData.filter(r => r.year >= fromYear && r.year <= toYear);
        // }
    
        // console.log("Resultados filtrados:", filteredData); 
        // if (filteredData.length === 0) {
        //     return response.status(404).send({ error: `No se encontraron radares en la carretera '${way}'` });
        // }
        // // ✅ Si no hay resultados, devolver un array vacío []
        // return response.json(filteredData);
        console.log("Nuevo GET a bd /registrations-stats");
        db.find({},(err,registrations)=>{
            response.send(JSON.stringify(registrations.map((r)=>{
                delete r._id;
                return r
            }),null,2));
        })
    });
    


    
    //ENDPOINTS
    
    app.get(BASE_API + "/registrations-stats", (req, res) => {
        const { way } = req.query;
        
        console.log("Parámetro recibido:", way); // ✅ Verifica si está llegando el parámetro
    
        if (!way) {
            return res.json(JAM);
        }
    
        const filteredData = JAM.filter(entry => 
            entry.way && entry.way.toLowerCase() === way.toLowerCase()
        );
    
        console.log("Resultados filtrados:", filteredData); // ✅ Verifica qué datos se están filtrando
    
        if (filteredData.length === 0) {
            return res.status(404).send({ error: `No se encontraron radares en la carretera '${way}'` });
        }
    
        res.json(filteredData);
    });
}

export {loadBackEnd};