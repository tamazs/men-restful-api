const router = require("express").Router();
const project = require("../models/project");
const { verifyToken } = require("../validation");

//CRUD operations

// /api/projects/
//Create - post
router.post("/", verifyToken, (req, res) => {

    data = req.body;

    project.insertMany(data)
    .then(data => { res.status(201).send(data); })
    .catch(err => { res.status(500).send( { message: err.message } ); })
});


// /api/projects/
//Read all - get
router.get("/", (req, res) => {

    project.find()
    .then(data => { res.send(mapArray(data)) })
    .catch(err => { res.status(500).send( { message: err.message } ); })
});

//Read all public - get
router.get("/public/:status", (req, res) => {

    project.find({ public: req.params.status })
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( { message: err.message } ); })
});

router.get("/random", (req, res) => {
    //get random project
    project.countDocuments({})
    .then(count => {
        //Get a random number
        let random = Math.floor(Math.random() * count);

        //Query all documents but fetch only one
        project.findOne().skip(random)
        .then(data => { res.send(mapData(data)) })
        .catch(err => { res.status(500).send( { message: err.message } ); })
    })
})

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

function mapArray(inputArray) {

    // do something with inputArray
    let outputArray = inputArray.map(element => (        
        mapData(element)        
    ));

    return outputArray;
}

function mapData(element) {
    let outputObj = {
        id: element._id,
        title: element.title,
        members: element.members,
        description: element.description,
        createdDate: element.createdDate,
        public: element.public,
        active: element.active,

        // add uri (HATEOAS) for this specific resource
        uri: "/api/products/" + element._id
    };

    return outputObj;
};

module.exports = router;