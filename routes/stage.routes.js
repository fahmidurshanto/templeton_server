import express from 'express';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware.js';
import { addStage, getAllStage, generateQRCode, verifyQRCode, getUserStage, addUserStage, removeUserStage, editUserStage, deleteStage, editStage, reorderUserStage, reorderGlobalStages, getLiveTracking, updateLiveTracking } from '../controllers/stage.controller.js';

const router = express.Router();

// Defined under /api/v1/investment ...
router.get('/verify',isAuthenticated, verifyQRCode);
router.post('/generateqrcode/:userId', isAuthenticated,isAdmin, generateQRCode);


 // stage routes for admin
router.post('/add',isAuthenticated,isAdmin, addStage);
router.delete('/delete',isAuthenticated,isAdmin, deleteStage);
router.put('/edit',isAuthenticated,isAdmin, editStage);
router.put('/reorder', isAuthenticated, isAdmin, reorderGlobalStages);
router.get('/getall',isAuthenticated,isAdmin, getAllStage);

// Live Tracking routes
router.get('/live', isAuthenticated, isAdmin, getLiveTracking);
router.put('/live', isAuthenticated, isAdmin, updateLiveTracking);

// User-specific stage routes (maps to /api/v1/stage/user/:userId)
router.get('/user/:userId',isAuthenticated, getUserStage);
router.post('/user/:userId',isAuthenticated,isAdmin, addUserStage);
router.delete('/user/:userId',isAuthenticated,isAdmin, removeUserStage);
router.put('/user/:userId',isAuthenticated,isAdmin, editUserStage);
router.put('/user/:userId/reorder', isAuthenticated, isAdmin, reorderUserStage);


export default router;
