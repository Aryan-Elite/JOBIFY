class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // Filtering
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]);

        // Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    search() {
        if (this.queryString.title) {            
            this.query = this.query.find({
                title: new RegExp(this.queryString.title, 'i'),
            });
        }

        if (this.queryString.company) {
            this.query = this.query.find({
                company: new RegExp(this.queryString.company, 'i'),
            });
        }
        return this;
    }

    location() {
        if (this.queryString.city || this.queryString.country || this.queryString.location) {
            const filters = {};
            if (this.queryString.city) {
                filters.city = { $regex: this.queryString.city, $options: 'i' };
            }
            if (this.queryString.country) {
                filters.country = { $regex: this.queryString.country, $options: 'i' };
            }
            if (this.queryString.location) {
                filters.location = { $regex: this.queryString.location, $options: 'i' };
            }
            this.query = this.query.find(filters);
        }
        return this;
    }
    
    datePosted() {
        if (this.queryString.datePosted) {
            let startDate = new Date();
            console.log('Date filter:', this.queryString.datePosted);
    
            switch (this.queryString.datePosted) {
                case 'last24hours':
                    startDate.setDate(startDate.getDate() - 1);
                    break;
                case 'last3days':
                    startDate.setDate(startDate.getDate() - 3);
                    break;
                case 'last7days':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                default:
                    startDate = new Date(0); // Earliest possible date
            }
    
            console.log('Start date:', startDate.toISOString());
    
            this.query = this.query.find({
                jobPostedOn: { $gte: startDate }
            });
    
            // Log the constructed MongoDB query
            console.log('MongoDB Query:', this.query.getQuery());
        }
        return this;
    }
    pay() {
        if (this.queryString.pay) {
            // Parse the pay query parameter
            console.log(this.queryString.pay);
            console.log(typeof(this.queryString.pay));
            
            
            const minPay = parseInt(this.queryString.pay);
        console.log('minpay:', minPay);
        console.log(typeof(minPay));
        
        
            // Filter jobs where:
            // - fixedSalary is greater than or equal to minPay
            // - or salaryFrom is less than or equal to minPay and salaryTo is greater than or equal to minPay
            this.query = this.query.find({
                $or: [
                    { fixedSalary: { $gte: minPay } },
                    { 
                        salaryFrom: { $lte: minPay },
                        salaryTo: { $gte: minPay }
                    }
                ]
            });
        }
        return this;
    }
    

    experienceLevel() {
        if (this.queryString.experienceLevel) {
            this.query = this.query.find({ experienceLevel: this.queryString.experienceLevel });
        }
        return this;
    }

    excludeExpired() {
        this.query = this.query.find({ expired: false });
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = ApiFeatures;


