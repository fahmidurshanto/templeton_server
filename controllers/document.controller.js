import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Document from '../models/document.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Create unique filename: originalName-timestamp.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

export const upload = multer({ storage: storage });

// Helper: convert bytes to readable size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Upload document controller
export const uploadDocument = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload a file'
        });
    }

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }

    const document = await Document.create({
        name: req.file.originalname || req.file.filename,
        path: req.file.path,
        user: userId,
        size: formatFileSize(req.file.size)
    });

    res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        document
    });
});

// View document (Owner one-time, Admin always)
export const viewDocument = catchAsync(async (req, res, next) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        return next(new AppError('Document not found', 404));
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = document.user.toString() === req.user.id.toString();

    // Check access permissions
    if (!isAdmin && !isOwner) {
        return next(new AppError('You do not have permission to view this document', 403));
    }

    if (isOwner && !isAdmin) {
        if (document.viewExpiry) {
            if (new Date() > document.viewExpiry) {
                return next(new AppError('The view duration for this document has expired', 403));
            }
        } else if (document.hasUserSeen) {
            return next(new AppError('You cannot see a document more than once', 403));
        }
    }

    // Resolve absolute path for res.sendFile
    const absolutePath = path.resolve(document.path);

    if (!fs.existsSync(absolutePath)) {
        return next(new AppError('File not found on server', 404));
    }

    // If it's the owner viewing and no viewExpiry is set, mark as seen
    if (isOwner && !isAdmin && !document.viewExpiry && !document.hasUserSeen) {
        document.hasUserSeen = true;
        await document.save();
    }

    // Serve the file
    res.sendFile(absolutePath);
});

// Delete document controller (Admin only)
export const deleteDocument = catchAsync(async (req, res, next) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        return next(new AppError('Document not found', 404));
    }

    // Delete file from disk
    if (fs.existsSync(document.path)) {
        fs.unlinkSync(document.path);
    }

    await document.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Document deleted successfully'
    });
});

// Get all documents for a user (Admin for any user, User for themselves)
export const getDocumentsByUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    if (!userId) {
        return next(new AppError('User ID is required', 400));
    }

    // Allow if admin OR if the user is requesting their own documents
    const isAdmin = req.user.role === 'admin';
    const isOwner = String(req.user.id) === String(userId);

    if (!isAdmin && !isOwner) {
        return next(new AppError('You do not have permission to view these documents', 403));
    }

    let documents = await Document.find({ user: userId }).sort({ createdAt: -1 });

    documents = documents.map(doc => {
        const docObj = doc.toObject();
        if (docObj.viewExpiry) {
            docObj.hasExpired = new Date() > new Date(docObj.viewExpiry);
        } else {
            docObj.hasExpired = false;
        }
        return docObj;
    });

    res.status(200).json({
        success: true,
        isOwner,
        count: documents.length,
        documents
    });
});

// Get all documents by id from query params
export const getAllDocuments = catchAsync(async (req, res, next) => {
    const userId = req.query.id;

    if (!userId) {
        return next(new AppError('User ID is required in query parameters (e.g., ?id=...)', 400));
    }

    const documents = await Document.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: documents.length,
        documents
    });
});

// Update viewExpiry controller (Admin only)
export const updateViewExpiry = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { days } = req.body;

    if (days === undefined || days === null || isNaN(days)) {
        return next(new AppError('Please provide a valid number of days', 400));
    }

    const document = await Document.findById(id);

    if (!document) {
        return next(new AppError('Document not found', 404));
    }

    // Calculate expiry date: current date + days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Number(days));

    document.viewExpiry = expiryDate;
    await document.save();

    res.status(200).json({
        success: true,
        message: `View expiry updated to ${Number(days)} days from now`,
        viewExpiry: document.viewExpiry
    });
});
