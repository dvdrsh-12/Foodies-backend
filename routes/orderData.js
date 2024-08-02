const express = require('express');
const router = express.Router();
const order = require('../models/orders');
router.post('/orderData', async (req, res) => {
    let data = req.body.order_data
    await data.splice(0, 0, { Order_date: req.body.order_date })
    let eId = await order.findOne({ 'email': req.body.email })
    if (eId === null) {
        try {
            req.body.email
            await order.create({
                email: req.body.email,
                order_data: [data]
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {

            res.send("Server error", error.message)
        }
    }

    else {
        try {
            await order.findOneAndUpdate({ email: req.body.email },
                { $push: { order_data: data } }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            res.send("Server Error", error.message)
        }
    }
})


module.exports = router;