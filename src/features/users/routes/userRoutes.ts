import { Router } from 'express';
import { getUserDetails, login, register } from '../controllers/userController';
import { validateRequest } from '../../../middlewares/ValidateRequest';
import { loginValidationSchema, registerValidationSchema } from '../../../validations/userValidation';
import { authenticate } from '../../../middlewares/authenticate';

const router = Router();

// Define routes
router.post('/register', validateRequest(registerValidationSchema), register);
router.post('/login', validateRequest(loginValidationSchema), login); 
router.get('/me', authenticate, getUserDetails)

export { router as UserRoutes };
