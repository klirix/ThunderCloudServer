import {server} from './initializers'

module.exports = function startServer(){
    server.listen(8080)
}