const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const validator = require('validator');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name.'],
        unique: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters.'],
        minlength: [10, 'A tour name must have more or equal than 10 characters.'],
        // validate: [validator.isAlpha, 'A tour name must only contain characters.']
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration.']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a max group size.']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty.'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty must be easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price.']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return this.price > val;
            },
            message: 'Discount price ({VALUE}) must be  below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary.']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image.']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    slug: String,
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

schema.virtual("durationInWeeks").get(function () {
    return this.duration / 7;
});

// Document middleware
// pre hook (middleware) => runs after .save() and .create() only
// doesn't run after insertOne() or insertMany() or any other methods.
schema.pre('save', function (next) {
    console.log('pre save');
    next();
});

schema.pre('save', function (next) {
    console.log('pre save 222222');
    const slug = slugify(this.name, { lower: true });
    this.slug = slug;
    next();
});

schema.post('save', function (doc, next) {
    console.log(doc.name + " nameeeeeeeee");
    next();
});

// Query middleware
schema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();

    next();
})
schema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} ms`);
    next();
})

// aggregation middleware
schema.pre('aggregate', function (next) {
    // Add a new field to the pipeline that we can use in our application later on
    console.log(this.pipeline());
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    next();
})

const Tour = mongoose.model('Tour', schema);

module.exports = Tour;