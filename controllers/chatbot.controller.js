const catchAsync = require("../utils/catchAsync");
const axios = require('axios');

const index = catchAsync(async (req, res) => {
    try {
        // Make a GET request to an external API
        const response = await axios.get(process.env.LIRARATE_API);

        if (response.status !== 200) {
            throw Error('Error in retrieving data');
        }
        var liraSell = response.data.lirarate.sell[response.data.lirarate.sell.length - 1][1];
        var liraBuy = response.data.lirarate.buy[response.data.lirarate.buy.length - 1][1];
        var fuelData = [];
        var fuelName;
        var fuelPrice;
        response.data.fuel.forEach(function(fuelType){
            fuelName = fuelType.name;
            fuelPrice = fuelType.data[fuelType.data.length -1][1];
            fuelData.push({ fuelName: fuelName, fuelPrice});
        });
        res.render('index', {
            liraData: {
                liraSell: liraSell,
                liraBuy: liraBuy,
                fuelData: fuelData,
            }
        });
    } catch (error) {
        console.log('failed');
        res.render('index', {title: 'Express', liraDataError: 'Error in retrieving data'});
    }
});

module.exports = {
    index,
};
