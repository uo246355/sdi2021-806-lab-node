module.exports = function(app, swig, gestorBD) {
    app.get("/canciones", function(req, res) {
        let cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio
        }

        // Conectarse
        gestorBD.insertarCancion(cancion, function(id){
            if (id == null) {
                res.send("Error al insertar canción");
            } else {
                res.send("Agregada la canción ID: " + id);
            }
        });
    });

    app.get('/canciones/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/bagregar.html', {

        });
        res.send(respuesta);
    })



    app.get('/suma', function(req, res) {
        let respuesta = parseInt(req.query.num1) + parseInt(req.query.num2);
        res.send(String(respuesta));
    });

    app.get('/canciones/:id', function(req, res) {
        let respuesta = 'id: ' + req.params.id;
        res.send(respuesta);
    });
    app.get('/canciones/:genero/:id', function(req, res) {
        let respuesta = 'id: ' + req.params.id + '<br>'
            + 'Género: ' + req.params.genero;
        res.send(respuesta);
    });

    app.post("/cancion", function (req, res) {
        res.send("Canción agregada: "+req.body.nombre + "<br>"
        + " genero :" + req.body.genero + "<br>" + " precio: " + req.body.precio);

    });

    app.get('/promo*', function (req, res) {
        res.send('Respuesta patrón promo* ');
    })

};