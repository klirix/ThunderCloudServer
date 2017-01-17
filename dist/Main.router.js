"use strict";
const express_1 = require("express");
const multer = require("multer");
const File_model_1 = require("./File.model");
const initializers_1 = require("./initializers");
let upload = multer({
    dest: 'files/'
});
exports.MainRouter = express_1.Router()
    .post('/files', upload.any(), (req, res) => {
    let clientFiles = req.files;
    clientFiles.forEach(value => {
        File_model_1.default.add(value.filename, value.originalname).then(file => {
            if (process.argv.indexOf("--log") > -1) {
                console.log("Someone from " + req.connection.remoteAddress + " uploaded: " + value.originalname);
            }
            initializers_1.io.emit('newfile', file);
            res.json(file);
        });
    });
})
    .get('/files', (req, res) => {
    File_model_1.default.all().then(data => {
        res.json(data);
    });
})
    .get('/file/:id/download', (req, res) => {
    File_model_1.default.get(req.params.id).then(file => {
        if (process.argv.indexOf("--log") > -1) {
            console.log("Someone from " + req.connection.remoteAddress + " downloaded: " + file.original);
        }
        res.download('./files/' + file.filename, file.original);
    });
})
    .get('/file/:id', (req, res) => {
    File_model_1.default.get(req.params.id).then(file => {
        if (process.argv.indexOf("--log") > -1) {
            console.log("Someone from " + req.connection.remoteAddress + " downloaded: " + file.original);
        }
        res.download('./files/' + file.filename);
        res.set({
            "Content-Disposition": 'filename="' + file.original + '"'
        });
    });
})
    .delete('/file/:id', (req, res) => {
    File_model_1.default.remove(req.params.id).then(data => {
        if (process.argv.indexOf("--log") > -1) {
            console.log("Someone from " + req.connection.remoteAddress + " deleted file by id: " + req.params.id);
        }
        res.json(true);
        initializers_1.io.emit('deleted', req.params.id);
    }).catch(err => {
        res.json(false);
        initializers_1.io.emit('delete failed');
    });
})
    .use(express_1.static(__dirname + '/public'));
