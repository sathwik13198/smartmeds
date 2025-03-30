// storage.ts
import { User, Patient, Appointment, Medication, Prescription, ADRReport as AdrReport, ChatMessage } from './models';
import type { InsertUser, InsertPatient, InsertAppointment, InsertMedication, InsertPrescription, InsertAdrReport, InsertChatMessage } from '@shared/schema';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import type { Session } from 'express-session';

interface CustomSession extends Session {
  userId?: string;
}

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: InsertUser): Promise<any>;
  
  // Patient methods
  getPatient(id: string): Promise<any | undefined>;
  getAllPatients(): Promise<any[]>;
  createPatient(patient: InsertPatient): Promise<any>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<any | undefined>;
  
  // Appointment methods
  getAppointment(id: string): Promise<any | undefined>;
  getAppointmentsByDoctor(doctorId: string): Promise<any[]>;
  getAppointmentsByPatient(patientId: string): Promise<any[]>;
  getTodayAppointments(doctorId: string): Promise<any[]>;
  createAppointment(appointment: InsertAppointment): Promise<any>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<any | undefined>;
  deleteAppointment(id: string): Promise<void>;
  
  // Medication methods
  getMedication(id: string): Promise<any | undefined>;
  getAllMedications(): Promise<any[]>;
  createMedication(medication: InsertMedication): Promise<any>;
  
  // Prescription methods
  getPrescription(id: string): Promise<any | undefined>;
  getPrescriptionsByPatient(patientId: string): Promise<any[]>;
  getPrescriptionsByDoctor(doctorId: string): Promise<any[]>;
  createPrescription(prescription: InsertPrescription): Promise<any>;
  
  // ADR report methods
  getAdrReport(id: string): Promise<any | undefined>;
  getAllAdrReports(): Promise<any[]>;
  getRecentAdrReports(limit: number): Promise<any[]>;
  createAdrReport(report: InsertAdrReport): Promise<any>;
  
  // Chat message methods
  getChatMessages(userId: string, patientId?: string | null): Promise<any[]>;
  createChatMessage(message: InsertChatMessage): Promise<any>;
  
  // Session store
  sessionStore: session.Store;
  
  // Session verification
  verifySession(sessionId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new MemoryStore({checkPeriod: 86400000}) as session.Store;
  }

  async verifySession(sessionId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sessionStore.get(sessionId, (err: any, session?: CustomSession) => {
        if (err) {
          console.error('Session verification error:', err);          
          reject(new Error('Failed to verify session'));
          return;
        }
        
        if (!session) {
          resolve(null);
          return;
        }
        
        if (!session.userId) {
          resolve(null);
          return;
        }
        
        this.getUser(session.userId).then(resolve).catch(reject);
      });
    });
  }
  
  async getUser(id: string): Promise<any | undefined> {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user');
    }
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    try {
      return await User.findOne({ username });
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw new Error('Failed to get user by username');
    }
  }

  async createUser(userData: InsertUser): Promise<any> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.code === 11000) { // MongoDB duplicate key error code
        throw new Error('Username already exists');
      }
      throw new Error('Failed to create user');
    }
  }
  
  async getPatient(id: string): Promise<any | undefined> {
    try {
      return await Patient.findById(id);
    } catch (error) {
      console.error('Error getting patient:', error);
      throw new Error('Failed to get patient');
    }
  }
  
  async getAllPatients(): Promise<any[]> {
    try {
      return await Patient.find();
    } catch (error) {
      console.error('Error getting all patients:', error);
      throw new Error('Failed to get all patients');
    }
  }
  
  async createPatient(patientData: InsertPatient): Promise<any> {
    try {
      const patient = new Patient(patientData);
      return await patient.save();
    } catch (error) {
      console.error('Error creating patient:', error);
      throw new Error('Failed to create patient');
    }
  }
  
  async updatePatient(id: string, patientData: Partial<InsertPatient>): Promise<any | undefined> {
    try {
      return await Patient.findByIdAndUpdate(id, patientData, { new: true });
    } catch (error) {
      console.error('Error updating patient:', error);
      throw new Error('Failed to update patient');
    }
  }
  
  async getAppointment(id: string): Promise<any | undefined> {
    try {
      return await Appointment.findById(id);
    } catch (error) {
      console.error('Error getting appointment:', error);
      throw new Error('Failed to get appointment');
    }
  }
  
  async getAppointmentsByDoctor(doctorId: string): Promise<any[]> {
    try {
      return await Appointment.find({ doctorId });
    } catch (error) {
      console.error('Error getting appointments by doctor:', error);
      throw new Error('Failed to get appointments by doctor');
    }
  }
  
  async getAppointmentsByPatient(patientId: string): Promise<any[]> {
    try {
      return await Appointment.find({ patientId });
    } catch (error) {
      console.error('Error getting appointments by patient:', error);
      throw new Error('Failed to get appointments by patient');
    }
  }
  
  async getTodayAppointments(doctorId: string): Promise<any[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return await Appointment.find({
        doctorId,
        date: {
          $gte: today,
          $lt: tomorrow
        }
      });
    } catch (error) {
      console.error('Error getting today appointments:', error);
      throw new Error('Failed to get today appointments');
    }
  }
  
  async createAppointment(appointmentData: InsertAppointment): Promise<any> {
    try {
      const appointment = new Appointment(appointmentData);
      return await appointment.save();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Failed to create appointment');
    }
  }
  
  async updateAppointment(id: string, appointmentData: Partial<InsertAppointment>): Promise<any | undefined> {
    try {
      return await Appointment.findByIdAndUpdate(id, appointmentData, { new: true });
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error('Failed to update appointment');
    }
  }
  
  async deleteAppointment(id: string): Promise<void> {
    try {
      await Appointment.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw new Error('Failed to delete appointment');
    }
  }
  
  async getMedication(id: string): Promise<any | undefined> {
    try {
      return await Medication.findById(id);
    } catch (error) {
      console.error('Error getting medication:', error);
      throw new Error('Failed to get medication');
    }
  }
  
  async getAllMedications(): Promise<any[]> {
    try {
      return await Medication.find();
    } catch (error) {
      console.error('Error getting all medications:', error);
      throw new Error('Failed to get all medications');
    }
  }
  
  async createMedication(medicationData: InsertMedication): Promise<any> {
    try {
      const medication = new Medication(medicationData);
      return await medication.save();
    } catch (error) {
      console.error('Error creating medication:', error);
      throw new Error('Failed to create medication');
    }
  }
  
  async getPrescription(id: string): Promise<any | undefined> {
    try {
      return await Prescription.findById(id);
    } catch (error) {
      console.error('Error getting prescription:', error);
      throw new Error('Failed to get prescription');
    }
  }
  
  async getPrescriptionsByPatient(patientId: string): Promise<any[]> {
    try {
      return await Prescription.find({ patientId });
    } catch (error) {
      console.error('Error getting prescriptions by patient:', error);
      throw new Error('Failed to get prescriptions by patient');
    }
  }
  
  async getPrescriptionsByDoctor(doctorId: string): Promise<any[]> {
    try {
      return await Prescription.find({ doctorId });
    } catch (error) {
      console.error('Error getting prescriptions by doctor:', error);
      throw new Error('Failed to get prescriptions by doctor');
    }
  }
  
  async createPrescription(prescriptionData: InsertPrescription): Promise<any> {
    try {
      const prescription = new Prescription(prescriptionData);
      return await prescription.save();
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw new Error('Failed to create prescription');
    }
  }
  
  async getAdrReport(id: string): Promise<any | undefined> {
    try {
      return await AdrReport.findById(id);
    } catch (error) {
      console.error('Error getting ADR report:', error);
      throw new Error('Failed to get ADR report');
    }
  }
  
  async getAllAdrReports(): Promise<any[]> {
    try {
      return await AdrReport.find();
    } catch (error) {
      console.error('Error getting all ADR reports:', error);
      throw new Error('Failed to get all ADR reports');
    }
  }
  
  async getRecentAdrReports(limit: number): Promise<any[]> {
    try {
      return await AdrReport.find()
        .sort({ timestamp: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting recent ADR reports:', error);
      throw new Error('Failed to get recent ADR reports');
    }
  }
  
  async createAdrReport(reportData: InsertAdrReport): Promise<any> {
    try {
      const report = new AdrReport(reportData);
      return await report.save();
    } catch (error) {
      console.error('Error creating ADR report:', error);
      throw new Error('Failed to create ADR report');
    }
  }
  
  async getChatMessages(userId: string, patientId?: string | null): Promise<any[]> {
    try {
      const query = patientId ? { userId, patientId } : { userId };
      return await ChatMessage.find(query).sort({ timestamp: 1 });
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw new Error('Failed to get chat messages');
    }
  }
  
  async createChatMessage(messageData: InsertChatMessage): Promise<any> {
    try {
      const message = new ChatMessage(messageData);
      return await message.save();
    } catch (error) {
      console.error('Error creating chat message:', error);
      throw new Error('Failed to create chat message');
    }
  }
}

export const storage = new DatabaseStorage();

import { Router } from 'express';
import type { Types } from 'mongoose';
import type { Session, SessionData } from 'express-session';
import type { Document } from 'mongoose';
import type { Request, Response, Express } from 'express';
import passport from 'passport';
import WebSocket from 'ws';
import { Server } from 'http';
import { z } from 'zod';
import { setupAuth } from './auth';
import { storage } from './storage';
import { User } from './models';



interface AuthenticatedRequest extends Request {
  user: Document<unknown, {}, User> & Omit<User, keyof Document> & {
    id: string;
    _id: Types.ObjectId;
  };
  session: Session & Partial<SessionData> & {
    userId: string;
    passport: {
      user: string;
    };
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  const { authenticate, sessionParser } = setupAuth(app);
  if (!authenticate || !sessionParser) {
    throw new Error('Failed to initialize authentication middleware');
  }

  const apiRouter = Router();
  apiRouter.use(authenticate);

  app.use('/api', apiRouter);

  // Dashboard endpoints
  apiRouter.get('/dashboard/stats', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

      const [patients, appointments, adrReports, prescriptions] = await Promise.all([
        storage.getAllPatients(),
        storage.getTodayAppointments(req.user.id),
        storage.getAllAdrReports(),
        storage.getPrescriptionsByDoctor(req.user.id)
      ]);

      res.json({
        totalPatients: patients.length,
        todayAppointments: appointments.length,
        adrReports: adrReports.length,
        prescribedMedicines: prescriptions.length
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ message: 'Failed to load dashboard stats' });
    }
  });

  const server = new Server(app);
  return server;
}