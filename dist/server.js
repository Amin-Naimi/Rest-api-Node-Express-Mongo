"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class Server {
    constructor(port) {
        this.port = port;
    }
    start() {
        const app = express();
        app.get('/', (req, res) => {
            res.send("<h1>Test Express avec Type Script</h1>");
        });
        app.listen(this.port, () => {
            console.log("Server started ...");
        });
    }
}
exports.default = Server;
