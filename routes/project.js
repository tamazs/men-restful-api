const router = require("express").Router();
const project = require("../models/project");
const user = require("../models/user")
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
router.get("/:userId", verifyToken, async (req, res) => {
    const userId = req.params.userId;

    try {
        let ownedProjects = await project.find().where('ownerID').equals(userId).distinct('_id');
        let invitedProjects = await project.find().where('members').in([userId]).distinct('_id');

        let projectIds = [...ownedProjects, ...invitedProjects];
        let projects = await project.find().where('_id').in(projectIds);

        res.send(projects);
    } catch (err) {
        res.status(400).send({
            message: err.message
        });
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

router.put('/add-member/:id', verifyToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        const memberEmail = req.body.memberEmail;

        const projects = await project.findById(projectId);
        if (!projects) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const member = await user.findOne({ email: memberEmail });
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Check if the member is already added to the project
        const existingMember = projects.members.find(existingMember => existingMember.toString() === member._id.toString());
        if (existingMember) {
            return res.status(400).json({ message: 'Member already added to the project' });
        }

        projects.members.push(member._id);
        await projects.save();

        res.status(200).json({ message: 'Member added successfully' });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
});


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

router.get('/members/:id', verifyToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        const projects = await project.findById(projectId).populate('members', '_id name email');
        if (!projects) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Extract member information from the project
        const members = projects.members.map(member => ({ id: member._id, name: member.name, email: member.email }));

        res.status(200).json({ members });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
});

router.get('/members/:id/:memberId', verifyToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        const memberId = req.params.memberId

        const projects = await project.findById(projectId).populate('members', 'name email');
        if (!projects) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const member = projects.members.find(member => member._id.toString() === memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.status(200).json({ member });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
});

router.delete('/delete-member/:id/:memberId', verifyToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        const memberId = req.params.memberId;
        const projects = await project.findById(projectId);
        if (!projects) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Find the index of the member with the given memberId
        const memberIndex = projects.members.findIndex(member => member._id.toString() === memberId);
        if (memberIndex === -1) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Remove the member from the members array
        projects.members.splice(memberIndex, 1);
        await projects.save();

        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
});

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