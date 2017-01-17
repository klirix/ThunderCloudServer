"use strict";
const e = require("express");
const Main_router_1 = require("./Main.router");
const http = require("http");
exports.app = e().use(Main_router_1.MainRouter);
exports.server = http.createServer(exports.app);
const sockServer = require("socket.io");
exports.io = sockServer.listen(exports.server);
