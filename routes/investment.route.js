import express from 'express';
import { 
    createInvestment, 
    getInvestment, 
    getInvestmentById, 
    setInvestmentValidity 
} from '../controllers/investment.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

// Defined under /api/v1/investment ...
router.post('/create', isAuthenticated, createInvestment);
router.post('/validity', isAuthenticated, setInvestmentValidity);
router.get('/get', isAuthenticated, getInvestment);
router.get('/get/:investmentId', isAuthenticated, getInvestmentById);

export default router;
