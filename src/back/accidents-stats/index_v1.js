
import dataStore from "nedb";

const database = new dataStore();
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
function loadInitialDataVCHv1(){
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

export function loadBackendVCH_v1(app){
    
    // APIs de VCH
    app.get(BASE_API + "/accidents-stats/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/42339863/2sB2cSgPL5"); 
    });

    app.get(BASE_API + "/accidents-stats/loadInitialData", (req, res) => {
        database.count({}, (err, count) => {
            if (err) {
                return res.status(500).send("Error al comprobar la base de datos.");
            }

            if (count > 0) {
                return res.status(400).json({ message: "Ya tiene datos" });
            }

            const initialData = loadInitialDataVCH();
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

    // GET todos los datos con paginacion
app.get(BASE_API + "/accidents-stats", (req, res) => {
    let { accident_id, month, province, municipality_code, year, road,km, direction_1f,accident_type,total_victims, from, to, limit, offset } = req.query;

    let query = {};

    if (province) {
        query.province = new RegExp("^" + province + "$", "i");
    }
    if (road) {
        query.road = new RegExp("^" + road + "$", "i");
    }
    if (municipality_code) {
        query.municipality_code = new RegExp("^" + municipality_code + "$", "i");
    }
    if (km) {
        query.km = Number(km);
    }
    if (year) {
        query.year = Number(year);
    }
    if (month) {
        query.month = Number(month);
    }
    if (direction_1f) {
        query.direction_1f = Number(direction_1f);
    }
    if (total_victims) {
        query.total_victims = Number(total_victims);
    }
    if (accident_type) {
        query.accident_type = Number(accident_type);
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
        const paramAccident_id = Number(req.params.accident_id);
    
        database.remove({ accident_id: paramAccident_id }, {}, (err, numRemoved) => {
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
    app.get(BASE_API + "/accidents-stats/:province/:year", (req, res) => {
        const year = Number(req.params.year);
        const province = req.params.province;
    
        database.find({ 
            year: year, 
            province: new RegExp("^" + province + "$", "i") 
        }, (err, docs) => {
            if (err) return res.status(500).send("Error al acceder a la base de datos.");
            if (!docs || docs.length === 0) return res.sendStatus(404);
    
            const sanitized = docs.map(({ _id, ...rest }) => rest);
            res.status(200).json(sanitized);
        });
    });
    app.put(BASE_API + "/accidents-stats/:province/:year", (req, res) => {
        const year = Number(req.params.year);
        const province = req.params.province;
        const updatedData = req.body;
    
        if (updatedData.year !== year || updatedData.province !== province) {
            return res.status(400).json({ error: "Year and province in body must match URL parameters." });
        }
    
        database.update(
            { year: year, province: new RegExp("^" + province + "$", "i") },
            { $set: updatedData },
            { multi: true },
            (err, numReplaced) => {
                if (err) return res.status(500).send("Error al actualizar.");
                if (numReplaced === 0) return res.sendStatus(404);
                res.status(200).json({ message: "Updated successfully", modified: numReplaced });
            }
        );
    });
    app.delete(BASE_API + "/accidents-stats/:province/:year", (req, res) => {
        const year = Number(req.params.year);
        const province = req.params.province;
    
        database.remove(
            { year: year, province: new RegExp("^" + province + "$", "i") },
            { multi: true },
            (err, numRemoved) => {
                if (err) return res.status(500).send("Error al eliminar el recurso.");
                if (numRemoved === 0) return res.sendStatus(404);
                res.status(200).json({ message: "Deleted successfully", removed: numRemoved });
            }
        );
    });
    
}

export {VCH,loadInitialDataVCHv1};
