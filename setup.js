#!/usr/bin/env node

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

// Print colored message
function printMessage(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

// Execute command and print output
function executeCommand(command) {
  printMessage(`\n> ${command}`, colors.cyan)
  try {
    execSync(command, { stdio: "inherit" })
    return true
  } catch (error) {
    printMessage(`Error executing command: ${command}`, colors.red)
    return false
  }
}

// Main setup function
async function setup() {
  printMessage("\n🏨 Setting up Paddy's View Hotel Management System...", colors.bright + colors.magenta)

  // Check Node.js version
  printMessage("\n📋 Checking environment...", colors.bright + colors.blue)
  const nodeVersion = process.version
  printMessage(`Node.js version: ${nodeVersion}`, colors.green)

  // Install dependencies
  printMessage("\n📦 Installing dependencies...", colors.bright + colors.blue)
  if (!executeCommand("npm install")) {
    printMessage("Failed to install dependencies. Please try again.", colors.red)
    process.exit(1)
  }

  // Create .env.local if it doesn't exist
  printMessage("\n🔧 Setting up environment variables...", colors.bright + colors.blue)
  const envExamplePath = path.join(process.cwd(), ".env.example")
  const envLocalPath = path.join(process.cwd(), ".env.local")

  if (!fs.existsSync(envLocalPath) && fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envLocalPath)
    printMessage("Created .env.local file from .env.example", colors.green)
  } else if (!fs.existsSync(envLocalPath)) {
    fs.writeFileSync(envLocalPath, "# Environment Variables\nNEXT_PUBLIC_API_URL=http://localhost:3000/api\n")
    printMessage("Created basic .env.local file", colors.green)
  }

  // Run development server
  printMessage("\n🚀 Starting development server...", colors.bright + colors.blue)
  printMessage("The hotel management system will be available at http://localhost:3000", colors.yellow)
  executeCommand("npm run dev")
}

// Run setup
setup().catch((error) => {
  console.error("Setup failed:", error)
  process.exit(1)
})

