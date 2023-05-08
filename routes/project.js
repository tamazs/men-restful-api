const router = require("express").Router();
const project = require("../models/project");
const { verifyToken } = require("../validation");

//CRUD operations

// /api/projects/
//Get all
router.get('/', async (req, res) => {
    try {
        const projects = await project.find();
        res.json(projects)
    }
    catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
    
})

//Get user projects
router.get("/:userId/", verifyToken, async (req, res) => {
    const userId = req.params.userId;

    try {
        let ownedProjects = await project.find().where('ownerID').equals(userId);
        let invitedProjects = await project.find().where('members').in([userId])

        let data = ownedProjects.concat(invitedProjects);
        res.send(data)
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
});

//Create new project
router.post('/new', verifyToken, async (req, res) => {
    try {
        const newProject = new project(
            req.body
        );
        const savedProject = await newProject.save()
        res.status(201).json(savedProject)
    }
    catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

//Get by id
router.get('/get/:id', async (req, res) => {
    try {
        const projects = await project.findById({ _id : req.params.id })
        res.json(projects)
    }
    catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

//Update by id
router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const projectUpdate = await project.findByIdAndUpdate(
            { _id: req.params.id }, 
            { $set: req.body }
    
        )
        res.json(projectUpdate)
    }
    catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

//Delete by id
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const projectDelete = await project.findByIdAndDelete({ _id : req.params.id })
        res.json(projectDelete)
    }
    catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

module.exports = router