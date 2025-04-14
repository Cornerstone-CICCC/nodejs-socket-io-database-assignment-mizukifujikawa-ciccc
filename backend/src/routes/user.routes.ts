import { Router } from 'express'
import userController from '../controllers/user.controller'
import { checkLoggedOut } from '../middleware/auth.middleware'

const userRouter = Router()

userRouter.post('/signup', checkLoggedOut, userController.addUser) // POST /users/signup
userRouter.post('/login', checkLoggedOut, userController.loginUser) // POST /users/login
userRouter.get('/logout', userController.logoutUser) // GET /users/logout
userRouter.get('/check-auth', userController.checkCookie) // GET /users/check-auth
userRouter.get('/:username', userController.getUserByUsername) // GET /users

export default userRouter