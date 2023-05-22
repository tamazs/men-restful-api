const express = require('express');
const router = express.Router();
const task = require('../models/task');
const user = require('../models/user');
const project = require('../models/project')
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
        const { title, detail, assignedTo, projectID } = req.body;

        // Find the user by email
        const assignedToUser = await user.findOne({ email: assignedTo });

        if (!assignedToUser) {
            return res.status(404).json({ message: 'Assigned user not found' });
        }

        // Check if the assigned user is a member of the project
        const projects = await project.findOne({ _id: projectID, members: assignedToUser._id });
        if (!projects) {
            return res.status(400).json({ message: 'Assigned user is not a member of the project' });
        }

        const newTask = new task({
            title,
            detail,
            assignedTo: assignedToUser._id,
            projectID
        });

        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (err) {
        res.status(400).send({
            message: err.message
        });
    }
});

//Get by id
router.get('/get/:id/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;

        // Fetch the task
        const tasks = await task.findById(taskId);

        if (!tasks) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const assignedTo = tasks.assignedTo;

        // Fetch the user's email based on the assignedTo ID
        const userObj = await user.findById(assignedTo);
        const assignedToEmail = userObj.email;

        // Update the tasks object with the assignedToEmail field
        const updatedTasks = tasks.toObject();
        updatedTasks.assignedToEmail = assignedToEmail;

        res.json(updatedTasks);
    } catch (err) {
        res.status(400).send({
            message: err.message
        });
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
router.get("/:projectId/user/:userId", verifyToken, async (req, res) => {
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
        const taskId = req.params.id;
        const { title, detail, assignedTo, state } = req.body;

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (detail) updatedFields.detail = detail;
        if (state) updatedFields.state = state;

        if (assignedTo) {
            const assignedUser = await user.findOne({ email: assignedTo });
            if (!assignedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Get the projectID from the existing task
            const existingTask = await task.findById(taskId);
            if (!existingTask) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // Check if the assigned user is a member of the project
            const projects = await project.findOne({ _id: existingTask.projectID, members: assignedUser._id });
            if (!projects) {
                return res.status(400).json({ message: 'Assigned user is not a member of the project' });
            }

            updatedFields.assignedTo = assignedUser._id;
        }

        const taskUpdate = await task.findByIdAndUpdate(
            { _id: taskId },
            { $set: updatedFields },
            { new: true } // To return the updated task document
        );

        res.json(taskUpdate);
    } catch (err) {
        res.status(400).send({
            message: err.message
        });
    }
});



//Update task state by taskID
router.put('/updateState/:projectId/:id/:state', verifyToken, async (req, res) => {
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