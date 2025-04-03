import { loadBackEnd } from "./src/back/radars-stats/index.js";
import { loadBackendVCH } from "./src/back/accidents-stats/index.js";
import { loadBackendJAM } from "./src/back/registrations-stats/index.js";
import express  from "express";
import path from "path";
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
        <a href="/samples/IOM">IOM</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/accidents-stats">API Víctor Cabrera Hurtado</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/registrations-stats">API Jesús Aznar Montero</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/accidents-stats/docs">DOCS Víctor Cabrera Hurtado</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/registrations-stats/docs">DOCS Jesús Aznar Montero</a><br>
        `)
})


app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})

//Ignacio Ortiz Moreno
 loadBackEnd(app);
// // Filtrar por comunidad 
// let filtered = IOM.filter((v)=> v.autonomousCommunity === "Andalucía")

// //Suma de velocidad media

// let sum = filtered.reduce((acc,value) => acc + value.averageSpeedFined,0)

// // Media de velocidad en Andalucía 

// let average = sum / filtered.length

// app.get('/samples/IOM', (request,response)=> {
//     response.send(`La media de velocidad en Andalucía es: ${average} km/h <br>
//         <a href="/">Volver atrás</a>`)
// })


loadBackendJAM(app);
loadBackendVCH(app);

