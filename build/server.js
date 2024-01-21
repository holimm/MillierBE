"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
var listenServer = function () {
    var server = app.listen(process.env.PORT, function () {
        console.log("Started listing on port ".concat(server.address().port));
    });
    app.use(bodyParser.json());
    app.use(cors());
    return app;
};
exports.default = listenServer;
