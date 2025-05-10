import { loadBackEnd } from "./src/back/radars-stats/index.js";
import { loadBackendVCH } from "./src/back/accidents-stats/index.js";
import { loadBackendJAM } from "./src/back/registrations-stats/index.js";
import { handler } from "./src/front/build/handler.js";
import express from "express";
import cors from "cors";
import path from "path";
import dataStore from "nedb";
import { loadBackendVCH_v1 } from "./src/back/accidents-stats/index_v1.js";

const app = express();
const PORT = process.env.PORT || 16079;

const BASE_API = "/api/v1";
//--
app.use(express.json());
app.use(cors());
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
// Load backend APIs

// /api/dealers.js
app.get('/api/dealers', async (req, res) => {
    const response = await fetch('https://api.mercedes-benz.com/dealer/locations', {
      headers: {
        Authorization: 'Bearer TU_API_KEY'
      }
    });
    const data = await response.json();
    res.json(data);
  });
  
loadBackEnd(app);
loadBackendJAM(app);
loadBackendVCH(app);
loadBackendVCH_v1(app);

// Serve handler.js as a middleware
app.use(handler);

// Main route
app.get("/", (request, response) => {
    response.send(`Servidor del <a href="/about">grupo 10</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/accidents-stats">API Víctor Cabrera Hurtado</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/registrations-stats">API Jesús Aznar Montero</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/radars-stats">API Ignacio Ortiz Moreno</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/accidents-stats/docs">DOCS Víctor Cabrera Hurtado</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/registrations-stats/docs">DOCS Jesús Aznar Montero</a><br>
        <a href="https://sos2425-10.onrender.com/api/v1/radars-stats/docs">DOCS Ignacio Ortiz Moreno</a><br>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});



