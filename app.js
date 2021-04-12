//mongodb://atlas:sdi@tiendamusica-shard-00-00.qmudf.mongodb.net:27017,tiendamusica-shard-00-01.qmudf.mongodb.net:27017,tiendamusica-shard-00-02.qmudf.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-7fytht-shard-0&authSource=admin&retryWrites=true&w=majority



let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

// Variables
app.set('port', 8081);
app.set('db',' mongodb://admin:<password>@tiendamusica-shard-00-00-hy8gh.mongodb.net:27017,mongodb://atlas:sdi@tiendamusica-shard-00-00.qmudf.mongodb.net:27017,tiendamusica-shard-00-01.qmudf.mongodb.net:27017,tiendamusica-shard-00-02.qmudf.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-7fytht-shard-0&authSource=admin&retryWrites=true&w=majority');


///Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rcanciones.js")(app, swig, gestorBD);

// lanzar el servidor
app.listen(app.get('port'), function () {
    console.log('Servidor activo');
});