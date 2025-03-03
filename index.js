const express = require("express");
const cool = require("cool-ascii-faces")
const app = express()
const PORT = process.env.PORT || 16079

app.use("/about",express.static("./public"))

app.get("/",(request,response)=>{
    response.send(`Servidor del <a href="/about">grupo 10</a><br>
        <a href="/cool">Cool</a><br>
        `)
})

app.get("/cool",(request, response)=>{
    response.send(cool());
});

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})