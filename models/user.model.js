import mongoose from 'mongoose';
import { encryptText, decryptText } from '../utils/encryption.js';

// ─── Membership tier sub-schema ───────────────────────────────────────────────
const membershipTierSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },
        type: {
            type: String,
            enum: ['primary', 'third_party'],
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive'
        },
        benefits: {
            type: [String],
            default: []
        }
    },
    { _id: false }
);

// ─── User Service sub-schema ──────────────────────────────────────────────────
const userServiceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ['Valid', 'Invalid'],
            default: 'Valid'
        }
    },
    { _id: false }
);

const defaultServices = [
    { name: 'Termination', status: 'Valid' },
    { name: 'Capital Gain tax', status: 'Valid' },
    { name: 'Trustee fees', status: 'Valid' },
    { name: 'Anti Money laundering', status: 'Valid' },
    { name: 'Remittance', status: 'Valid' },
    { name: 'Custody & services fees', status: 'Valid' }
];

// ─── User schema ──────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    Phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,            // 👈 Added unique constraint
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true, 'Gender is required']
    },
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        unique: true,             // already unique
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,             // already unique
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    nric: {
        type: String,
        required: [true, 'NRIC is required'],
        unique: true,             // already unique
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'suspended'],
        default: 'pending'
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    nationality: {
        type: String,
        required: [true, 'Nationality is required'],
        trim: true
    },
    secondaryEmail: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid secondary email']
    },
    secondaryPhone: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'           // not required – defaults to 'client'
    },
    memberships: {
        type: [membershipTierSchema],
        default: []
    },
    services: {
        type: [userServiceSchema],
        default: defaultServices
    },
    stageVisibility: {
        type: Boolean,
        default: false
    },
    stage: {
        type: [
            {
                sequence: { type: Number },
                name: { type: String, required: true },
                remark: { type: String },
                remarkLabel: { type: String },
                status: { type: String, enum: ['upcoming', 'processed', 'active'], default: 'upcoming' },
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                description: { type: String, required: true },
                time: { type: Date, default: Date.now },
            }
        ],
    }

}, { timestamps: true });

// Encrypt password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    try {
        this.password = encryptText(this.password);
    } catch (error) {
        throw error;
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const decryptedStoredPassword = decryptText(this.password);
        return candidatePassword === decryptedStoredPassword;
    } catch (error) {
        return false;
    }
};

const User = mongoose.model('User', userSchema);
export default User;