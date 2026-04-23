import Schedule from "../models/schedule.model.js";
import catchAsync from './../utils/catchAsync.js';

export const createSchedule = catchAsync(async (req, res, next) => {
    const { title, time, type, description, userId } = req.body;

    const schedule = await Schedule.create({
        title,
        time,
        type,
        description,
        user: userId
    });

    res.status(201).json({
        success: true,
        message: 'Schedule created successfully',
        data: schedule
    });


});



export const getSchedulesByUser = catchAsync(async (req, res, next) => {

    const userId = req.user.id || req.user._id; // handle both id and _id from auth middleware

    const schedules = await Schedule.find({ user: userId })
        .sort({ time: 1 }); // optional: sort by time

    res.status(200).json({
        success: true,
        count: schedules.length,
        data: schedules
    });

});


export const getCurrentWeekSchedules = catchAsync(async (req, res, next) => {

    const now = new Date();

    // start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // end of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const schedules = await Schedule.find({
        user: req.user.id || req.user._id,
        time: {
            $gte: startOfWeek,
            $lte: endOfWeek
        }
    }).sort({ time: 1 });

    res.status(200).json({
        success: true,
        count: schedules.length,
        data: schedules
    });

});




export const getUpcomingSchedules = catchAsync(async (req, res, next) => {

    const now = new Date();

    const schedules = await Schedule.find({
        user: req.user.id || req.user._id,
        time: { $gt: now }
    }).sort({ time: 1 });

    res.status(200).json({
        success: true,
        count: schedules.length,
        data: schedules
    });

});



export const getPastSchedules = catchAsync(async (req, res, next) => {

    const now = new Date();

    const schedules = await Schedule.find({
        user: req.user.id || req.user._id,
        time: { $lt: now }
    }).sort({ time: -1 }); // latest past first

    res.status(200).json({
        success: true,
        count: schedules.length,
        data: schedules
    });

});


export const deleteSchedule = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const schedule = await Schedule.findById(id);

    if (!schedule) {
        return res.status(404).json({
            success: false,
            message: 'Schedule not found'
        });
    }

    await schedule.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Schedule deleted successfully'
    });

});

// Admin: get all schedules for any user by userId param
export const getSchedulesByUserAdmin = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const schedules = await Schedule.find({ user: userId })
        .sort({ time: 1 });

    res.status(200).json({
        success: true,
        count: schedules.length,
        data: schedules
    });
});

// Admin: get literally all schedules across all users
export const getAllSchedulesAdmin = catchAsync(async (req, res, next) => {
    const schedules = await Schedule.find()
        .populate('user', 'firstName lastName name email')
        .sort({ time: 1 });

    res.status(200).json({
        success: true,
        count: schedules.length,
        data: schedules
    });
});
