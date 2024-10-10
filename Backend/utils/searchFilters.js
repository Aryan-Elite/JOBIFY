const Job = require('../models/jobModel');

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
    if (queryString.datePosted) {
        const daysAgo = parseInt(queryString.datePosted);
        
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        const dateFilter = { jobPostedOn: { $gte: date } };
        query = query.find(dateFilter);
        
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

// New function to filter by skills
const filterBySkills = (query, queryString) => {
    if (queryString.skills) {
        const skills = queryString.skills.split(',').map(skill => skill.trim());
        query = query.find({ skillsRequired: { $in: skills } }); // Assuming `skillsRequired` is an array in your Job model
    }
    return query;
};

const excludeExpired = (query) => {
    return query.find({ expired: false });
};

const applyFilters = async (query, queryString) => {
    query = searchByFields(query, queryString);
    query = filterByLocation(query, queryString);
    query = filterByDatePosted(query, queryString);
    query = filterByPay(query, queryString);
    query = filterByExperienceLevel(query, queryString);
    query = filterBySkills(query, queryString); // Apply skills filter
    query = excludeExpired(query);

    // Pagination and limit
    const page = parseInt(queryString.page, 10) || 1;  // Default to page 1 if not specified
    const limit = parseInt(queryString.limit, 10) || 10; // Default to 10 results per page if not specified
    const skip = (page - 1) * limit;  // Number of results to skip
    
    query = query.skip(skip).limit(limit);
    
    return query;
};

module.exports = { applyFilters };
