const { authJwt } = require("../middlewares");
const controller = require("../controllers/product.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/products", controller.findAll);
    app.get("/api/products/:id", controller.findOne);

    app.post(
        "/api/products",
        [authJwt.verifyToken, authJwt.isBarista],
        controller.create
    );

    app.put(
        "/api/products/:id",
        [authJwt.verifyToken, authJwt.isBarista],
        controller.update
    );

    app.delete(
        "/api/products/:id",
        [authJwt.verifyToken, authJwt.isBarista],
        controller.delete
    );
};