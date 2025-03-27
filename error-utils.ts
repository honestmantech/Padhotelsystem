/**
 * Utility functions for error handling in the hotel management system
 */

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
  }
}

// Function to handle API errors
export const handleApiError = (error: unknown): { message: string; statusCode: number } => {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
    }
  }

  return {
    message: "An unknown error occurred",
    statusCode: 500,
  }
}

// Function to safely parse JSON
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.error('JSON Parse Error:', e);
    return fallback;
  }
};

