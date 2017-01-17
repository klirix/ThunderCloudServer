import {Router,Response, static as stat} from 'express';
import * as multer from 'multer';
import files from './File.model'
import {io} from './initializers'

let upload = multer({
    dest:'files/'
})

export let MainRouter = Router()

.post('/files',upload.any(),(req,res)=>{
    let clientFiles:Express.Multer.File[] = <any> req.files
    clientFiles.forEach(value=>{
        files.add(value.filename,value.originalname).then(file=>{
            if (process.argv.indexOf("--log")>-1){
                console.log("Someone from "+req.connection.remoteAddress+" uploaded: "+value.originalname);
            }
            io.emit('newfile',file)
            res.json(file)
        })
    })
})

.get('/files',(req,res)=>{
    files.all().then(data=>{
        res.json(data)        
    })
})

.get('/file/:id/download',(req,res)=>{
    files.get(req.params.id).then(file=>{ 
        if (process.argv.indexOf("--log")>-1){
            console.log("Someone from "+req.connection.remoteAddress+" downloaded: "+file.original);        
        }
        res.download('./files/'+file.filename,file.original)
    })
})

.get('/file/:id',(req,res)=>{
    files.get(req.params.id).then(file=>{ 
        if (process.argv.indexOf("--log")>-1){
            console.log("Someone from "+req.connection.remoteAddress+" downloaded: "+file.original);        
        }
        
        res.download('./files/'+file.filename)
        res.set({
            "Content-Disposition": 'filename="'+file.original+'"'
        });
    })
})

.delete('/file/:id',(req,res)=>{
    files.remove(req.params.id).then(data=>{
        if (process.argv.indexOf("--log")>-1){
            console.log("Someone from "+req.connection.remoteAddress+" deleted file by id: "+req.params.id);                
        }
        res.json(true);    
        io.emit('deleted',req.params.id)        
    }).catch(err=>{
        res.json(false);
        io.emit('delete failed');
    })
})

.use(stat(__dirname + '/public'))