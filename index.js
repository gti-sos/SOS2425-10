import { loadBackEnd } from "./src/back/radars-stats/index.js";
import { loadBackendVCH } from "./src/back/accidents-stats/index.js";
import { loadBackendJAM } from "./src/back/registrations-stats/index.js";
import { handler } from "./src/front/build/handler.js";
import express from "express";
import cors from "cors";
import path from "path";
import dataStore from "nedb";
import { loadBackendVCH_v1 } from "./src/back/accidents-stats/index_v1.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const request = require("request");
const app = express();
const PORT = process.env.PORT || 16079;

const BASE_API = "/api/v1";
//--
app.use(express.json());
app.use(cors());




// === INTEGRACIÓN DEL PROXY PROPIO HACIA OTRA API SOS ===



app.use("/api-proxy", (req, res) => {
    let targetBase;

    if (req.url.startsWith("/api/v1/annual-evolutions")) {
        targetBase = "https://sos2425-12.onrender.com";
    } else if (req.url.startsWith("/api/v1/sanctions-and-points-stats")) {
        targetBase = "https://sos2425-19.onrender.com";
    }else if (req.url.startsWith("/api/v1/precipitation-stats")) {
        targetBase = "https://sos2425-15.onrender.com";
    }else if (req.url.startsWith("/api/v1/ocupied-grand-stats")) {
        targetBase = "https://sos2425-15.onrender.com";
    }else if (req.url.startsWith("/api/v2/students_satisfaction")) {
        targetBase = "https://sos2425-17.onrender.com";
    }else if (req.url.startsWith("/api/v1/home-buying-selling-stats")) {
        targetBase = "https://sos2425-21.onrender.com";
    }else {
        console.log("[PROXY] Ruta no permitida:", req.url);
        return res.status(404).send("Ruta de proxy no válida");
    }

    const url = targetBase + req.url;
    console.log("[PROXY] Redirigiendo a:", url);
    req.pipe(request(url)).pipe(res);
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



