import express from 'express';
import {
    createRequest,
    getAllRequests,
    approveRequest,
    rejectRequest
} from '../controllers/profileUpdateRequest.controller.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', isAuthenticated, createRequest);
router.get('/', isAuthenticated, isAdmin, getAllRequests);
router.post('/approve/:id', isAuthenticated, isAdmin, approveRequest);
router.post('/reject/:id', isAuthenticated, isAdmin, rejectRequest);

export default router;
