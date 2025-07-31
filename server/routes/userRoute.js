import express from 'express';
import { getUserProfile, isAuth, loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/logout',logoutUser)
userRouter.get('/is-auth',authUser,isAuth)
userRouter.get('/get-profile',authUser,getUserProfile)


export default userRouter;