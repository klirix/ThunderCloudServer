var socket = io();
var app = new Vue({
  el: '#app',
  data: {
    files: []
  },
  methods: {
    deleteFile: function(e,id,name){
        $.snackbar({
            content: "File "+name+" successfully deleted!",// add a custom class to your snackbar
            timeout: 3000, // time in milliseconds after the snackbar autohides, 0 is disabled
        })
        e.preventDefault();
        $.ajax('file/'+id,{
            method:'DELETE'
        })
    }
  }
})
$.get('/files').then(files=>{
    app.$data.files = files;
})

function uploadFile(event){
    console.log(event)
}
socket.on('newfile',function(data){
    app.$data.files.push(data)
})

socket.on('deleted',function(data){
    console.log(data);
    app.$data.files = app.$data.files.filter(function(el){
        return el.id!=data
    })
})


var big = new Dropzone(".drop", { url: "/files"})
var plus = new Dropzone(".add-file", { url: "/files"})


big.on('addedfile',addedFile)
plus.on('addedfile',addedFile)

function addedFile(file){
    console.log(file)
    $.snackbar({
        content: "File "+file.name+" successfully loaded!",// add a custom class to your snackbar
        timeout: 3000, // time in milliseconds after the snackbar autohides, 0 is disabled
    })
}