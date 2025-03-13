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

/*
app.get('/samples/VCH', (request,response)=> {
    const albaceteAccidents = myData.filter(accident => accident.province === "Albacete");
    const totalVictims = albaceteAccidents.reduce((sum, accident) => sum + accident.total_victims, 0);
    const averageVictims = albaceteAccidents.length > 0 ? totalVictims / albaceteAccidents.length : 0;
    response.json(`La media de fallecidos en accidentes ocurridos en Albacete es: ${averageVictims}<br>
        <a href="/">Volver atrás</a>`);
}) 
*/


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


//API Jesús Aznar Montero
app.get(BASE_API+"/registrations-stats",(request, response)=>{
    console.log("New GET to /registrations-stats")
    response.send(JSON.stringify(datos));
});
app.post(BASE_API+"/registrations-stats",(request, response)=>{
    console.log("New POST to /registrations-stats")
    let newRegistrations = request.body;
    datos.push(newRegistrations)
    response.sendStatus(201);
});
