class APIFeatures {
    constructor(query, queryString) {
        // I THINK WE SHOULD NAME (QUERY) => (MODEL)
        // BUT JONAS DIDN'T DO THAT!!
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['sort', 'page', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryString));

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    project() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query.select(fields);
        } else {
            this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 100;
        const skips = (page - 1) * limit;

        this.query.skip(skips).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;