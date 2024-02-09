const express = require('express');

const {
    getTours,
    makeTour,
    getTour,
    updateTour,
    deleteTour,
    checkId,
    checkTourBody,
    topFiveCheapest,
    getStatistics,
    countToursPerMonth
} = require('../controllers/toursControllers');

const router = express.Router();

// router.param('id', checkId);

// top five cheapest tours route (WE MAKE THIS AS AN ((ALIAS))) BECAUSE WE WILL USE IT ALOT.
router.route('/top-5-cheapest').get(topFiveCheapest, getTours);
// router.route('/').get(getTours).post(checkTourBody, makeTour);

// tours statistics
router.route('/tours-statistics').get(getStatistics);

// tours count per month
router.route('/tours-per-month/:year').get(countToursPerMonth);

router.route('/').get(getTours).post(makeTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;/* The `exports.checkId` function is a middleware function that is used to check if the `id`
parameter in the request URL is valid. It takes four parameters: `req` (the request object),
`res` (the response object), `next` (a function to call the next middleware function), and
`value` (the value of the `id` parameter). */
/* The `exports.checkId` function is a middleware function that checks if the `id` parameter exists in
the request parameters. It extracts the `id` from the request parameters using `req.params` and then
calls the `next` function to pass control to the next middleware function. */
