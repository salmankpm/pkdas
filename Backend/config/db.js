const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Automatically drop conflicting stale username index if it exists
    try {
      const db = mongoose.connection.db;
      const collection = db.collection("users");
      const indexes = await collection.indexes();
      if (indexes.some(idx => idx.name === "username_1")) {
        await collection.dropIndex("username_1");
        console.log("Stale index 'username_1' dropped successfully");
      }
    } catch (indexError) {
      console.log("Error checking/dropping stale username index:", indexError.message);
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;