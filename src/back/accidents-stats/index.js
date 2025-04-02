import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import dataStore from "nedb";

// let db = new dataStore();

// const BASE_API="/api/v1";



const database = new dataStore();

function loadInitialDataVCH(){
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
    ];
    
    return VCH
}

const BASE_API = "/api/v1"

database.insert(VCH, (err, newDocs) => {
    if (err) {
        return res.status(500).send("Error al insertar los datos.");
    }
})

function loadBackendVCH(app){
    
    // APIs de VCH
    app.get(BASE_API + "/accidents-stats/docs", (req, res) => {
        res.redirect("rellenar"); 
    });

    app.get(BASE_API + "/accidents-stats/loadInitialData", (req, res) => {
        database.count({}, (err, count) => {
            if (err) {
                return res.status(500).send("Error al comprobar la base de datos.");
            }

            if (count > 0) {
                return res.status(400).json({ message: "Ya tiene datos" });
            }

            const initialData = loadInitialDataDLC();
            database.insert(initialData, (err, newDocs) => {
                if (err) {
                    return res.status(500).send("Error al insertar los datos.");
                }

                database.find({}, (err, accidents) => {
                    if (err) {
                        return res.status(500).send("Error al recuperar los datos.");
                    }
                    res.send(JSON.stringify(accidents.map((x)=>{
                        delete x._id;
                        return x;
                    }),null,2));
                });
            });
        });
    });

    // GET todos los datos con paginación
app.get(BASE_API + "/accidents-stats", (req, res) => {
    let { accident_id, province, municipality_code, year, from, to, limit, offset } = req.query;

    let query = {};

    if (province) {
        query.province = new RegExp("^" + province + "$", "i");
    }
    if (municipality_code) {
        query.municipality_code = new RegExp("^" + municipality_code + "$", "i");
    }
    if (year) {
        query.year = Number(year);
    }
    if (accident_id) {
        query.accident_id = Number(accident_id);
    }
    if (from || to) {
        query.year = {};
        if (from) query.year.$gte = Number(from);
        if (to) query.year.$lte = Number(to);
    }

    let q = database.find(query);

    // Aplicar paginación si viene por query
    if (offset !== undefined) {
        q = q.skip(Number(offset));
    }
    if (limit !== undefined) {
        q = q.limit(Number(limit));
    }

    q.exec((err, accidents) => {
        if (err) {
            return res.status(500).send("Error al acceder a la base de datos.");
        }

        // Eliminar _id de cada objeto
        const sanitized = accidents.map(({ _id, ...rest }) => rest);

        res.send(JSON.stringify(sanitized));
    });
});


    //POST a todos los datos
    app.post(BASE_API + "/accidents-stats", (req, res) => {
        const { accident_id, province, month,municipality_code,road, year, km, direction_1f, accident_type, total_victims} = req.body;
        // Validar campos obligatorios
        if (
            accident_id === undefined || province === undefined || month === undefined ||
            year === undefined || municipality_code === undefined || road === undefined || km === undefined
            || direction_1f === undefined || accident_type === undefined || total_victims === undefined

        ) {
            return res.sendStatus(400); // Bad Request
        }
        // Comprobar si ya existe un registro con mismo accident_id (puedes añadir year si es clave compuesta)
        database.findOne({ accident_id: accident_id }, (err, existingDoc) => {
            if (err) {
                return res.status(500).send("Error al acceder a la base de datos.");
            }
            if (existingDoc) {
                return res.sendStatus(409); // Conflict
            }
            database.insert(req.body, (err, newDoc) => {
                if (err) {
                    return res.status(500).send("Error al insertar el recurso.");
                }
                res.sendStatus(201); // Created
            });
        });
    });
    

    //FALLO DE PUT a todos los datos
    app.put(BASE_API + "/accidents-stats/",(req,res)=>{    
        
        res.sendStatus(405);
    });

    //DELETE de todos los datos
    app.delete(BASE_API + "/accidents-stats", (req, res) => {
        database.remove({},{multi:true}); 
        console.log("Todos los datos han sido eliminados."); // Para ver en consola
        res.sendStatus(200); 
    });

    //GET de un dato especifico
    app.get(BASE_API + "/accidents-stats/:accident_id", (req, res) => {
        const paramId = Number(req.params.accident_id);
    
        database.findOne({ accident_id: paramId }, (err, accidents) => {
            if (err) {
                return res.status(500).send("Error al acceder a la base de datos.");
            }
            if (!accidents) {
                return res.sendStatus(404);
            }
            // Eliminar la propiedad _id antes de enviar
        const { _id, ...accidentsWithoutId } = accidents;
        res.status(200).json(accidentsWithoutId);
        });
    });

//POST para resetear la base de datos a la version original
app.post(BASE_API + "/accidents-stats/reset", (req, res) => {
    database.remove({}, { multi: true }, (err) => {
        if (err) {
            return res.status(500).send("Error al limpiar la base de datos.");
        }    
        database.insert(VCH, (err) => {
            if (err) {
                return res.status(500).send("Error al restaurar los datos iniciales.");
            }    
            res.status(200).send("Base de datos restaurada.");
        });
    });
});

    //FALLO DE POST de un dato especifico
    app.post(BASE_API + "/accidents-stats/:accident_id",(req,res)=>{    
        
        res.sendStatus(405);
    });

    //PUT de un dato especifico
    app.put(BASE_API + "/accidents-stats/:accident_id", (req, res) => {
        const paramId = Number(req.params.accident_id);
        const updatedData = req.body;

        // Verificar que el accident_id en el body coincida con el de la URL
        if (updatedData.accident_id !== paramId) {
            return res.sendStatus(400); // Bad Request
        }    
        database.update({ accident_id: paramId }, updatedData, {}, (err, numReplaced) => {
            if (err) {
                return res.status(500).send("Error al actualizar el recurso.");
            }
    
            if (numReplaced === 0) {
                return res.sendStatus(404); // No encontrado
            }
    
            res.sendStatus(200); // OK
        });
    });


    //DELETE de un dato especifico
    app.delete(BASE_API + "/accidents-stats/:accident_id", (req, res) => {
        const paramId = Number(req.params.accident_id);
    
        database.remove({ accident_id: paramId }, {}, (err, numRemoved) => {
            if (err) {
                res.status(500).send("Error al eliminar el recurso.");
                console.error(`ERROR: ${err}`)
            }else{
                if (numRemoved === 0) {
                    res.sendStatus(404); // No encontrado
                }else{
                    res.sendStatus(200); // OK
                }               
            }    
            
        });
    });
}

export {loadBackendVCH,VCH,loadInitialDataVCH};

// //--------------------------------------------------&&&&&&&&&&&
// // API VICTOR - accidents-stats

// let d = VCH; // Usar datos correctamente

// app.delete(BASE_API + "/accidents-stats", (request, response) => {
//     console.log("DELETE to /accidents-stats");
//     d = []; // Resetear datos
//     response.sendStatus(200);
// });


// app.get(BASE_API+"/accidents-stats/loadInitialData",(request,response)=>{
//     if (VCH.length ===0){
//         VCH.push(...d) // Los puntos suspensivos sirven para añadirlos de 1 en 1
//     }
        
//         response.send(JSON.stringify(VCH));
        
    

// })
// // Obtener todos los registros con filtros (GET con ?year=, ?from=&to=, ?province=)
// app.get(BASE_API + "/accidents-stats", (req, res) => {
//     let datosFiltrados = d;
//     let { from, to, year, province } = req.query;

//     // Filtrar por rango de años (from y to)
//     if (from !== undefined) {
//         datosFiltrados = datosFiltrados.filter(stat => stat.year >= Number(from));
//     }
//     if (to !== undefined) {
//         datosFiltrados = datosFiltrados.filter(stat => stat.year <= Number(to));
//     }

//     // Filtrar por un año específico
//     if (year !== undefined) {
//         datosFiltrados = datosFiltrados.filter(stat => stat.year === Number(year));
//     }

//     // Filtrar por provincia (sin importar mayúsculas/minúsculas ni espacios)
//     if (province !== undefined) {
//         const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");
//         datosFiltrados = datosFiltrados.filter(stat => normalizeProvince(stat.province) === normalizeProvince(province));
//     }

//     return res.status(200).json(datosFiltrados);
// });

// // Obtener registros por provincia y rango de años
// app.get(BASE_API + "/accidents-stats/:province", (req, res) => {
//     const provinceParam = req.params.province.toLowerCase();
//     const { from, to } = req.query;

//     const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

//     let filteredData = VCH.filter(d =>
//         normalizeProvince(d.province) === normalizeProvince(provinceParam)
//     );

//     if (from !== undefined) {
//         filteredData = filteredData.filter(stat => stat.year >= Number(from));
//     }
//     if (to !== undefined) {
//         filteredData = filteredData.filter(stat => stat.year <= Number(to));
//     }

//     res.status(200).json(filteredData);
// });


// // Obtener registros por año y provincia
// app.get(BASE_API + "/accidents-stats/:year/:province", (req, res) => {
//     const year = parseInt(req.params.year);
//     const province = req.params.province.toLowerCase();

//     const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

//     const data = d.filter(x =>
//         x.year === year && normalizeProvince(x.province) === normalizeProvince(province)
//     );

//     if (data.length === 0) {
//         return res.status(404).json({ error: "No data found for the given year and province" });
//     }
//     res.status(200).json(data);
// });

// // Agregar un nuevo registro
// app.post(BASE_API + "/accidents-stats", (req, res) => {
//     const newRecord = req.body;
//     if (!newRecord.year || !newRecord.province || !newRecord.total_victims || !newRecord.accident_id|| !newRecord.month || !newRecord.weekday|| !newRecord.hour || !newRecord.municipality_code || !newRecord.zone || !newRecord.grouped_zone || !newRecord.road || !newRecord.km || !newRecord.direction_1f || !newRecord.road_ownership || !newRecord.road_type || !newRecord.accident_type) {
//         return res.status(400).json({ error: "Missing required fields" });
//     }
//     if (d.find(d => d.year === newRecord.year && d.province === newRecord.province && d.accident_id===newRecord.accident_id)) {
//         return res.status(409).json({ error: "Record already exists" }); 
//     }
//     d.push(newRecord);
//     res.status(201).json({ message: "Record added successfully" });
// });

// app.post(BASE_API + "/accidents-stats/:year",(req,res)=>{    
    
//     res.sendStatus(405);
// });

// // Modificar un registro existente
// app.put(BASE_API + "/accidents-stats/:year/:province", (req, res) => {
//     const year = parseInt(req.params.year);
//     const province = req.params.province;
//     const index = d.findIndex(d => d.year === year && d.province === province);
//     if (index === -1) return res.status(404).json({ error: "Record not found" });
//     if (req.body.year !== year || req.body.province !== province) {
//         return res.status(400).json({ error: "Year and province in body must match URL parameters" });
//     }
//     d[index] = { ...d[index], ...req.body };
//     res.status(200).json({ message: "Record updated successfully" });
// });
// //FALLO DE PUT a todos los datos
// app.put(BASE_API + "/accidents-stats/",(req,res)=>{    
    
//     res.sendStatus(405);
// });

// // Eliminar un registro existente
// app.delete(BASE_API + "/accidents-stats/:year/:province", (req, res) => {
//     const year = parseInt(req.params.year);
//     const province = req.params.province;
//     const index = d.findIndex(d => d.year === year && d.province === province);
//     if (index === -1) return res.status(404).json({ error: "Record not found" });
//     d.splice(index, 1);
//     res.status(200).json({ message: "Record deleted successfully" });
// });


// db.find({},(err,accidents)=>{
//     if (accidents.length <1){
//         db.insert(VCH);
//     }
// })
// function loadBackEnd(app){
//     app.get(BASE_API + "/accidents-stats", (request, response) => {
//         // console.log("Nuevo GET a /radars-stats");
    
//         // const { way, year, from, to } = request.query;
//         // console.log("Parámetro recibido:", { way, year, from, to });
    
//         // let filteredData = IOM;
    
//         // // Filtrar por 'way' si se proporciona
//         // if (way) {
//         //     filteredData = filteredData.filter(r => r.way && r.way.toLowerCase() === way.toLowerCase());
//         // }
    
//         // // Filtrar por 'year' si se proporciona
//         // if (year) {
//         //     filteredData = filteredData.filter(r => r.year === parseInt(year));
//         // }
    
//         // // Filtrar por rango de años 'from' y 'to' si se proporcionan
//         // if (from && to) {
//         //     const fromYear = parseInt(from);
//         //     const toYear = parseInt(to);
//         //     filteredData = filteredData.filter(r => r.year >= fromYear && r.year <= toYear);
//         // }
    
//         // console.log("Resultados filtrados:", filteredData); 
//         // if (filteredData.length === 0) {
//         //     return response.status(404).send({ error: `No se encontraron radares en la carretera '${way}'` });
//         // }
//         // // ✅ Si no hay resultados, devolver un array vacío []
//         // return response.json(filteredData);
//         console.log("Nuevo GET a bd /accidents-stats");
//         db.find({},(err,accidents)=>{
//             response.send(JSON.stringify(accidents.map((r)=>{
//                 delete r._id;
//                 return r
//             }),null,2));
//         })
//     });
    


    
//     //ENDPOINTS
    
//     app.get(BASE_API + "/accidents-stats", (req, res) => {
//         const { way } = req.query;
        
//         console.log("Parámetro recibido:", way); // ✅ Verifica si está llegando el parámetro
    
//         if (!way) {
//             return res.json(VCH);
//         }
    
//         const filteredData = VCH.filter(entry => 
//             entry.way && entry.way.toLowerCase() === way.toLowerCase()
//         );
    
//         console.log("Resultados filtrados:", filteredData); // ✅ Verifica qué datos se están filtrando
    
//         if (filteredData.length === 0) {
//             return res.status(404).send({ error: `No se encontraron radares en la carretera '${way}'` });
//         }
    
//         res.json(filteredData);
//     });
// }

// export {loadBackEnd};