import {Router,Response, static as stat} from 'express';
import * as multer from 'multer';
import files from './File.model'
import {io} from './initializers'

let upload = multer({
    dest:'files/'
})

export let MainRouter = Router()

.post('/files',upload.any(),(req,res)=>{
    console.log(req.file);
    let clientFiles:Express.Multer.File[] = <any> req.files
    clientFiles.forEach(value=>{
        files.add(value.filename,value.originalname).then(file=>{
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

.get('/file/:id',(req,res)=>{
    files.get(req.params.id).then(file=>{ 
        res.download('./files/'+file.filename,file.original)
    })
})

.delete('/file/:id',(req,res)=>{
    files.remove(req.params.id).then(data=>{
        res.json(true);    
        io.emit('deleted',req.params.id)        
    }).catch(err=>{
        res.json(false);
        io.emit('delete failed');
    })
})

.use(stat(__dirname + '/public'))