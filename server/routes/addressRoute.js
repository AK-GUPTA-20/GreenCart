import express from 'express';
import { addAddress, getAddress } from '../controllers/addressController.js';
import authUser from '../middleware/authUser.js';

const addressRouter = express.Router();

//* Add a new address - POST /api/address/add
addressRouter.post('/add',authUser, addAddress);

//* Get addresses by userId - GET /api/address/get
addressRouter.get('/get',authUser ,getAddress);

export default addressRouter;
