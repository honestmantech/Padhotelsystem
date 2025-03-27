/**
 * API service for the hotel management system
 */

import type { Booking, Room, Guest, Payment, Staff } from "./models"
import { ApiError } from "./error-utils"

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Generic fetch function with error handling
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new ApiError(error.message || `API error: ${response.status} ${response.statusText}`, response.status)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(error instanceof Error ? error.message : "Unknown error occurred")
  }
}

// Room API
export const roomApi = {
  getAll: () => fetchApi<Room[]>("/rooms"),
  getById: (id: number) => fetchApi<Room>(`/rooms/${id}`),
  create: (room: Omit<Room, "id">) => fetchApi<Room>("/rooms", { method: "POST", body: JSON.stringify(room) }),
  update: (id: number, room: Partial<Room>) =>
    fetchApi<Room>(`/rooms/${id}`, { method: "PUT", body: JSON.stringify(room) }),
  delete: (id: number) => fetchApi<void>(`/rooms/${id}`, { method: "DELETE" }),
}

// Booking API
export const bookingApi = {
  getAll: () => fetchApi<Booking[]>("/bookings"),
  getById: (id: number) => fetchApi<Booking>(`/bookings/${id}`),
  create: (booking: Omit<Booking, "id" | "bookingId" | "createdAt">) =>
    fetchApi<Booking>("/bookings", { method: "POST", body: JSON.stringify(booking) }),
  update: (id: number, booking: Partial<Booking>) =>
    fetchApi<Booking>(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(booking) }),
  delete: (id: number) => fetchApi<void>(`/bookings/${id}`, { method: "DELETE" }),
  checkIn: (id: number) => fetchApi<Booking>(`/bookings/${id}/check-in`, { method: "POST" }),
  checkOut: (id: number) => fetchApi<Booking>(`/bookings/${id}/check-out`, { method: "POST" }),
}

// Guest API
export const guestApi = {
  getAll: () => fetchApi<Guest[]>("/guests"),
  getById: (id: number) => fetchApi<Guest>(`/guests/${id}`),
  create: (guest: Omit<Guest, "id">) => fetchApi<Guest>("/guests", { method: "POST", body: JSON.stringify(guest) }),
  update: (id: number, guest: Partial<Guest>) =>
    fetchApi<Guest>(`/guests/${id}`, { method: "PUT", body: JSON.stringify(guest) }),
  delete: (id: number) => fetchApi<void>(`/guests/${id}`, { method: "DELETE" }),
}

// Payment API
export const paymentApi = {
  getAll: () => fetchApi<Payment[]>("/payments"),
  getById: (id: number) => fetchApi<Payment>(`/payments/${id}`),
  create: (payment: Omit<Payment, "id">) =>
    fetchApi<Payment>("/payments", { method: "POST", body: JSON.stringify(payment) }),
  update: (id: number, payment: Partial<Payment>) =>
    fetchApi<Payment>(`/payments/${id}`, { method: "PUT", body: JSON.stringify(payment) }),
  delete: (id: number) => fetchApi<void>(`/payments/${id}`, { method: "DELETE" }),
}

// Staff API
export const staffApi = {
  getAll: () => fetchApi<Staff[]>("/staff"),
  getById: (id: number) => fetchApi<Staff>(`/staff/${id}`),
  create: (staff: Omit<Staff, "id">) => fetchApi<Staff>("/staff", { method: "POST", body: JSON.stringify(staff) }),
  update: (id: number, staff: Partial<Staff>) =>
    fetchApi<Staff>(`/staff/${id}`, { method: "PUT", body: JSON.stringify(staff) }),
  delete: (id: number) => fetchApi<void>(`/staff/${id}`, { method: "DELETE" }),
}

