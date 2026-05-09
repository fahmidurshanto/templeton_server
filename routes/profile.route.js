import express from 'express';
import {
    getFinancialSummary,
    getInvestmentReports,
    createOrUpdateInvestmentReport,
    getServiceStatus,
    getEntities,
    getMemberships,
    updateMembershipStatus,
    addMembership,
    removeMembership,
    getUserServices,
    updateUserServiceStatus,
    addUserService,
    removeUserService,
    changePassword
} from '../controllers/profile.controller.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Defined under /api/v1/user ...
router.post('/change-password', isAuthenticated, changePassword);
router.get('/financial-summary/:userId', isAuthenticated, getFinancialSummary);
router.get('/investment-reports/:userId', isAuthenticated, getInvestmentReports);
router.post('/investment-reports/:userId', isAuthenticated, isAdmin, createOrUpdateInvestmentReport);
router.get('/entities/:userId', isAuthenticated, getEntities);
router.get('/services/:userId', isAuthenticated, getServiceStatus);
router.get('/user-services/:userId', isAuthenticated, getUserServices);
router.patch('/user-services/:userId', isAuthenticated, isAdmin, updateUserServiceStatus);
router.post('/user-services/:userId', isAuthenticated, isAdmin, addUserService);
router.delete('/user-services/:userId', isAuthenticated, isAdmin, removeUserService);
router.get('/memberships/:userId', isAuthenticated, getMemberships);
router.patch('/memberships/:userId', isAuthenticated, isAdmin, updateMembershipStatus);
router.post('/memberships/:userId', isAuthenticated, isAdmin, addMembership);
router.delete('/memberships/:userId/:tierName', isAuthenticated, isAdmin, removeMembership);



export default router;
