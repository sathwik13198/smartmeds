import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, default: 'doctor' },
  specialty: String,
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Patient Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirth: Date,
  phone: String,
  address: String,
  healthStatus: { type: String, default: 'stable' },
  lastVisit: Date,
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: String,
  status: { type: String, default: 'scheduled' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Medication Schema
const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  dosage: String,
  sideEffects: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Prescription Schema
const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medications: [{
    medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
    dosage: String,
    frequency: String,
    duration: String
  }],
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ADR Report Schema
const adrReportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: [String],
  severity: { type: String, required: true },
  onset: Date,
  status: { type: String, default: 'reported' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export models
export const User = mongoose.model('User', userSchema);
export const Patient = mongoose.model('Patient', patientSchema);
export const Appointment = mongoose.model('Appointment', appointmentSchema);
export const Medication = mongoose.model('Medication', medicationSchema);
export const Prescription = mongoose.model('Prescription', prescriptionSchema);
export const ADRReport = mongoose.model('ADRReport', adrReportSchema);

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  role: { type: String, required: true, enum: ['system', 'user', 'assistant'] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);