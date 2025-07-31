import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/ProductRoutes.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhook } from './controllers/orderController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()

// Stripe webhook MUST be before express.json()
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

// Middleware configuration
app.use(express.json());
app.use(cookieParser());

// Simple CORS - Allow all origins in development, specific in production
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: [
      'https://greencart-frontend-indol.vercel.app'
    ],
    credentials: true
  }));
} else {
  app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4000'
    ],
    credentials: true
  }));
}

// API Routes
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});