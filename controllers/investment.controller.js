import Investment from "../models/investment.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";



export const createInvestment = catchAsync(async (req, res) => {
    const { name, year, month, amount, user } = req.body;

    if (!name || !year || !month || !user) {
        throw new AppError("All fields are required")
    }
    const userExists = await User.findById(user);
    if (!userExists) {
        throw new AppError('User not found', 404);
    }

    const investment = await Investment.create({ name, year, month, user, amount });
    res.status(201).json({
        success: true,
        message: 'Investment Created',
        investment
    });
});



export const setInvestmentValidity = catchAsync(async (req, res) => {
    const { valid, investmentId } = req.body;

    if (valid !== true && valid !== false) {
        throw new AppError('valid must be either "true" or "false"', 400)
    }

    const investment = await Investment.findById(investmentId)
    if (!investment) {
        throw new AppError('Investment not found', 400);
    }

    if (investment.isValid === valid) {
        throw new AppError("Unchanged", 400)
    }

    investment.isValid = valid;

    await investment.save();

    res.status(201).json({
        success: true,
        message: 'Investment Updated',
        investment
    });
});


export const getInvestment = catchAsync(async (req, res) => {
    const { year } = req.query;
    const { userId } = req.body;

    if (!userId) throw new AppError("UserId is required", 400);

    // Build the query filter dynamically
    const filter = { user: userId };
    if (year) filter.year = year;

    const investments = await Investment.find(filter);

    if (investments.length === 0) {
        throw new AppError("Investment not found", 404);
    }

    res.status(200).json({
        success: true,
        investments
    });
});


export const getInvestmentById = catchAsync(async (req, res) => {
    const { investmentId } = req.params;

    if (!investmentId) throw new AppError("InvestmentId is required", 400)
    const investment = await Investment.findById(investmentId)

    if (!investment) throw new AppError("Investment not found", 200);
    res.status(201).json({
        success: true,
        investment
    });


});

