const express = require('express');
const router = express.Router();
const task = require('../models/task');
const { verifyToken } = require("../validation");

//Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await task.find();
        res.json(tasks)
    }
    catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

//Create new task
router.post('/new', verifyToken, async (req, res) => {
    try {
        const newTask = new task(
            req.body
        );
        const savedTask = await newTask.save()
        res.json(savedTask)
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
        const tasks = await task.findById({ _id : req.params.id })
        res.json(tasks)
    }
    catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

//Get all tasks of a user by userID
router.get("/:userId", verifyToken, async (req, res) => {
    const userId = req.params.userId;

    try {
            let data = await task.find().where('assignedTo').equals(userId);

            res.send((data));
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
});

//Get all tasks of a project
router.get("/:projectId", verifyToken, async (req, res) => {
    const projectId = req.params.projectId;

    try {
        let data = await task.find().where('projectID').equals(projectId);
        res.send(data)

    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
});

//Get all tasks of a project of a user
router.get("/:projectId/:userId", verifyToken, async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;

    try {
        let data = await task.find({ assignedTo: userId }).where('projectID').equals(projectId);
        res.send(data)

    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
});

//Get all tasks of a project based on state
router.get("/:projectId/:state", verifyToken, async (req, res) => {
    const projectId = req.params.projectId;
    const state = req.params.state;

    try {
        let data = await task.find({ state: state }).where('projectID').equals(projectId);

        res.send(data)

    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
});

//Update by id
router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const taskUpdate = await task.findByIdAndUpdate(
            { _id: req.params.id }, 
            { $set: req.body }
    
        )
        res.json(taskUpdate)
    }
    catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

//Update task state by taskID
router.put('/update/:id/:state', verifyToken, async (req, res) => {
    const taskId = req.params.id;
    const state = req.params.state;

    try {
        const taskStateUpdate = await task.findByIdAndUpdate(
            { _id: taskId },
            { state: state }

        )
        res.json(taskStateUpdate)
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
        const taskDelete = await task.findByIdAndDelete({ _id : req.params.id })
        res.json(taskDelete)
    }
    catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

module.exports = router