import mongoose from 'mongoose';

const profileUpdateRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestedData: {
        firstName: String,
        lastName: String,
        gender: String,
        phone: String,
        email: String,
        nric: String,
        nationality: String,
        address: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const ProfileUpdateRequest = mongoose.model('ProfileUpdateRequest', profileUpdateRequestSchema);

export default ProfileUpdateRequest;
