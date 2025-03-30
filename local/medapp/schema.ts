import { z } from 'zod';
import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, default: 'doctor' },
  specialty: String,
  profileImage: String
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
  profileImage: String
});

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: String,
  status: { type: String, default: 'scheduled' },
  notes: String
});

// Medication Schema
const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  dosage: String,
  sideEffects: String
});

// Prescription Schema
const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  datePrescribed: { type: Date, required: true },
  instructions: String,
  duration: String
});

// ADR Report Schema
const adrReportSchema = new mongoose.Schema({
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  source: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: Number, min: 1, max: 5 },
  timestamp: { type: Date, default: Date.now },
  sentiment: String
});

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  message: { type: String, required: true },
  role: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create models
export const User = mongoose.model('User', userSchema);
export const Patient = mongoose.model('Patient', patientSchema);
export const Appointment = mongoose.model('Appointment', appointmentSchema);
export const Medication = mongoose.model('Medication', medicationSchema);
export const Prescription = mongoose.model('Prescription', prescriptionSchema);
export const AdrReport = mongoose.model('AdrReport', adrReportSchema);
export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  fullName: z.string(),
  email: z.string(),
  role: z.string(),
  specialty: z.string().optional(),
  profileImage: z.string().optional()
});

export const insertPatientSchema = z.object({
  name: z.string(),
  email: z.string(),
  dateOfBirth: z.date().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  healthStatus: z.string().optional(),
  lastVisit: z.date().optional(),
  profileImage: z.string().optional()
});

export const insertAppointmentSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  date: z.date(),
  time: z.string(),
  reason: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional()
});

export const insertMedicationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  dosage: z.string().optional(),
  sideEffects: z.string().optional()
});

export const insertPrescriptionSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  medicationId: z.string(),
  datePrescribed: z.date(),
  instructions: z.string().optional(),
  duration: z.string().optional()
});

export const insertAdrReportSchema = z.object({
  medicationId: z.string(),
  source: z.string(),
  description: z.string(),
  severity: z.number().min(1).max(5).optional(),
  sentiment: z.string().optional()
});

export const insertChatMessageSchema = z.object({
  userId: z.string().optional(),
  patientId: z.string().optional(),
  message: z.string(),
  role: z.string()
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type InsertAdrReport = z.infer<typeof insertAdrReportSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
