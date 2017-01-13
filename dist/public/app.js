var socket = io();
var app = new Vue({
  el: '#app',
  data: {
    files: []
  },
  methods: {
    deleteFile: function(e,id){
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


new Dropzone(".drop", { url: "/files"})