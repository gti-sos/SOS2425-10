import { request } from "express";
import { IOM } from "../../../index-IOM.js";
import dataStore from "nedb";

let db = new dataStore();

const BASE_API="/api/v1";
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
db.find({},(err,radars)=>{
    if (radars.length <1){
        db.insert(myArray);
    }
})
function loadBackEnd(app){
    app.get(BASE_API + "/radars-stats", (request, response) => {
        console.log("Nuevo GET a bd /radars-stats");
    
        const { way, year, from, to } = request.query;
        // Definir paginación
        const page = parseInt(request.query.page) || 1;    // Página actual (por defecto 1)
        const limit = parseInt(request.query.limit) || 10; // Número de elementos por página (por defecto 10)
    
        console.log("Parámetros recibidos:", { way, year, from, to, page, limit });
    
        let query = {};
    
        // Filtrar por 'way' si se proporciona
        if (way) {
            query.way = way;
        }
    
        // Filtrar por 'year' si se proporciona
        if (year) {
            query.year = year;
        }
    
        // Filtrar por rango de años 'from' y 'to' si se proporcionan
        if (from && to) {
            query.year = { $gte: parseInt(from), $lte: parseInt(to) };
        }
    
        // Calcular cuántos documentos saltar según la página actual
        const skip = (page - 1) * limit;
    
        db.find(query)
            .skip(skip) // Saltar los primeros 'skip' documentos
            .limit(limit) // Limitar la cantidad de resultados
            .exec((err, radars) => {
                if (err) {
                    console.error("Error al buscar en la BD:", err);
                    return response.status(500).json({ error: "Error interno del servidor" });
                }
    
                const filteredRadars = radars.map(r => {
                    delete r._id;
                    return r;
                });
    
                console.log("Resultados filtrados:", filteredRadars);
    
                return response.json(filteredRadars);
            });
    });
    
    
    app.get(BASE_API+"/radars-stats/docs",(request,response)=>{
        response.redirect("https://documenter.getpostman.com/view/42127435/2sB2cSfNow");

    })
    
    
    app.get(BASE_API+"/radars-stats/loadInitialData",(request,response)=>{
        if (IOM.length ===0){
            IOM.push(...myArray) // Los puntos suspensivos sirven para añadirlos de 1 en 1
        }
            
            response.send(JSON.stringify(IOM));
            
        
    
    })
    
    //POST
    
    app.post(BASE_API+"/radars-stats", (request,response)=>{
        
        // //Verificamos si ya existe un radar en la misma carretera y punto kilometrico
        // let exists = IOM.some(radar =>
        //     radar.way === newRadar.way && radar.kilometerPoint === newRadar.kilometerPoint
        // );
        // if (exists){
        //     return response.status(409).send({error: "El radar ya existe"});
        // }
        // IOM.push(newRadar);
        // response.sendStatus(201)
        console.log("POST to bd /radars-stats");
        let newRadar= request.body;
        if (!newRadar.year || !newRadar.province || !newRadar.way || !newRadar.kilometerPoint || !newRadar.complaint || !newRadar.autonomousCommunity || !newRadar.speedEstimation || !newRadar.averageSpeedFined) {
            return response.status(400).json({ error: "Missing required fields" });
        }
        db.insert(newRadar);
        response.sendStatus(201);
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
    app.get(BASE_API + "/radars-stats/:way/:kilometerPoint", (request, response) => {
        let { way, kilometerPoint } = request.params;  // Obtener carretera y punto kilométrico de la URL
        let { from, to } = request.query; // Obtener parámetros opcionales 'from' y 'to'

        let query = { way: way, kilometerPoint: parseFloat(kilometerPoint) }; // Construcción de consulta base

        // Si 'from' y 'to' están presentes, agregamos filtro de año
        if (from && to) {
            if (isNaN(from) || isNaN(to)) {
                return response.status(400).json({ error: "Los parámetros 'from' y 'to' deben ser números válidos." });
            }
            query.year = { $gte: parseInt(from), $lte: parseInt(to) };
        }

        // Buscar en la base de datos con los filtros
        db.findOne({ way: way, kilometerPoint: parseFloat(kilometerPoint) }, (err, radar) => {
            if (err) {
                console.error("Error al buscar en la BD:", err);
                return response.status(500).json({ error: "Error interno del servidor" });
            }
    
            if (!radar) {
                return response.status(404).json({ error: `No se encontró el radar en la carretera '${way}' en el punto kilométrico ${kilometerPoint}.` });
            }
    
            delete radar._id; // Eliminar `_id` para mayor claridad
            response.json(radar); // Devolver un solo objeto {}
        });
        });
    
    //PUT
    
    app.put(BASE_API+"/radars-stats/:way/:kilometerPoint",(request,response)=>{
        let way = request.params.way;
        let km = parseFloat(request.params.kilometerPoint);
        let change = request.body;
        if (change.way !== way || parseFloat(change.kilometerPoint) !== km) {
            return response.status(400).send({ error: "El ID en el cuerpo no coincide con el de la URL" });
        }
        // let index = IOM.findIndex(r=> r.way ===way && km === r.kilometerPoint );
        // console.log(index);
        // if (index===-1){
        //     response.sendStatus(404);
        // }
        // else {
        //     IOM[index]={...IOM[index], ... change};
        //     response.send(JSON.stringify(IOM[index]))
        // }
        db.update({way: way, kilometerPoint: km},{$set:change},{},(err,numUpdated)=>{
            if (err){
                console.error("Error al actualizar en la base de datos:", err);
                return response.status(500).json({error: "Error interno del servidor "});
            } 
            if (numUpdated===0){
                return response.status(404).json({error: "No se encontro el radar especificado"})
            }
            db.findOne({way:way, kilometerPoint:km},(err,updatedRadar)=>{
                if (err || !updatedRadar) {
                    return response.status(500).json({ error: "Error al recuperar el radar actualizado" });
                }

                delete updatedRadar._id; // Eliminar `_id` para mayor claridad
                response.json(updatedRadar);
            });
            
        });
        
    
    });
    
    //DELETE 
    app.delete(BASE_API+"/radars-stats/:way/:kilometerPoint",(request,response)=>{
        // let way = request.params.way;
        // let km = parseFloat(request.params.kilometerPoint);
        // let exists = IOM.some(r => r.way===way && r.kilometerPoint === km); 
        // if (!exists){
        //     response.sendStatus(404);
        // }
        // else{
        //     IOM = IOM.filter(r => !(r.way === way && r.kilometerPoint === km));
    
        //     response.send(JSON.stringify(IOM));
        // }
        let way = request.params.way;
        let km = parseFloat(request.params.kilometerPoint);
        db.remove({"way": way, "kilometerPoint": km},{},(err,numRemoved)=>{
            if(err){
                response.status(500).send("Error code 01");
            }else{
                if(numRemoved>=1){
                    response.sendStatus(200);
                }else{
                    response.sendStatus(404);
                }
            }
        });
        
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
}

export {loadBackEnd};