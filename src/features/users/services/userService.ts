import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { prisma } from '../../../config/database'
import { HttpException } from '../../../utils/HttpExceptions'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

export async function registerUser(email: string, username: string, password: string) {
  try {
    // Check for existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      throw new Error('A user with this email or username already exists')
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the new user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    })

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    })

    return token
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Prisma-specific unique constraint error
      throw new Error('A user with this email or username already exists')
    }
    throw error // Re-throw other errors
  }
}


export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials')
  }
  return generateToken(user.id)
}

function generateToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET as string, { expiresIn: '24h' })
}

export async function getUserById(userId: string){
    if (!userId) {
      throw new HttpException(400, 'User ID is required.');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        articles: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException(404, `User with ID "${userId}" not found.`);
    }

    return user;
  }


  export async function getUserByToken(token: string) {
    if (!token) {
      throw new HttpException(400, 'Token is required.')
    }

    try {
      // Verify and decode the JWT token
      const decoded = jwt.verify(token, JWT_SECRET as string) as { id: string }

      if (!decoded || !decoded.id) {
        throw new HttpException(401, 'Invalid token.')
      }

      // Fetch user details by ID
      const user = await getUserById(decoded.id)

      return user
    } catch (error: any) {
      throw new HttpException(401, 'Invalid or expired token.')
    }
  }
