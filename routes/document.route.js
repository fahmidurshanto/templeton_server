import express from 'express';
import {
    uploadDocument,
    getDocumentsByUser,
    viewDocument,
    deleteDocument,
    upload,
    getAllDocuments,
    updateViewExpiry
} from '../controllers/document.controller.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Defined under /api/v1/document ...
router.get('/getall', isAuthenticated, isAdmin, getAllDocuments);
router.post('/upload', isAuthenticated, upload.single('file'), uploadDocument);
router.get('/user/:userId', isAuthenticated, getDocumentsByUser);
router.get('/view/:id', isAuthenticated, viewDocument);
router.put('/expiry/:id', isAuthenticated, isAdmin, updateViewExpiry);
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteDocument);

export default router;
