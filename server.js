const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


mongoose
    .connect(dbConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connected to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });


app.get("/", (req, res) => {
    res.json({ message: "Welcome to BrewFlow API (Coffee Shop Application)." });
});


require("./app/routes/auth.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/user.routes")(app);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        message: "Something broke!",
        error: err.message
    });
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});