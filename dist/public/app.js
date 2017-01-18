var socket = io();
var app = new Vue({
  el: '#app',
  data: {
    contextMenuOpen: false,
    files: [],
    fileContext: undefined,
    loadingQueue:[]
  },
  methods: {
    dragstart:function(e){
        e.dataTransfer.dropEffect = 'copy';
        e.preventDefault();
        
    },
    dragstop:function(e){
        console.log(e);
    },
    drop:function(e){
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        console.log(e.dataTransfer.files);
        for (var i in e.dataTransfer.files) {
            if (e.dataTransfer.files.hasOwnProperty(i)) {
                this.uploadFile(e.dataTransfer.files[i])
            }
        }
    },
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
    uploadFile:function(file){
        var form = new FormData();
        form.append('file',file);
        // var id = this.loadingQueue.length;
        // this.loadingQueue.push(0)
        $.ajax({
            url: '/files',
            type: 'POST',
            cache: false,
            xhr: function(){
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        // this.loadingQueue[id-1] = percentComplete;
                    }
                }, false);
                return xhr;
            },
            data:form,
            processData: false, // Don't process the files
            contentType: false
        }).then(function(){
            
            $.snackbar({
                content: "File "+file.original+" successfully deleted!",// add a custom class to your snackbar
                timeout: 3000, // time in milliseconds after the snackbar autohides, 0 is disabled
            })
        })
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
        return '/file/'+file.id;
    }
    return '/pics/'+format+'-file-format.svg'
}