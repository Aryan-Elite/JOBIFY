const Job = require('../models/jobModel');

const filterByFields = (queryString) => {
    const queryObj = { ...queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq)\b/g, match => `$${match}`);
    
    return JSON.parse(queryStr);
};

const searchByFields = (query, queryString) => {
    if (queryString.title) {            
        query = query.find({
            title: new RegExp(queryString.title, 'i'),
        });
    }

    if (queryString.company) {
        query = query.find({
            company: new RegExp(queryString.company, 'i'),
        });
    }
    
    return query;
};

const filterByLocation = (query, queryString) => {
    if (queryString.city || queryString.country || queryString.location) {
        const filters = {};
        if (queryString.city) {
            filters.city = { $regex: queryString.city, $options: 'i' };
        }
        if (queryString.country) {
            filters.country = { $regex: queryString.country, $options: 'i' };
        }
        if (queryString.location) {
            filters.location = { $regex: queryString.location, $options: 'i' };
        }
        query = query.find(filters);
    }
    return query;
};

const filterByDatePosted = (query, queryString) => {
    console.log('Query String:', queryString); // Debugging line
    if (queryString.datePosted) {
        const daysAgo = parseInt(queryString.datePosted);
        console.log('Days Ago:', daysAgo); // Debugging line
        
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        console.log('Date Filter:', date); // Debugging line

        const dateFilter = { jobPostedOn: { $gte: date } };
        query = query.find(dateFilter);
        console.log('Filter Applied:', query.getFilter()); // Debugging line
        
    }
    return query;
};


const filterByPay = (query, queryString) => {
    if (queryString.pay) {
        const minPay = parseInt(queryString.pay);
        query = query.find({
            $or: [
                { fixedSalary: { $gte: minPay } },
                {
                    salaryFrom: { $lte: minPay },
                    salaryTo: { $gte: minPay }
                }
            ]
        });
    }
    return query;
};

const filterByExperienceLevel = (query, queryString) => {
    if (queryString.experienceLevel) {
        query = query.find({ experienceLevel: queryString.experienceLevel });
    }
    return query;
};

const excludeExpired = (query) => {
    return query.find({ expired: false });
};

const applyFilters = async (query, queryString) => {
    query = query.find(filterByFields(queryString));
    query = searchByFields(query, queryString);
    query = filterByLocation(query, queryString);
    query = filterByDatePosted(query, queryString);
    query = filterByPay(query, queryString);
    query = filterByExperienceLevel(query, queryString);
    query = excludeExpired(query);
    
    return query;
};

module.exports = { applyFilters };
