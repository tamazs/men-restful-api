const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

//swagger
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

//setup swagger
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

//import routes
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");

require ("dotenv-flow").config();

//parse request of content type JSON
app.use(bodyParser.json());

//route
app.get("/api/welcome", (req, res) => {
    res.status(200).send({message: "Welcome to the MEN RESTful API"});
})

mongoose.set('strictQuery', false);

mongoose.connect(
    process.env.DBHOST,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log("Error connection to MongoDB: " + error));

mongoose.connection.once("open", () => console.log("Connected successfully to MongoDB"));

//post, put, delete -> CRUD
app.use("/api/products", productRoutes);
app.use("/api/user", authRoutes);

const PORT = process.env.PORT || 4000;

//start up servers 
app.listen(PORT, function() {
    console.log("Server is running on port: " + PORT);
})

module.exports = app;