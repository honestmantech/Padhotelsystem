/**
 * Utility functions for authentication in the hotel management system
 */

// User roles
export enum UserRole {
  ADMIN = "admin",
  RECEPTIONIST = "receptionist",
  ACCOUNTANT = "accountant",
  GUEST = "guest",
}

// User interface
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

// Function to check if user has required role
export function hasRequiredRole(user: User | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false
  return requiredRoles.includes(user.role)
}

// Function to get role-based dashboard path
export function getRoleDashboardPath(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "/dashboard"
    case UserRole.RECEPTIONIST:
      return "/dashboard/bookings"
    case UserRole.ACCOUNTANT:
      return "/dashboard/finance"
    case UserRole.GUEST:
      return "/dashboard/my-bookings"
    default:
      return "/dashboard"
  }
}

// Mock authentication function (replace with real auth in production)
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // This is just for demo purposes - in a real app, you'd validate against a database
  const users: Record<string, User & { password: string }> = {
    "admin@paddysview.com": {
      id: "1",
      name: "Admin User",
      email: "admin@paddysview.com",
      password: "admin123",
      role: UserRole.ADMIN,
    },
    "receptionist@paddysview.com": {
      id: "2",
      name: "Reception Staff",
      email: "receptionist@paddysview.com",
      password: "reception123",
      role: UserRole.RECEPTIONIST,
    },
    "accountant@paddysview.com": {
      id: "3",
      name: "Finance Staff",
      email: "accountant@paddysview.com",
      password: "account123",
      role: UserRole.ACCOUNTANT,
    },
    "guest@example.com": {
      id: "4",
      name: "Guest User",
      email: "guest@example.com",
      password: "guest123",
      role: UserRole.GUEST,
    },
  }

  const user = users[email]
  if (user && user.password === password) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  return null
}

