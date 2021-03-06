//mongodb://atlas:sdi@tiendamusica-shard-00-00.qmudf.mongodb.net:27017,tiendamusica-shard-00-01.qmudf.mongodb.net:27017,tiendamusica-shard-00-02.qmudf.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-7fytht-shard-0&authSource=admin&retryWrites=true&w=majority

// Módulos
var express = require('express');
var app = express();

let fs = require('fs');
let https = require('https');

var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));
var crypto = require('crypto');
var fileUpload = require('express-fileupload');
app.use(fileUpload());
var mongo = require('mongodb');
var swig = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);
// routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
    console.log("routerUsuarioSession");
    if ( req.session.usuario ) {

        // dejamos correr la petición
        next();
    } else {
        console.log("va a : "+req.session.destino)
        res.redirect("/identificarse");
    }
});
//Aplicar routerUsuarioSession
app.use("/canciones/agregar",routerUsuarioSession);
app.use("/publicaciones",routerUsuarioSession);

//routerUsuarioAutor
let routerUsuarioAutor = express.Router();
routerUsuarioAutor.use(function(req, res, next) {
    console.log("routerUsuarioAutor");
    let path = require('path');
    let id = path.basename(req.originalUrl);
// Cuidado porque req.params no funciona
// en el router si los params van en la URL.
    gestorBD.obtenerCanciones(
        {_id: mongo.ObjectID(id) }, function (canciones) {
            console.log(canciones[0]);
            if(canciones[0].autor == req.session.usuario ){
                next();
            } else {
                res.redirect("/tienda");
            }
        })
});
//Aplicar routerUsuarioAutor
app.use("/cancion/modificar",routerUsuarioAutor);
app.use("/cancion/eliminar",routerUsuarioAutor);
app.use("/cancion/comprar",routerUsuarioSession);
app.use("/compras",routerUsuarioSession);


//routerAudios
let routerAudios = express.Router();
routerAudios.use(function(req, res, next) {
    console.log("routerAudios");
    let path = require('path');
    let idCancion = path.basename(req.originalUrl, '.mp3');
    gestorBD.obtenerCanciones(
        {"_id": mongo.ObjectID(idCancion) }, function (canciones) {
            if(req.session.usuario && canciones[0].autor == req.session.usuario ){
                next();
            } else {
                let criterio = {
                    usuario : req.session.usuario,
                    cancionId : mongo.ObjectID(idCancion)
                };

                gestorBD.obtenerCompras(criterio ,function(compras){
                    if (compras != null && compras.length > 0 ){
                        next();
                    } else {
                        res.redirect("/tienda");
                    }
                });
            }
        })
});
//Aplicar routerAudios
app.use("/audios/",routerAudios);

app.use(express.static('public'));

// Variables
app.set('port', 8081);
app.set('db',' mongodb://admin:<password>@tiendamusica-shard-00-00-hy8gh.mongodb.net:27017,mongodb://atlas:sdi@tiendamusica-shard-00-00.qmudf.mongodb.net:27017,tiendamusica-shard-00-01.qmudf.mongodb.net:27017,tiendamusica-shard-00-02.qmudf.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-7fytht-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave','abcdefg');
app.set('crypto',crypto);

///Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rcanciones.js")(app, swig, gestorBD);

app.get('/', function (req, res) {
    res.redirect('/tienda');
})

app.use( function (err,req,res,next) {
    console.log("Error producido: " + err); //mostramos el error en consola
    if(! res.headersSent) {
        res.status(400);
        res.send("Recurso no disponible");
    }
});

https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function() {
    console.log("Servidor activo");
});