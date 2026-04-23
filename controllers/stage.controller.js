import QRCode from 'qrcode';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const stageJsonPath = path.join(__dirname, '../store/stage.json');
const liveTrackingPath = path.join(__dirname, '../store/live-tracking.json');

export const generateQRCode = catchAsync(async (req, res, next) => {
    // The URL that will be encoded in the QR code
    const { userId } = req.params;

    const qrCodeUrl = `${process.env.FRONTEND_URL}/verify?id=${userId}`;
    // Generate QR code with higher resolution (600px) to prevent blurriness
    const qrCodeImage = await QRCode.toDataURL(qrCodeUrl, {
        width: 600,
        margin: 2
    });

    return res.status(200).json({
        success: true,
        message: 'qrcode get successfully',

        qrCodeImage,
        qrCodeUrl
    })
});

export const verifyQRCode = catchAsync(async (req, res, next) => {
    const { id } = req.query;
    const { id: userId } = req.user;

    if (!id) {
        return next(new AppError('ID is required in query', 400));
    }

    // Verify if the authenticated user matches the ID from the QR code
    if (req.user.id.toString() === id.toString()) {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        user.stageVisibility = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'QR code verified successfully. Stage visibility enabled.',
            data: { id: user._id, stageVisibility: user.stageVisibility }
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Invalid QR code or unauthorized user'
        });
    }
});


export const addStage = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required' });
    }

    let stages = [];
    try {
        const data = await fs.readFile(stageJsonPath, 'utf8');
        if (data.trim() !== '') {
            stages = JSON.parse(data);
        }
    } catch (err) {
        // If file doesn't exist, we start with an empty array
    }

    if (!stages.includes(name)) {
        stages.push(name);
        await fs.writeFile(stageJsonPath, JSON.stringify(stages, null, 2));
    }

    return res.status(200).json({
        success: true,
        message: 'Stage processed successfully',
        data: stages
    });
});


export const getAllStage = catchAsync(async (req, res, next) => {
    let stages = [];
    try {
        const data = await fs.readFile(stageJsonPath, 'utf8');
        if (data.trim() !== '') {
            stages = JSON.parse(data);
        }
    } catch (err) {
        // If file doesn't exist, we start with an empty array
    }

    return res.status(200).json({
        success: true,
        message: 'Stage fetched successfully',
        data: stages
    });
});

export const deleteStage = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required' });
    }

    let stages = [];
    try {
        const data = await fs.readFile(stageJsonPath, 'utf8');
        if (data.trim() !== '') {
            stages = JSON.parse(data);
        }
    } catch (err) {
        // file doesn't exist
    }

    const initialLength = stages.length;
    stages = stages.filter(stage => stage !== name);

    if (stages.length === initialLength) {
        return res.status(404).json({ success: false, message: 'Stage not found' });
    }

    await fs.writeFile(stageJsonPath, JSON.stringify(stages, null, 2));

    return res.status(200).json({
        success: true,
        message: 'Stage deleted successfully',
        data: stages
    });
});

export const editStage = catchAsync(async (req, res, next) => {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
        return res.status(400).json({ success: false, message: 'Both oldName and newName are required' });
    }

    let stages = [];
    try {
        const data = await fs.readFile(stageJsonPath, 'utf8');
        if (data.trim() !== '') {
            stages = JSON.parse(data);
        }
    } catch (err) {
        // file doesn't exist
    }

    const index = stages.indexOf(oldName);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Stage not found' });
    }

    // Check if the new name already exists
    if (stages.includes(newName)) {
        return res.status(400).json({ success: false, message: 'New stage name already exists' });
    }

    stages[index] = newName;
    await fs.writeFile(stageJsonPath, JSON.stringify(stages, null, 2));

    return res.status(200).json({
        success: true,
        message: 'Stage updated successfully',
        data: stages
    });
});

export const getUserStage = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        stage: user.stage
    });
});

export const addUserStage = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { stage, description, remark, remarkLabel, status, time, date } = req.body;

    // Ensure we have some data
    const stageName = typeof stage === 'string' ? stage : stage.name;

    if (!stageName) {
        return next(new AppError('Please provide at least a stage name', 400));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check if stage already exists for the user
    const stageExists = user.stage.find(s => s.name.toLowerCase() === stageName.toLowerCase());
    if (stageExists) {
        return next(new AppError('Stage already exists on this user profile', 400));
    }

    // Calculate the next sequence number safely by finding the maximum sequence currently existing
    const maxSequence = user.stage.reduce((max, s) => Math.max(max, s.sequence || 0), 0);
    const nextSequence = maxSequence + 1;

    // Construct the new stage object using the destructured payload
    const newStage = {
        name: stageName,
        sequence: req.body.sequence !== undefined ? req.body.sequence : nextSequence,
        description: description || `Description for ${stageName}`,
        remark: remark || undefined,
        remarkLabel: remarkLabel || undefined,
        status: status || undefined,
        time: time || undefined,
        date: date || undefined
    };

    // Clean up undefined properties to not overwrite schema defaults accidentally
    Object.keys(newStage).forEach(key => newStage[key] === undefined && delete newStage[key]);

    user.stage.push(newStage);

    // Backward compatibility: patch any older stages that exist in the DB without the newly required 'description'
    user.stage.forEach(s => {
        if (!s.description) {
            s.description = `Legacy description for ${s.name}`;
        }
    });

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Stage added successfully',
        data: user.stage
    });
});

export const removeUserStage = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    // Grab the stage ID from the query string (?stage=...)
    const stageId = req.query.stage;

    if (!stageId) {
        return next(new AppError('Please provide a stage ID to remove', 400));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const initialLength = user.stage.length;

    // Filter out the specific stage by comparing its Object ID
    user.stage = user.stage.filter(s => s._id.toString() !== stageId.toString());

    if (user.stage.length === initialLength) {
        return next(new AppError('Stage not found on user profile', 404));
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Stage removed successfully',
        data: user.stage
    });
});

export const editUserStage = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const stageId = req.query.stage;

    if (!stageId) {
        return next(new AppError('Please provide a stageId to edit', 400));
    }

    const { stage, description, remark, remarkLabel, status, time, date } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const stageToUpdate = user.stage.find(s => s._id.toString() === stageId.toString());
    if (!stageToUpdate) {
        return next(new AppError('Stage not found on user profile', 404));
    }

    // Update the fields if they are provided
    if (stage) stageToUpdate.name = typeof stage === 'string' ? stage : stage.name;
    if (description !== undefined) stageToUpdate.description = description;
    if (remark !== undefined) stageToUpdate.remark = remark;
    if (remarkLabel !== undefined) stageToUpdate.remarkLabel = remarkLabel;
    if (status !== undefined) stageToUpdate.status = status;
    if (time !== undefined) stageToUpdate.time = time;
    if (date !== undefined) stageToUpdate.date = date;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Stage updated successfully',
        data: user.stage
    });
});

export const reorderUserStage = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { stages } = req.body; // Expecting an array of stage IDs in the new order

    if (!Array.isArray(stages)) {
        return next(new AppError('Please provide an array of stage IDs', 400));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Reorder the user.stage array based on the provided IDs and update sequences
    const reorderedStages = stages.map((id, index) => {
        const stage = user.stage.id(id);
        if (stage) {
            stage.sequence = index + 1;
            return stage;
        }
        return null;
    }).filter(s => s !== null);

    // If some stages were not found, we might have an issue, but we'll proceed for now
    // Or we can just set the user.stage to the reordered list if it covers all stages
    user.stage = reorderedStages;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Stages reordered successfully',
        data: user.stage
    });
});

export const reorderGlobalStages = catchAsync(async (req, res, next) => {
    const { stages } = req.body;

    if (!Array.isArray(stages)) {
        return next(new AppError('Please provide an array of stage names', 400));
    }

    try {
        await fs.writeFile(stageJsonPath, JSON.stringify(stages, null, 2));
    } catch (err) {
        return next(new AppError('Failed to save reordered stages', 500));
    }

    res.status(200).json({
        success: true,
        message: 'Global stages reordered successfully',
        data: stages
    });
});

export const getLiveTracking = catchAsync(async (req, res, next) => {
    let stages = [];
    try {
        const data = await fs.readFile(liveTrackingPath, 'utf8');
        if (data.trim() !== '') stages = JSON.parse(data);
    } catch (err) {}

    res.status(200).json({ success: true, data: stages });
});

export const updateLiveTracking = catchAsync(async (req, res, next) => {
    const { stages } = req.body;
    if (!Array.isArray(stages)) return next(new AppError('Invalid data', 400));

    await fs.writeFile(liveTrackingPath, JSON.stringify(stages, null, 2));

    res.status(200).json({ success: true, message: 'Live tracking updated', data: stages });
});