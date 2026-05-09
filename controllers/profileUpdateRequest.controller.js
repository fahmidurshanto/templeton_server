import ProfileUpdateRequest from "../models/profileUpdateRequest.model.js";
import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Create a profile update request
export const createRequest = catchAsync(async (req, res, next) => {
    const { firstName, lastName, gender, phone, email, nric, nationality, address } = req.body;

    // Check if there is already a pending request for this user
    const existingRequest = await ProfileUpdateRequest.findOne({ userId: req.user.id, status: 'pending' });
    if (existingRequest) {
        return next(new AppError('You already have a pending profile update request. Please wait for admin approval.', 400));
    }

    const newRequest = await ProfileUpdateRequest.create({
        userId: req.user.id,
        requestedData: {
            firstName,
            lastName,
            gender,
            phone,
            email,
            nric,
            nationality,
            address
        }
    });

    res.status(201).json({
        success: true,
        message: 'Profile update request submitted successfully',
        data: newRequest
    });
});

// Get all profile update requests (Admin only)
export const getAllRequests = catchAsync(async (req, res, next) => {
    const requests = await ProfileUpdateRequest.find({ status: 'pending' })
        .populate('userId', 'firstName lastName email userId')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
    });
});

// Approve a profile update request (Admin only)
export const approveRequest = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const request = await ProfileUpdateRequest.findById(id);
    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    if (request.status !== 'pending') {
        return next(new AppError('This request has already been processed', 400));
    }

    // Update User data
    const user = await User.findById(request.userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const { requestedData } = request;

    // Mapping and normalizing data
    if (requestedData.firstName) user.firstName = requestedData.firstName;
    if (requestedData.lastName) user.lastName = requestedData.lastName;
    if (requestedData.gender) user.gender = requestedData.gender.toLowerCase();
    if (requestedData.phone) user.Phone = requestedData.phone; // Note: Phone is capital P in User model
    if (requestedData.email) user.email = requestedData.email;
    if (requestedData.nric) user.nric = requestedData.nric;
    if (requestedData.nationality) user.nationality = requestedData.nationality;
    if (requestedData.address) user.address = requestedData.address;

    await user.save();

    // Delete the request
    await ProfileUpdateRequest.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Profile update request approved and user data updated successfully'
    });
});

// Reject a profile update request (Admin only)
export const rejectRequest = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const request = await ProfileUpdateRequest.findById(id);
    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    // Instead of deleting, we could mark as rejected, but user asked to "delete from requested to update model" upon approval. 
    // For rejection, we'll also delete it or mark it. Let's delete it as per the spirit of keeping it clean.
    await ProfileUpdateRequest.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Profile update request rejected and deleted'
    });
});
