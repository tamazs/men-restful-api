const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');

//registration
router.post("/register", async(req, res) => {
    //validate user input
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0] });
    }

    //check if email is already registered
    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist) {
        return res.status(400).json({ error: "Email already exists" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    //create user object and save in DB
    const userObject = new User({
        name: req.body.name,
        email: req.body.email,
        password
    });

    try {
        const savedUser = await userObject.save();
        res.json({ error: null, data: savedUser._id });
    } catch (error) {
        res.status(400).json({ error })
    }
});

//login
router.post("/login", async(req, res) => {
    //validate user login info
    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    //if login info is valid, find the user
    const user = await User.findOne({ email: req.body.email });

    //throw error if email is wrong (user doesnt exist in DB)
    if (!user) {
        return res.status(400).json({ error: "User doesnt exist" });
    }

    //user exists - check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)

    //throw error if password is wrong
    if (!validPassword) {
        return res.status(400).json({ error: "Wrong password" });
    }

    //create authentication token with username and id
    const token = jwt.sign({
        name: user.name,
        id: user._id,
        email: user.email,
        userType: user.userType
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }    
    );

    //attach auth token to header
    res.header("auth-token", token).json({
        error: null,
        data: { token },
        name: user.name,
        id: user._id,
        userType: user.userType
    });
})

module.exports = router;