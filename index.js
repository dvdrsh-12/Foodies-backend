require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const connectToMongoDB = require("./db");
connectToMongoDB();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://foodiesdmr.vercel.app");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-type,Accept"
    );
    next();
});
app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.use(express.json());
app.use("/api", require("./routes/createUser"));
app.use("/api", require("./routes/displayData"));
app.use("/api", require("./routes/orderData"));
app.use("/api", require("./routes/myorderData"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})