const express = require('express');
const router = express.Router();
const user = require("../models/user");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post("/createUser", [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'password length low').isLength({ min: 5 }),
    body('name', 'name length low').isLength({ min: 5 }),
]

    , async (req, res) => {
        console.log("hello")
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt);
        try {
            await user.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
                location: req.body.location
            });
            const authToken = jwt.sign(req.body.email, process.env.JWT_SECRET);
            return res.json({ success: true, authToken: authToken, email: req.body.email });
        } catch (error) {
            console.log("Error occured", error);
            res.json({ success: false });
        }
    });

router.post("/loginUser", [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'password length low').isLength({ min: 5 }),
]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let email = req.body.email;
            let userData = await user.findOne({ email });
            if (!userData) {
                return res.status(400).json({ errors: "Incorrect email" });
            }
            const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
            if (!pwdCompare) {
                return res.status(400).json({ errors: "Incorrect password" });
            }
            const data = userData.email;
            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            return res.json({ success: true, authToken: authToken, email: email });
        } catch (error) {
            console.log("Error occured", error);
            res.json({ success: false });
        }
    });
module.exports = router;