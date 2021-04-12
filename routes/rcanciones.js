module.exports = function(app, swig, mongo) {
    app.get("/canciones", function(req, res) {
        let cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio
        }

        // Conectarse
        mongo.MongoClient.connect(app.get('db'), function(err, db) {
            if (err) {
                res.send("Error de conexión: " + err);
            } else {
                let collection = db.collection('canciones');
                collection.insertOne(cancion, function(err, result) {
                    if (err) {
                        res.send("Error al insertar " + err);
                    } else {
                        res.send("Agregada id: "+ result.ops[0]._id);
                    }
                    db.close();
                });
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