const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

// top 5 cheapest tours handler
exports.topFiveCheapest = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    next();
}
exports.getTours = catchAsync(async (req, res, next) => {

    const apiFeatures = new APIFeatures(Tour, req.query);
    apiFeatures.filter().sort().project().paginate();

    const tours = await apiFeatures.query;

    res.status(200).json({
        requestedAt: req.requestedAt,
        status: 'success',
        results: tours.length,
        data: tours
    });
})

exports.makeTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            tour: newTour
        }
    });
})

exports.getTour = catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const tour = await Tour.findById(id);
    console.log(tour);
    console.log(id);
    if (!tour) {
        console.log('iddddddddddddddddddddddddddddd');
        // calling the express global error handling fn then exit.
        return next(new AppError(404, 'Tour not found with this ID.'));
    }

    res.status(200).json({
        status: 'success',
        data: { tour }
    });
})

exports.updateTour = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runvalidators: true
    });

    if (!updatedTour) {
        // calling the express global error handling fn then exit.
        return next(new AppError(404, 'Tour not found'));
    }

    res.status(200).json({
        status: "success",
        data: {
            tour: updatedTour
        }
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) {
        // calling the express global error handling fn then exit.
        return next(new AppError(404, 'Tour not found'));
    }

    res.status(204).json({ status: 'success', data: null });
});

exports.getStatistics = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.6 }
            }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                averageRating: { $avg: '$ratingsAverage' },
                numTours: { $sum: 1 },
                averagePrice: { $avg: '$price' },
                sumPrice: { $sum: '$price' }
            }
        },
        {
            $sort: {
                sumPrice: -1
            }
        },
        // {
        //     $match: {
        //         _id: "DIFFICULT"
        //     }
        // }
    ]);

    res.status(200).json({
        status: 'success',
        data: { stats }
    });
})

exports.countToursPerMonth = catchAsync(async (req, res, next) => {

    const year = parseInt(req.params.year);

    const result = await Tour.aggregate([
        {
            $unwind: "$startDates"
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                count: { $sum: 1 },
                tourNames: { $push: '$name' }
            }
        },
        {
            $addFields: { month: "$_id" }
        },
        {
            $project: { _id: 0 }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $limit: 3
        }
    ]);
    res.status(200).json({
        status: 'success',
        results: result.length,
        data: { result }
    });
})