var socket = io();
var app = new Vue({
  el: '#app',
  data: {
    contextMenuOpen: false,
    files: [],
    fileContext: undefined
  },
  methods: {
    openContextMenu: function(e,file){
        this.contextMenuOpen = true;
        this.fileContext = file;
        console.log(e); 
        $("#menu").css({top:e.clientY,left:e.clientX})
        $("#menu").show()
        $(".backdrop").addClass('menu-open');
    },
    closeContextMenu: function(e){
        this.contextMenuOpen = false;
        if(e.target == $(".backdrop")[0] || this.contextMenuOpen){
            $("#menu").hide()
            $(".backdrop").removeClass('menu-open');
        }
        console.log(e);
    },
    downloadFile:function(e,file){
        console.log(e);
        window.open("/file/"+file.id+"/download", "_blank")
    },
    deleteFile: function(file){
        if(this.contextMenuOpen){
            $("#menu").hide()
            $(".backdrop").removeClass('menu-open');
        }
        $.ajax('file/'+file.id,{
            method:'DELETE'
        }).then(dat=>{
            $.snackbar({
                content: "File "+file.original+" successfully deleted!",// add a custom class to your snackbar
                timeout: 3000, // time in milliseconds after the snackbar autohides, 0 is disabled
            })
        })
    },
    getThumbnail:function(file){
        var format = file.original.substring(file.original.lastIndexOf('.')+1);
        if(['jpg','png',].indexOf(format)>-1){
            return 'file/'+file.id;
        }
        return '/pics/'+format+'-file-format.svg'
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

var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

var dropWindow = $('.drop-window');

dropWindow.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
  .on('dragover dragenter', function() {
    dropWindow.addClass('is-dragover');
  })
  .on('dragleave dragend drop', function() {
    dropWindow.removeClass('is-dragover');
  })
  .on('drop', function(e) {
    droppedFiles = e.originalEvent.dataTransfer.files;
  });

var plus = new Dropzone(".add-file", { url: "/files"})


plus.on('addedfile',addedFile)

function addedFile(file){
    console.log(file)
    $.snackbar({
        content: "File "+file.name+" successfully loaded!",// add a custom class to your snackbar
        timeout: 3000, // time in milliseconds after the snackbar autohides, 0 is disabled
    })
}

function getThumbnail(file){
    var format = file.original.lastIndexOf('.')+1;
    if(['jpg','png'].indexOf(format)>-1){
        return 'file/'+file.id;
    }
    return '/pics/'+format+'-file-format.svg'
}