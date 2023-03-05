const router = require("express").Router();
const product = require("../models/product");
const { verifyToken } = require("../validation");

//CRUD operations

// /api/products/
//Create - post
router.post("/", verifyToken, (req, res) => {

    data = req.body;

    product.insertMany(data)
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( { message: err.message } ); })
});


// /api/products/
//Read all - get
router.get("/", (req, res) => {

    product.find()
    .then(data => { res.send(mapArray(data)); })
    .catch(err => { res.status(500).send( { message: err.message } ); })
});

//Read all in stock - get
router.get("/instock/:status", (req, res) => {

    product.find({ inStock: req.params.status })
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( { message: err.message } ); })
});

//Read specific - get
router.get("/:id", (req, res) => {

    product.findById(req.params.id)
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( { message: err.message } ); })
});

//Price greater or less than
router.get("/price/:operator/:price", (req, res) => {

    const operator = req.params.operator;
    const price = req.params.price;

    let filterExpression = { $gte: price };

    //lt = less than
    if (operator == "lt") {
        filterExpression = { $lte: price }
    }

    product.find({ price: filterExpression })
    .then(data => { res.status(200).send(mapArray(data)) })
    .catch(err => { res.status(500).send( { message: err.message } ); })

});


//Update specific - put
router.put("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    product.findByIdAndUpdate(id, req.body)
    .then(data => {
        if (!data) {
            res.status(404).send( { message: "Cannot update product with id=" + id + " . Maybe product was not found!" } )
        } else {
            res.send( { message: "Product was successfully updated." } )
        }
    })
    .catch(err => { res.status(500).send( { message: "Error updating product with id=" + id } ); })
});


//Delete specific - delete
router.delete("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    product.findByIdAndDelete(id)
    .then(data => {
        if (!data) {
            res.status(404).send( { message: "Cannot delete product with id=" + id + " . Maybe product was not found!" } )
        } else {
            res.send( { message: "Product was successfully deleted." } )
        }
    })
    .catch(err => { res.status(500).send( { message: "Error deleting product with id=" + id } ); })
});

function mapArray(inputArray) {
    let outputArray = inputArray.map(element => (
        {
            id: element._id,
            name: element.name,
            description: element.description,
            price: element.price,
            inStock: element.inStock,

            //add uri (HATEOAS) for this specific resource
            uri: "/api/products/" + element._id
        }
    ));

    return outputArray;
}

module.exports = router;