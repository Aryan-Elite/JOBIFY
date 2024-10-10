const axios = require('axios');  // Replacing request with axios
const cheerio = require('cheerio');
const PaperModel = require('../models/paperModel');
const catchAsync = require('../utils/catchAsync');
const url = "https://www.indiabix.com/placement-papers/accenture/6611";

exports.scrapeAndSavePapers = catchAsync(async (req, res) => {
    try {
        console.log('Before fetching data');

        // Fetching the HTML using axios with proper https agent configuration
        const response = await axios.get(url, { 
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false }) 
        });

        if (response.status !== 200) {
            console.log(`Failed to fetch data, status code: ${response.status}`);
            return res.status(500).json({ error: "Failed to fetch data from the source" });
        }

        // Extract the company name from the URL
        const companyName = extractCompanyName(url);

        // Parse the HTML data using Cheerio
        const scrapedData = handleHtml(response.data);

        if (!scrapedData || scrapedData.length === 0) {
            console.log("No data scraped from the page");
            return res.status(400).json({ error: "No data found in the source page" });
        }

        // Create a new PaperModel document with company name and scraped content
        const paperData = new PaperModel({ 
            company: companyName, 
            content: scrapedData 
        });

        // Save the scraped data into MongoDB
        await paperData.save();

        // console.log('Scraped data successfully saved to the database');
        
        // Send the scraped data in the response
        return res.status(200).json({ 
            message: "Data scraped and saved successfully", 
            data: paperData 
        });

    } catch (error) {
        console.error("Error during scraping or saving:", error);
        res.status(500).json({ error: "Internal Server Error during scraping process" });
    }
});

// Function to parse and extract data from HTML using Cheerio
function handleHtml(html) {
    const $ = cheerio.load(html);
    const elemsArr = $(".paper-data");
    
    if (!elemsArr || elemsArr.length === 0) {
        console.log("No .paper-data elements found in the page");
        return null;
    }

    // Extract and clean text content
    const text = $(elemsArr).text().trim();  // Added trim() to remove unnecessary spaces

    console.log("Scraped text data:", text);

    // Returning text data for saving to the database
    return text;
}

// Function to extract company name from the URL
function extractCompanyName(url) {
    const parts = url.split('/');
    const companyIndex = parts.indexOf('placement-papers') + 1;
    return parts[companyIndex] || 'Unknown';  // Default to 'Unknown' if company name is not found
}
