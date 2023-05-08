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
    catch {
        res.status(400)
    }
    
})

//Create new task
router.post('/new', async (req, res) => {
    try {
        const newProject = new project(
            req.body
        );
        const savedProject = await newProject.save()
        res.json(savedProject)
    }
    catch {
        res.status(400)
    }
    
})

//Get by id
router.get('/get/:id', async (req, res) => {
    try {
        const projects = await project.findById({ _id : req.params.id })
        res.json(projects)
    }
    catch {
        res.status(400)
    }
    
})

//Update by id
router.put('/update/:id', async (req, res) => {
    try {
        const projectUpdate = await project.updateOne(
            { _id: req.params.id }, 
            { $set: req.body }
    
        )
        res.json(projectUpdate)
    }
    catch {
        res.status(400)
    }
})

//Delete by id
router.delete('/delete/:id', async (req, res) => {
    try {
        const projectDelete = await project.findByIdAndDelete({ _id : req.params.id })
        res.json(projectDelete)
    }
    catch {
        res.status(400)
    }
    
})

module.exports = router