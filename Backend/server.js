const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));