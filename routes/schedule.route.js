import express from 'express';
import { 
    createSchedule, 
    deleteSchedule, 
    getCurrentWeekSchedules, 
    getPastSchedules, 
    getSchedulesByUser, 
    getUpcomingSchedules, 
    getSchedulesByUserAdmin, 
    getAllSchedulesAdmin 
} from '../controllers/schedule.controller.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Defined under /api/v1/schedule ...
router.post('/create', isAuthenticated, isAdmin, createSchedule);
router.get('/my', isAuthenticated, getSchedulesByUser);
router.delete('/:id', isAuthenticated, isAdmin, deleteSchedule);
router.get('/current-week', isAuthenticated, getCurrentWeekSchedules);
router.get('/upcoming', isAuthenticated, getUpcomingSchedules);
router.get('/past', isAuthenticated, getPastSchedules);
router.get('/user/:userId', isAuthenticated, isAdmin, getSchedulesByUserAdmin);
router.get('/admin/all', isAuthenticated, isAdmin, getAllSchedulesAdmin);

export default router;
