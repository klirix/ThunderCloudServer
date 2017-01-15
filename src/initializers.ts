import * as e from 'express'
import {MainRouter} from './Main.router'
import db from './File.model'
import * as http from 'http';

export let app = e().use(MainRouter);
export let server = http.createServer(app)
import * as sockServer from 'socket.io'
export let io = sockServer.listen(server);