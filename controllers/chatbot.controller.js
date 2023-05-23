const catchAsync = require("../utils/catchAsync");
const axios = require('axios');

const index = catchAsync(async (req, res) => {
    try {
        // Make a GET request to an external API
        const response = await axios.get(process.env.LIRARATE_API);

        if (response.status !== 200) {
            throw Error('Error in retrieving data');
        }
        // var liraSell = response.data.lirarate.sell[response.data.lirarate.sell.length - 1][1];
        var liraBuy = response.data.lirarate.buy;

        res.render('chatbot', {
            liraData: {
                liraBuy: liraBuy
            }, session: req.session
        });
    } catch (error) {
        console.log('failed');
        res.render('chatbot', {title: 'FYP', liraDataError: 'Error in retrieving data', session: req.session});
    }
});

module.exports = {
    index,
};
