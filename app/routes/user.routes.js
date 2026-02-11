const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });


    app.get("/api/test/all", controller.allAccess);

    app.get("/api/users/profile", [authJwt.verifyToken], controller.getProfile);
    app.put("/api/users/profile", [authJwt.verifyToken], controller.updateProfile);

    app.get("/api/test/barista", [authJwt.verifyToken, authJwt.isBarista], controller.baristaBoard);
};