"use strict";
const initializers_1 = require("./initializers");
module.exports = function startServer() {
    initializers_1.server.listen(8080);
};
