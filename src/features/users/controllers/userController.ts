import { NextFunction, Request, Response } from 'express'
import { registerUser, loginUser, getUserByToken } from '../services/userService'

export async function register(req: Request, res: Response) {
  const { email, username, password } = req.body
  try {
    const token = await registerUser(email, username, password)
    res.status(200).send({ token })
  } catch (error: any) {
    res.status(400).send({ message: 'Registration failed', error: error.message })
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  try {
    const token = await loginUser(email, password)
    res.status(200).send({ token })
  } catch (error: any) {
    res.status(400).send({ message: 'Login failed', error: error.message })
  }
}


export const getUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1] // Extract token from Authorization header

    if (!token) {
      res.status(400).json({ message: 'Token is required.' })
      return
    }

    const user = await getUserByToken(token)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}