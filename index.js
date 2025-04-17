import { loadBackEnd } from "./src/back/radars-stats/index.js";
import { loadBackendVCH } from "./src/back/accidents-stats/index.js";
import { loadBackendJAM } from "./src/back/registrations-stats/index.js";
import  {handler} from "./src/front/build/handler.js";
import express  from "express";
<<<<<<< HEAD
import cors from "cors";
=======
import { handler } from "./src/front/build/handler.js";
import  cors  from "cors";
>>>>>>> L07-VCH
import path from "path";
const app = express()
const PORT = process.env.PORT || 16079


import dataStore from "nedb";

// const JAM = require('./index-JAM')
// const VCH = require('./index-VCH')

const BASE_API="/api/v1";

//app.use("/about",express.static("./public"));

app.use(express.json());
app.use(cors());
<<<<<<< HEAD
// app.get("/",(request,response)=>{
//     response.send(`Servidor del <a href="/about">grupo 10</a><br>
//         <a href="https://sos2425-10.onrender.com/api/v1/accidents-stats">API Víctor Cabrera Hurtado</a><br>
//         <a href="https://sos2425-10.onrender.com/api/v1/registrations-stats">API Jesús Aznar Montero</a><br>
//         <a href="https://sos2425-10.onrender.com/api/v1/radars-stats">API Ignacio Ortiz Moreno</a><br>
//         <a href="https://sos2425-10.onrender.com/api/v1/accidents-stats/docs">DOCS Víctor Cabrera Hurtado</a><br>
//         <a href="https://sos2425-10.onrender.com/api/v1/registrations-stats/docs">DOCS Jesús Aznar Montero</a><br>
//         <a href="https://sos2425-10.onrender.com/api/v1/radars-stats/docs">DOCS Ignacio Ortiz Moreno</a><br>
//         `)
// })
=======

loadBackEnd(app);
loadBackendJAM(app);
loadBackendVCH(app);

app.use(handler);
app.get("/",(request,response)=>{
    response.send(`Servidor del <a href="/about">grupo 10</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/accidents-stats">API Víctor Cabrera Hurtado</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/registrations-stats">API Jesús Aznar Montero</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/radars-stats">API Ignacio Ortiz Moreno</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/accidents-stats/docs">DOCS Víctor Cabrera Hurtado</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/registrations-stats/docs">DOCS Jesús Aznar Montero</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/radars-stats/docs">DOCS Ignacio Ortiz Moreno</a><br>
        `)
})
>>>>>>> L07-VCH


app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})



<<<<<<< HEAD

loadBackendJAM(app);
loadBackendVCH(app);

app.use(handler);
=======
>>>>>>> L07-VCH
