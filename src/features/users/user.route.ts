import { Router } from 'express'
import { getUserDetails, login, register } from './user.controller'
import { validateRequest } from '../../middlewares/validaterequest.middleware'
import { loginValidationSchema, registerValidationSchema } from '../../validations/user.validation'
import { authenticate } from '../../middlewares/auth.middleware'

const router = Router()

// Define routes
router.post('/register', validateRequest(registerValidationSchema), register)
router.post('/login', validateRequest(loginValidationSchema), login)
router.get('/me', authenticate, getUserDetails)

export { router as UserRoutes }
