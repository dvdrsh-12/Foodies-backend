const mongoose = require('mongoose');
async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to mongodb");
        try {
            const fetched_data = await mongoose.connection.db.collection("food_items").find({}).toArray();
            const food_category = await mongoose.connection.db.collection("food_category").find({}).toArray();
            global.food_items = fetched_data;
            global.food_category = food_category;
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
        }

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

module.exports = connectToMongoDB;
