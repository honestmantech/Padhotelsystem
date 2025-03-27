/**
 * Data models for the hotel management system
 */

// Room Types
export enum RoomType {
  STANDARD = "Standard",
  DELUXE = "Deluxe",
  SUITE = "Suite",
  EXECUTIVE = "Executive",
}

// Room Status
export enum RoomStatus {
  VACANT = "vacant",
  OCCUPIED = "occupied",
  MAINTENANCE = "maintenance",
}

// Cleaning Status
export enum CleaningStatus {
  CLEAN = "clean",
  PENDING = "pending",
}

// Maintenance Status
export enum MaintenanceStatus {
  NONE = "none",
  ACTIVE = "active",
}

// Booking Status
export enum BookingStatus {
  CONFIRMED = "confirmed",
  PENDING = "pending",
  CANCELLED = "cancelled",
  CHECKED_IN = "checked-in",
  CHECKED_OUT = "checked-out",
}

// Payment Status
export enum PaymentStatus {
  PAID = "paid",
  PENDING = "pending",
  REFUNDED = "refunded",
}

// Room Model
export interface Room {
  id: number
  number: string
  type: RoomType
  floor: string
  status: RoomStatus
  guest: string
  checkIn: string
  checkOut: string
  cleaningStatus: CleaningStatus
  maintenanceStatus: MaintenanceStatus
  notes: string
}

// Booking Model
export interface Booking {
  id: number
  bookingId: string
  guest: string
  email: string
  phone: string
  roomType: RoomType
  roomNumber: string
  checkIn: string
  checkOut: string
  status: BookingStatus
  adults: number
  children: number
  totalAmount: number
  paymentStatus: PaymentStatus
  createdAt: string
  additionalCharges?: number
  additionalChargesDescription?: string
}

// Guest Model
export interface Guest {
  id: number
  name: string
  email: string
  phone: string
  address: string
  idType: string
  idNumber: string
  nationality: string
  visits: number
  lastVisit: string
  notes: string
}

// Staff Model
export interface Staff {
  id: number
  name: string
  email: string
  phone: string
  position: string
  department: string
  joinDate: string
  status: "active" | "inactive"
}

// Payment Model
export interface Payment {
  id: number
  bookingId: string
  amount: number
  method: string
  status: PaymentStatus
  transactionId: string
  date: string
  notes: string
}

