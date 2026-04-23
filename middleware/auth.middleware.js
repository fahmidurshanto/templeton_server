import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { setAccessCookies } from "../utils/response.js";
import { decodeToken, generateAccessToken } from "../utils/token.js";



export const isAuthenticated = catchAsync(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies?.refreshToken;
    
    if (!accessToken && !refreshToken) {
        throw new AppError('You are not logged in', 401);
    }

    if (accessToken) {
        try {
            const decoded = decodeToken(accessToken);
            req.user = decoded;
            return next();
        } catch (accessError) {
            // If accessToken is invalid/expired, only continue if we have a refreshToken
            if (!refreshToken) {
                throw accessError;
            }
        }
    }

    // Attempt to refresh with refreshToken if accessToken failed or was missing
    if (refreshToken) {
        try {
            const decodedRefresh = decodeToken(refreshToken);
            const user = await User.findById(decodedRefresh.userId);
            if (!user) throw new AppError('User no longer exists', 401);

            const newAccessToken = generateAccessToken(user);
            const accessMaxAge = Number(process.env.ACCESS_COOKIES_VALIDITY);
            if (isNaN(accessMaxAge)) throw new Error('Invalid cookie validity');
            
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: accessMaxAge * 60 * 1000,
            });

            req.user = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            };

            return next();
        } catch (refreshError) {
            throw new AppError('Session expired. Please log in again.', 401);
        }
    }
});


export const setAccessCookie = catchAsync(async (req, res, next) => {
    if (req.accessToken) {
        const accessMaxAge = Number(process.env.ACCESS_COOKIES_VALIDITY);
        if (isNaN(accessMaxAge)) {
            throw new Error('ACCESS_COOKIES_VALIDITY must be a number');
        }

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: accessMaxAge * 60 * 1000, // convert minutes to milliseconds
        });
    }
    next();
});


export const isAdmin = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    req.user = user;
    if (!user) {
        throw new AppError('Access denied. Admins only.', 403);
    } else if (user.role !== 'admin') {
        throw new AppError('Access denied. Admins only.', 403);
    }

    next();
});