const router = require("express").Router();
const Appointment = require("../models/Appointment");
const { protect, authorize } = require("../middleware/auth");

// GET all — all roles
router.get("/", protect, authorize("admin", "doctor", "receptionist"), async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add — receptionist + admin
router.post("/add", protect, authorize("admin", "receptionist"), async (req, res) => {
  try {
    const { patientName, doctorName, date } = req.body;
    const appointment = await Appointment.create({ patientName, doctorName, date });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update fields — receptionist + admin
router.put("/update/:id", protect, authorize("admin", "receptionist"), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    appointment.patientName = req.body.patientName || appointment.patientName;
    appointment.doctorName = req.body.doctorName || appointment.doctorName;
    appointment.date = req.body.date || appointment.date;
    await appointment.save();
    res.json({ message: "Appointment updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH approve/reject — doctor + admin
router.patch("/status/:id", protect, authorize("admin", "doctor"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status))
      return res.status(400).json({ message: "Invalid status" });
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    appointment.status = status;
    await appointment.save();
    res.json({ message: `Appointment ${status}`, appointment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE — admin only
router.delete("/delete/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;