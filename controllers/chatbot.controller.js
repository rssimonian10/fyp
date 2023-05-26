const catchAsync = require("../utils/catchAsync");
const generateDatePattern = require("../utils/generateDatePattern");
const axios = require('axios');

const index = catchAsync(async (req, res) => {
    try {
        console.log(generateDatePattern());
        // Make a GET request to an external API
        const response = await axios.get(process.env.LIRARATE_API)

        if (response.status !== 200) {
            throw Error('Error in retrieving data');
        }
        var liraBuy = response.data.lirarate.buy;

        res.render('chatbot', {
            liraData: {
                liraBuy: liraBuy
            }, session: req.session
        });
    } catch (error) {
        console.log('failed');
        res.render('chatbot', {title: 'FYP', 
        liraDataError: 'Error in retrieving data', 
        session: req.session});
    }
});

module.exports = {
    index,
};
