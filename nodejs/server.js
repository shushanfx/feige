var express = require('express');
var jade = require('jade');
var dao = require('./dao.js');

var app = null, server = null;

function init(){
    console.info("Init the server.");
    app = express();
    app.set('views', __dirname + '/jade');
    app.set('view engine', 'jade');
    app.use(app.router);
    app.use(express.static(__dirname + '/static'));

    dao.init(function(db, table){
        db.save();
    });

    app.get("/", function(req, res){
        res.render('index');
    });

    app.get('/list.html', function(req, res){
        dao.search("User", function(db, table){
            var list = table.find();
            res.render("list", {list: list});
        });
    });
    app.get("/help.html", function(req, res){
        res.render("help");
    });

    app.get("/add.html", function(req, res){
        res.render("add");
    });
    app.get("/insert.html", function(req, res){
        var name = req.param("name"), phone=req.param("phone"), email= req.param("email");
        var obj = {name: name, phone: phone, email: email};
        dao.insert("User", obj, function(db, table){
            var list = table.find();
            res.render("list", {list: list});
        });
    });
    app.get("/remove.html", function(req,res){
        var phone = req.param("phone");
        dao.search("User", function(db, table){
            var item = table.find({"phone": phone});
            if(item && item.length > 0){
                for(var i=0; i<item.length; i++){
                    table.remove(item[i]);
                }
            }
            var list = table.find();
            res.render("list", {list: list});
        });
    });

    console.info("Start the server...");
    server = app.listen(9000, function() {
        console.log('Listening on port %d', server.address().port);
    });
}
exports.init = init;
init();