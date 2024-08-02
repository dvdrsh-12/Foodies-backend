const express = require('express');
const router = express.Router();
const order = require('../models/orders');

router.post('/myorderData', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const myData = await order.findOne({ email });
        if (!myData) {
            return res.status(404).json({ message: "No orders found for this email" });
        }
        res.json({ orderData: myData });
    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
