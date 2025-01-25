import dotenv from 'dotenv'
import app from './app'
import { prisma } from './config/database'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 5000

// Start the server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('Database connected successfully')

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Error starting server:', error)
    process.exit(1)
  }
}

startServer()
