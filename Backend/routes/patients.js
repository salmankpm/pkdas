const router = require("express").Router();
const Patient = require("../models/Patient");
const { protect, authorize } = require("../middleware/auth");

// GET all — admin + receptionist
router.get("/", protect, authorize("admin", "receptionist"), async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add — receptionist + admin
router.post("/add", protect, authorize("admin", "receptionist"), async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    const patient = await Patient.create({ name, age, gender });
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update — receptionist + admin
router.put("/update/:id", protect, authorize("admin", "receptionist"), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    patient.name = req.body.name;
    patient.age = req.body.age;
    patient.gender = req.body.gender;
    await patient.save();
    res.json({ message: "Patient updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE — admin + receptionist
router.delete("/delete/:id", protect, authorize("admin", "receptionist"), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;