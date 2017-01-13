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
    console.log(req.file);
    let clientFiles = req.files;
    clientFiles.forEach(value => {
        File_model_1.default.add(value.filename, value.originalname).then(file => {
            initializers_1.io.emit('newfile', file);
            res.json(file);
        });
    });
})
    .get('/files', (req, res) => {
    File_model_1.default.all().then(data => {
        // console.log(data);
        res.json(data);
    });
})
    .get('/file/:id', (req, res) => {
    File_model_1.default.get(req.params.id).then(file => {
        console.log(file);
        res.download('./files/' + file.filename, file.original);
    });
})
    .delete('/file/:id', (req, res) => {
    initializers_1.io.emit('deleted', req.params.id);
    res.json(File_model_1.default.remove(req.params.id));
})
    .use(express_1.static(__dirname + '/public'));
