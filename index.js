//Se almacenan módulos node en constantes para su uso
const http = require("http")
const url = require("url")
const fs = require("fs")
const port = 3000

// Se crea el servidor
http
    .createServer((req, res) => {
        let {nombre, precio} = url.parse(req.url, true).query
        let deporte = {
            nombre,
            precio
        }

        // Se captura data del archivo deportes.json 
        let data = JSON.parse(fs.readFileSync("deportes.json", "utf-8"))
        let deportes = data.deportes

        // Se disponibiliza ruta para consumo del html
        if (req.url == "/") {
            res.writeHead(200, { "content-type": "text/html" })
            fs.readFile("index.html", (err, data) => {
                res.end(data)
            })
        }

        // Se disponibiliza ruta para consumir los datos del archivo deportes.json
        if (req.url.includes("/deportes")) {
            res.writeHead(200, { "content-type": "text/html" })
            fs.readFile("deportes.json", "utf-8", (err, data) => {
                res.end(data)
            })
        }

        // Se disponibiliza ruta para agregar nuevas disciplinas con validación para elementos repetidos
        if (req.url.startsWith("/agregar")) {
            if (deportes.find(p => p.nombre == nombre)) {
                console.log(`La disciplina ${nombre} ya existe, intente agregar otra`)
                res.end()
            } else {
                deportes.push(deporte)
                fs.writeFileSync("deportes.json", JSON.stringify(data))
                console.log(`Se ingresó ${nombre} como nuevo disciplina, por un valor de $${Number(precio).toLocaleString("es")}`)
                res.end()
            }
        }

        // Se disponibiliza ruta para editar el precio de una disciplina        
        if (req.url.startsWith("/editar")) {
            deportes.map((p) => {
                if (p.nombre == nombre) {
                    p.precio = precio
                    fs.writeFileSync("deportes.json", JSON.stringify(data))
                    res.end()
                }
            })
        }

        // Se disponibiliza ruta para eliminar una disciplina mediante la aplicación cliente        
        if (req.url.startsWith("/eliminar")) {
            deportes.map((p, i) => {
                if (p.nombre == nombre) {
                    deportes.splice(i, 1)
                    fs.writeFileSync("deportes.json", JSON.stringify(data))
                    res.end()
                }
            })
        }
    })
    .listen(`${port}`, () => console.log(`Servidor funcionando en el puerto ${port}`))