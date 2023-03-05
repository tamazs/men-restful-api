const router = require("express").Router();
const project = require("../models/project");
const { verifyToken } = require("../validation");

//CRUD operations

// /api/projects/
//Create - post
router.post("/", verifyToken, (req, res) => {

    data = req.body;

    project.insertMany(data)
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( { message: err.message } ); })
});


// /api/projects/
//Read all - get
router.get("/", (req, res) => {

    project.find()
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( { message: err.message } ); })
});

//Read all public - get
router.get("/public/:status", (req, res) => {

    project.find({ public: req.params.status })
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( { message: err.message } ); })
});

//Read specific - get
router.get("/:id", (req, res) => {

    project.findById(req.params.id)
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( { message: err.message } ); })
});


//Update specific - put
router.put("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    project.findByIdAndUpdate(id, req.body)
    .then(data => {
        if (!data) {
            res.status(404).send( { message: "Cannot update project with id=" + id + " . Project was not found!" } )
        } else {
            res.send( { message: "Project was successfully updated." } )
        }
    })
    .catch(err => { res.status(500).send( { message: "Error updating project with id=" + id } ); })
});


//Delete specific - delete
router.delete("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    project.findByIdAndDelete(id)
    .then(data => {
        if (!data) {
            res.status(404).send( { message: "Cannot delete project with id=" + id + " . Project was not found!" } )
        } else {
            res.send( { message: "Project was successfully deleted." } )
        }
    })
    .catch(err => { res.status(500).send( { message: "Error deleting project with id=" + id } ); })
});

module.exports = router;