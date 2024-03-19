"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collections = void 0;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var database_service_1 = require("./services/database.service");
var users_router_1 = require("./routes/users.router");
var products_router_1 = require("./routes/products.router");
var productsdetail_router_1 = require("./routes/productsdetail.router");
var category_router_1 = require("./routes/category.router");
var orders_router_1 = require("./routes/orders.router");
var email_router_1 = require("./routes/email.router");
var blogs_router_1 = require("./routes/blogs.router");
var contacts_router_1 = require("./routes/contacts.router");
var app = (0, express_1.default)();
var cors = require("cors");
(0, database_service_1.connectToDatabase)()
    .then(function () {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS");
        next();
    });
    app.use("/api/users", users_router_1.usersRouter);
    app.use("/api/orders", orders_router_1.ordersRouter);
    app.use("/api/products", products_router_1.productsRouter);
    app.use("/api/category", category_router_1.categoryRouter);
    app.use("/api/productsDetail", productsdetail_router_1.productsDetailRouter);
    app.use("/api/email", email_router_1.emailRouter);
    app.use("/api/blogs", blogs_router_1.blogsRouter);
    app.use("/api/contacts", contacts_router_1.contactsRouter);
    app.use(body_parser_1.default.json());
    app.use(cors());
    app.use(express_1.default.static("public"));
    app.use("/images", express_1.default.static("images"));
    app.listen(process.env.PORT, function () {
        console.log("Server started at http://localhost:".concat(process.env.PORT));
    });
    app.use(cors());
})
    .catch(function (error) {
    console.error("Database connection failed", error);
    process.exit();
});
exports.collections = {};
