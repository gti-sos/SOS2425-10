
import dataStore from "nedb";
const database = new dataStore();

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
return JAM
  function loadInitialDataJAM(){
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
    return JAM
  }
  
  const BASE_API = "/api/v1"
  
  database.insert(JAM, (err, newDocs) => {
      if (err) {
          return res.status(500).send("Error al insertar los datos.");
      }
  })
  
 export function loadBackendJAM(app){
      
      // APIs de JAM
      app.get(BASE_API + "/registrations-stats/docs", (req, res) => {
          res.redirect("https://documenter.getpostman.com/view/42224504/2sB2cVe22m"); 
      });
  
      app.get(BASE_API + "/registrations-stats/loadInitialData", (req, res) => {
          database.count({}, (err, count) => {
              if (err) {
                  return res.status(500).send("Error al comprobar la base de datos.");
              }
  
              if (count > 0) {
                  return res.status(400).json({ message: "Ya tiene datos" });
              }
  
              const initialData = loadInitialDataJAM();
              database.insert(initialData, (err, newDocs) => {
                  if (err) {
                      return res.status(500).send("Error al insertar los datos.");
                  }
  
                  database.find({}, (err, registrations) => {
                      if (err) {
                          return res.status(500).send("Error al recuperar los datos.");
                      }
                      res.send(JSON.stringify(registrations.map((x)=>{
                          delete x._id;
                          return x;
                      }),null,2));
                  });
              });
          });
      });
  
      // GET todos los datos con paginación
     app.get(BASE_API + "/registrations-stats", (req, res) => {
      let { total_general_national, province, year,total_general_import,total_general_auction,total_general, from, to, limit, offset } = req.query;
  
      let query = {};
  
      if (province) {
          query.province = new RegExp("^" + province + "$", "i");
      }
      
      if (year) {
          query.year = Number(year);
      }  
      if (total_general_import) {
        query.total_general_import = Number(total_general_import);
      }  
      if (total_general_auction) {
        query.total_general_auction = Number(total_general_auction);
      }
      if (total_general) {
        query.total_general = Number(total_general);
    } 

      if (total_general_national) {
          query.total_general_national = Number(total_general_national);
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
  
      q.exec((err, registrations) => {
          if (err) {
              return res.status(500).send("Error al acceder a la base de datos.");
          }
  
          // Eliminar _id de cada objeto
          const sanitized = registrations.map(({ _id, ...rest }) => rest);
  
          res.send(JSON.stringify(sanitized));
      });
    });
      //POST a todos los datos
      app.post(BASE_API + "/registrations-stats", (req, res) => {
          const { total_general_national, province, year, total_general_import, total_general_auction,total_general } = req.body;
          // Validar campos obligatorios
          if (
            total_general_national === undefined || province === undefined || total_general_import === undefined ||
              year === undefined || total_general_auction === undefined || total_general === undefined
          ) {
              return res.sendStatus(400); // Bad Request
          }
          // Comprobar si ya existe un registro con mismo ine_code (puedes añadir year si es clave compuesta)
          database.findOne({ total_general_national: total_general_national }, (err, existingDoc) => {
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
      app.put(BASE_API + "/registrations-stats/",(req,res)=>{    
          
          res.sendStatus(405);
      });
  
      //DELETE de todos los datos
      app.delete(BASE_API + "/registrations-stats", (req, res) => {
          database.remove({},{multi:true}); 
          console.log("Todos los datos han sido eliminados."); // Para ver en consola
          res.sendStatus(200); 
      });
  
      //GET de un dato especifico
      app.get(BASE_API + "/registrations-stats/:total_general_national", (req, res) => {
          const paramTotalGeneralNational = Number(req.params.total_general_national);
      
          database.findOne({ total_general_national: paramTotalGeneralNational }, (err, sanction) => {
              if (err) {
                  return res.status(500).send("Error al acceder a la base de datos.");
              }
              if (!sanction) {
                  return res.sendStatus(404);
              }
              // Eliminar la propiedad _id antes de enviar
          const { _id, ...sanctionWithoutId } = sanction;
          res.status(200).json(sanctionWithoutId);
          });
      });
  
  //POST para resetear la base de datos a la version original
  app.post(BASE_API + "/registrations-stats/reset", (req, res) => {
      database.remove({}, { multi: true }, (err) => {
          if (err) {
              return res.status(500).send("Error al limpiar la base de datos.");
          }    
          database.insert(JAM, (err) => {
              if (err) {
                  return res.status(500).send("Error al restaurar los datos iniciales.");
              }    
              res.status(200).send("Base de datos restaurada.");
          });
      });
  });
  
      //FALLO DE POST de un dato especifico
      app.post(BASE_API + "/registrations-stats/:total_general_national",(req,res)=>{    
          
          res.sendStatus(405);
      });
  
      //PUT de un dato especifico
      app.put(BASE_API + "/registrations-stats/:total_general_national", (req, res) => {
          const paramTotalGeneralNational = Number(req.params.total_general_national);
          const updatedData = req.body;
  
          // Verificar que el total_general_national en el body coincida con el de la URL
          if (updatedData.total_general_national !== paramTotalGeneralNational) {
              return res.sendStatus(400); // Bad Request
          }    
          database.update({ total_general_national: paramTotalGeneralNational }, updatedData, {}, (err, numReplaced) => {
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
      app.delete(BASE_API + "/registrations-stats/:total_general_national", (req, res) => {
          const paramTotalGeneralNational = Number(req.params.total_general_national);
      
          database.remove({ total_general_national: paramTotalGeneralNational }, {}, (err, numRemoved) => {
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

      app.get(BASE_API + "/registrations-stats/:province/:year", (req, res) => {
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
    app.put(BASE_API + "/registrations-stats/:province/:year", (req, res) => {
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
    app.delete(BASE_API + "/registrations-stats/:province/:year", (req, res) => {
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
  
export {JAM,loadInitialDataJAM};
