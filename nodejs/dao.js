var DB = require("lokijs");
var fs = require("fs");
var DB_NAME = './data/db.json';

var db = null;
function init(callback){
    fs.exists(DB_NAME, function (isExist) {
        if (!isExist) {
            db = new DB(DB_NAME);
            callback && callback(db);
        }
        else{
            db = new DB(DB_NAME);
            db.loadDatabase(function () {
                callback && callback(db);
            });
        }
    });
}

function getDB(){
    return db;
}
function operate(tableName, callback){
    var table = db.getCollection(tableName);
    if(!table){
        table = db.addCollection(tableName);
    }
    callback(db, table);
}

function insert(tableName, obj, callback){
    operate(tableName, function(db, table){
        table.insert(obj);
        db.save();
        if(callback){
            callback(db, table);
        }
    });
}

function update(tableName, obj, callback){
    operate(tableName, function(db, table){
        table.update(obj);
        db.save();
        if(callback){
            callback(db, table);
        }
    });
}

function search(tableName, callback){
    operate(tableName, callback);
}

exports.init = init;
exports.insert = insert;
exports.update = update;
exports.search = search;