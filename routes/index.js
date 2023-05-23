var express = require('express');
const userRoute = require('./users');
const authRoute = require('./auth');
var liraController = require('../controllers/liraRate.controller');


var router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/',
    route: authRoute,
  }
];

/* GET home page. */
router.get('/', liraController.index);
router.get('/news', function(req, res, next) {
  res.render('news', { title: 'Express' });
});
router.get('/chatbot', function(req, res, next) {
  res.render('chatbot', { title: 'Express' });
});
router.get('/about-us', function(req, res, next) {
  res.render('about-us', { title: 'Express' });
});
router.get('/contact-us', function(req, res, next) {
  res.render('contact-us', { title: 'Express' });
});

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
});

module.exports = router;
