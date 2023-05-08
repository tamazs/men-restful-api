const express = require('express');
const router = express.Router();
const task = require('../models/task');

//Get all todos
router.get('/', async (req, res) => {
    try {
        const tasks = await task.find();
        res.json(tasks)
    }
    catch {
        res.status(400)
    }
    
})

//Create new task
router.post('/new', async (req, res) => {
    try {
        const newTask = new task(
            req.body
        );
        const savedTask = await newTask.save()
        res.json(savedTask)
    }
    catch {
        res.status(400)
    }
    
})

//Get by id
router.get('/get/:id', async (req, res) => {
    try {
        const tasks = await task.findById({ _id : req.params.id })
        res.json(tasks)
    }
    catch {
        res.status(400)
    }
    
})

//Update by id
router.put('/update/:id', async (req, res) => {
    try {
        const taskUpdate = await task.updateOne(
            { _id: req.params.id }, 
            { $set: req.body }
    
        )
        res.json(taskUpdate)
    }
    catch {
        res.status(400)
    }
})

//Delete by id
router.delete('/delete/:id', async (req, res) => {
    try {
        const taskDelete = await task.findByIdAndDelete({ _id : req.params.id })
        res.json(taskDelete)
    }
    catch {
        res.status(400)
    }
    
})

module.exports = router